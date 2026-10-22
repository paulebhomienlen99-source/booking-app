const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// upload documenti
router.post("/upload-document", auth("provider"), upload.single("document"), async (req, res) => {
  await pool.query(
    "INSERT INTO provider_documents (provider_id, type, filename) VALUES ($1,$2,$3)",
    [req.user.id, "documento", req.file.filename]
  );
  res.json({ success: true });
});

// crea servizio
router.post("/create-listing", auth("provider"), async (req, res) => {
  try {
    const {
      title,
      description,
      price
    } = req.body;

    await pool.query(
      `
      INSERT INTO services
      (
        provider_id,
        title,
        description,
        price,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        'pending'
      )
      `,
      [
        req.user.id,
        title,
        description || "",
        price
      ]
    );

    res.json({
      success: true,
      message: "Service created and pending approval"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

// crea slot
router.post("/create-slot", auth("provider"), async (req, res) => {
  const { date, time } = req.body;
  await pool.query(
    "INSERT INTO availability (provider_id, date, time) VALUES ($1,$2,$3)",
    [req.user.id, date, time]
  );
  res.json({ success: true });
});

module.exports = router;
