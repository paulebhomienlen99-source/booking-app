import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { captureOrder } from "../../api/payments";
import Layout from "../../components/Layout";

export default function PaymentSuccess() {
  const [message, setMessage] = useState(
    "Conferma pagamento in corso..."
  );

  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    async function completePayment() {
      try {
        const orderId =
          searchParams.get("token");

        if (!orderId) {
          setMessage(
            "Ordine PayPal non trovato"
          );
          return;
        }

        const response =
          await captureOrder(orderId);

        if (response.data.success) {
          setMessage(
            "✅ Pagamento completato e prenotazione confermata"
          );

          setTimeout(() => {
  navigate("/customer/bookings");
}, 2000);
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "❌ Errore durante la conferma del pagamento"
        );
      }
    }

    completePayment();
  }, [searchParams, navigate]);

  return (
    <Layout>
      <div className="p-8">
        <h2 className="text-2xl font-bold">
          {message}
        </h2>
      </div>
    </Layout>
  );
}