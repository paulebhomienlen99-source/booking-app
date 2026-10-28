import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { pool } from "../config/db.js";

import {
  createListingService,
  getProviderServicesService,
} from "../services/listing.service.js";

export const createListing = async (
  req,
  res
) => {
  try {
   console.log("BODY:", req.body);
console.log("FILE:", req.file);
console.log("USER:", req.user); 
    const providerResult =
      await pool.query(
        `
        SELECT id
        FROM providers
        WHERE user_id = $1
        `,
        [req.user.id]
      );

    if (
      providerResult.rows.length === 0
    ) {
      return res.status(404).json({
        error: "Provider non trovato",
      });
    }

    const providerId =
      providerResult.rows[0].id;

    let image_url = null;

    if (req.file) {
      const uploadResult =
        await new Promise(
          (resolve, reject) => {
            const uploadStream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "booking-app/services",
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

      image_url =
        uploadResult.secure_url;
    }

    const result =
      await createListingService({
        provider_id: providerId,
        image_url,
        ...req.body,
      });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMyServices = async (
  req,
  res
) => {
  try {
    const providerResult =
      await pool.query(
        `
        SELECT id
        FROM providers
        WHERE user_id = $1
        `,
        [req.user.id]
      );

    if (
      providerResult.rows.length === 0
    ) {
      return res.json([]);
    }

    const providerId =
      providerResult.rows[0].id;

    const services =
      await getProviderServicesService(
        providerId
      );

    res.json(services);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};
