import crypto from "node:crypto";

import { pool } from "../config/db.js";

import {
  PAYPAL_API_BASE_URL,
  getPayPalAccessToken,
} from "../config/paypal.js";

import {
  createReservationService,
} from "../services/reservation.service.js";
import { sendMail } from "../config/email.js";
async function readPayPalResponse(
  response
) {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      "PAYPAL_API_ERROR"
    );

    error.status = response.status;
    error.details = data;

    throw error;
  }

  return data;
}

export async function createOrder(
  req,
  res
) {
  try {
    const customerId = req.user.id;

    const listingId = Number(
      req.body.listing_id
    );

    const slotId = Number(
      req.body.slot_id
    );

    if (
      !Number.isInteger(listingId) ||
      !Number.isInteger(slotId)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "listing_id e slot_id sono obbligatori",
      });
    }

    /*
     * Il prezzo viene letto dal database.
     * Non accettiamo il prezzo dal frontend.
     */
    const serviceResult =
      await pool.query(
        `
        SELECT
          s.id,
          s.price,
          s.provider_id,
          sl.id AS slot_id,
          sl.status AS slot_status
        FROM services s
        JOIN availability_slots sl
          ON sl.service_id = s.id
        WHERE s.id = $1
          AND sl.id = $2
        `,
        [
          listingId,
          slotId,
        ]
      );

    if (
      serviceResult.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        error:
          "Servizio o slot non trovato",
      });
    }

    const service =
      serviceResult.rows[0];

    if (
      service.slot_status !==
      "available"
    ) {
      return res.status(409).json({
        success: false,
        error:
          "Lo slot non è disponibile",
      });
    }

    const amount = Number(
      service.price
    ).toFixed(2);

    const currency = "EUR";

    const accessToken =
      await getPayPalAccessToken();

    const paypalResponse =
      await fetch(
        `${PAYPAL_API_BASE_URL}/v2/checkout/orders`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
            "PayPal-Request-Id":
              crypto.randomUUID(),
            Prefer:
              "return=representation",
          },
          body: JSON.stringify({
  intent: "CAPTURE",
 application_context: {
  return_url:
    "http://localhost:5173/payment-success",
  cancel_url:
    "http://localhost:5173/payment-cancel",
},
  purchase_units: [
              {
                reference_id:
                  `service-${listingId}-slot-${slotId}`,
                description:
                  "Prenotazione BookHub",
                amount: {
                  currency_code:
                    currency,
                  value: amount,
                },
              },
            ],
          }),
        }
      );

    const paypalOrder =
      await readPayPalResponse(
        paypalResponse
      );

    await pool.query(
      `
      INSERT INTO payment_orders (
        paypal_order_id,
        customer_id,
        listing_id,
        slot_id,
        amount,
        currency,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        'CREATED'
      )
      `,
      [
        paypalOrder.id,
        customerId,
        listingId,
        slotId,
        amount,
        currency,
      ]
    );

    const approvalUrl =
      paypalOrder.links?.find(
        (link) =>
          link.rel === "approve"
      )?.href || null;

    return res.status(201).json({
      success: true,
      orderId: paypalOrder.id,
      status: paypalOrder.status,
      approvalUrl,
      amount,
      currency,
    });
  } catch (error) {
    console.error(
      "CREATE PAYPAL ORDER ERROR:",
      error.details || error
    );

    return res
      .status(error.status || 500)
      .json({
        success: false,
        error:
          "Impossibile creare l'ordine PayPal",
        details:
          error.details || undefined,
      });
  }
}

export async function captureOrder(
  req,
  res
) {
  try {
    const customerId = req.user.id;

    const orderId =
      String(
        req.body.orderId || ""
      ).trim();

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error:
          "orderId obbligatorio",
      });
    }

    const paymentResult =
      await pool.query(
        `
        SELECT *
        FROM payment_orders
        WHERE paypal_order_id = $1
          AND customer_id = $2
        `,
        [
          orderId,
          customerId,
        ]
      );

    if (
      paymentResult.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        error:
          "Ordine di pagamento non trovato",
      });
    }

    const payment =
      paymentResult.rows[0];
const userResult = await pool.query(
  `
  SELECT email
  FROM users
  WHERE id = $1
  `,
  [customerId]
);

const customerEmail =
  userResult.rows[0]?.email;
    /*
     * Risposta idempotente:
     * non crea una seconda prenotazione.
     */
    if (
      payment.status ===
        "COMPLETED" &&
      payment.reservation_id
    ) {
      return res.json({
        success: true,
        alreadyCompleted: true,
        orderId,
        status: "COMPLETED",
        reservationId:
          payment.reservation_id,
      });
    }

    const accessToken =
      await getPayPalAccessToken();

    const paypalResponse =
      await fetch(
        `${PAYPAL_API_BASE_URL}/v2/checkout/orders/${encodeURIComponent(
          orderId
        )}/capture`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
            "PayPal-Request-Id":
              crypto.randomUUID(),
            Prefer:
              "return=representation",
          },
          body: JSON.stringify({}),
        }
      );

    const paypalOrder =
      await readPayPalResponse(
        paypalResponse
      );

    if (
      paypalOrder.status !==
      "COMPLETED"
    ) {
      return res.status(409).json({
        success: false,
        error:
          "Pagamento PayPal non completato",
        status: paypalOrder.status,
      });
    }

    const capture =
      paypalOrder
        .purchase_units?.[0]
        ?.payments
        ?.captures?.[0];

    if (!capture) {
      return res.status(502).json({
        success: false,
        error:
          "Dettagli della cattura PayPal mancanti",
      });
    }

    const capturedAmount =
      capture.amount?.value;

    const capturedCurrency =
      capture.amount?.currency_code;

    if (
      capturedAmount !==
        Number(
          payment.amount
        ).toFixed(2) ||
      capturedCurrency !==
        payment.currency
    ) {
      return res.status(409).json({
        success: false,
        error:
          "Importo PayPal non corrispondente",
      });
    }

    /*
     * Crea la prenotazione soltanto
     * dopo COMPLETED.
     */
    const reservation =
  await createReservationService({
    customer_id: customerId,
    listing_id:
      payment.listing_id,
    slot_id:
      payment.slot_id,
    payment_status:
      "completed",
  });
    try {
  await sendMail({
  to: customerEmail,
    subject: "Prenotazione confermata",
    html: `
      <h2>Prenotazione confermata ✅</h2>
      <p>La tua prenotazione è stata registrata con successo.</p>
      <p>ID prenotazione: ${reservation.id}</p>
    `,
  });
const providerResult =
  await pool.query(
    `
    SELECT email
    FROM providers
    WHERE id = $1
    `,
    [reservation.provider_id]
  );

const providerEmail =
  providerResult.rows[0]?.email;

if (providerEmail) {
  await sendMail({
    to: providerEmail,
    subject: "Nuova prenotazione ricevuta",
    html: `
      <h2>✅ Nuova prenotazione ricevuta</h2>

      <p>
        Hai ricevuto una nuova prenotazione.
      </p>

      <p>
        ID prenotazione:
        ${reservation.id}
      </p>
    `,
  });

  console.log(
    "EMAIL PROVIDER INVIATA ✅"
  );
}
  console.log("EMAIL INVIATA ✅");
console.log("EMAIL PROVIDER INVIATA ✅");

  
} catch (mailError) {
  console.error(
    "EMAIL ERROR:",
    mailError
  );
}

    await pool.query(
      `
      UPDATE payment_orders
      SET
        paypal_capture_id = $1,
        status = 'COMPLETED',
        reservation_id = $2,
        updated_at = now()
      WHERE paypal_order_id = $3
      `,
      [
        capture.id,
        reservation.id,
        orderId,
      ]
    );

    return res.json({
      success: true,
      orderId,
      captureId: capture.id,
      status: "COMPLETED",
      reservation,
    });
  } catch (error) {
    console.error(
      "CAPTURE AND RESERVATION ERROR:",
      error.details || error
    );

    return res
      .status(error.status || 500)
      .json({
        success: false,
        error:
          error.message ===
          "PAYPAL_API_ERROR"
            ? "Impossibile acquisire il pagamento PayPal"
            : error.message,
        details:
          error.details || undefined,
      });
  }
}