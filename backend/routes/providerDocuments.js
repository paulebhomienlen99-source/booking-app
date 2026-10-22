
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { Client } = require("pg");
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
client.connect();

const authProvider = require("../middleware/authProvider");

router.post("/", authProvider, upload.single("file"), async (req, res) => {
  try {
    const { document_type } = req.body;

    if (!document_type || !req.file) {
      return res.status(400).json({ error: "Missing document_type or file" });
    }

    const providerResult = await client.query(
      "SELECT * FROM providers WHERE user_id = $1",
      [req.user.id]
    );

    const provider = providerResult.rows[0];
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    const insertResult = await client.query(
      `INSERT INTO provider_documents 
       (provider_id, document_type, document_url, document_name, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        provider.id,
        document_type,
        req.file.path,
        req.file.originalname,
        "pending"
      ]
    );

    const doc = insertResult.rows[0];

    res.json({ success: true, document: doc });
  } catch (err) {
    console.error("Document upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
