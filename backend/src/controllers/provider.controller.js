import streamifier from "streamifier";

import cloudinary from "../config/cloudinary.js";

import {
  createProviderService,
  uploadDocumentService,
  approveProviderService,
  getProviderReservationsService,
} from "../services/provider.service.js";

import { pool } from "../config/db.js";

export const createProvider = async (
  req,
  res
) => {
  try {
    const {
      name,
      phone,
    } = req.body;

    const result =
      await createProviderService({
        name,
        email: req.user.email,
        phone,
        user_id: req.user.id,
      });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const uploadDocument = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "File mancante",
      });
    }

    const uploadResult =
      await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "booking-app/providers",
                resource_type: "auto",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                  return;
                }

                resolve(result);
              }
            );

          streamifier
            .createReadStream(
              req.file.buffer
            )
            .pipe(uploadStream);
        }
      );

    const providerQuery =
      await pool.query(
        `
        SELECT id
        FROM providers
        WHERE user_id = $1
        LIMIT 1
        `,
        [req.user.id]
      );

    if (
      providerQuery.rows.length === 0
    ) {
      return res.status(404).json({
        error:
          "Provider profile non trovato",
      });
    }

    const provider_id =
      providerQuery.rows[0].id;

    await uploadDocumentService({
      provider_id,
      document_path:
        uploadResult.secure_url,
    });

    res.json({
      success: true,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const approveProvider = async (
  req,
  res
) => {
  try {
    const result =
      await approveProviderService(
        req.params.id
      );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getProviderReservations =
  async (req, res) => {
    try {
      const bookings =
        await getProviderReservationsService(
          req.user.id
        );

      res.json(bookings);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
