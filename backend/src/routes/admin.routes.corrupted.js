import express from "express";
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import { JWT_SECRET } from "../config/env.js";

const router = express.Router();

/*
=================================================
PUBLIC TEST ROUTE
=================================================
*/

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin router works",
  });
});

/*
=================================================
ADMIN LOGIN
=================================================
*/

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        email,
        password_hash
      FROM admin_users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Email not found",
      });
    }

    const admin = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        isAdmin: true,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/*
======*==================================*=======
PROTECT ALL ROUTES BELOW
=*==================================*============
*/

router.use(verifyAdminToken);

/*
==================*==============================
ADM*N DASHBOARD
======================*==========================
*/

router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "Dashboard access granted",
    admin: req.admin,
  });
});

/*
=================================================
ADMIN PROFILE
=================================================
*/

router.get("/profile", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        email
      FROM admin_users
      WHERE id = $1
      `,
      [req.admin?.adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    res.json({
      success: true,
      admin: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/*
=================================================
PENDING PROVIDERS
=================================================
*/
router.get("/providers/pending", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        document_path,
        status AS provider_status,
        approved,
        document_uploaded,
        user_id
      FROM providers
      WHERE approved = false
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      providers: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});
 
/*
=================================================
APPROVE PROVIDER
=================================================
*/

router.put("/providers/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE providers
      SET
        approved = true,
        status = 'approved'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Provider not found",
      });
    }

    res.json({
      success: true,
      message: "Provider approved",
      provider: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE users
      SET provider_status = 'approved'
      WHERE id = $1
      RETURNING id, email, provider_status
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Provider not found",
      });
    }

    res.json({
      success: true,
      message: "Provider approved",
      provider: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/*
=================================================
REJECT PROVIDER
=================================================
*/
router.put("/providers/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE providers
      SET
        status = 'rejected'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Provider not found",
      });
    }

    res.json({
      success: true,
      message: "Provider rejected",
      provider: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE users
      SET provider_status = 'rejected'
      WHERE id = $1
      RETURNING id, email, provider_status
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Provider not found",
      });
    }

    res.json({
      success: true,
      message: "Provider rejected",
      provider: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/*
=================================================
PENDING SERVICES
=================================================
*/

router.get("/services/pending", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        provider_id,
        title,
        description,
        price,
        status,
        created_at
      FROM services
      WHERE status = 'pending'
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      services: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/*
=================================================
APPROVE SERVICE
=================================================
*/

router.put("/services/:id/approve", async (req, res) => {
 
/*
=================================================
REJECT SERVICE
=================================================
*/

router.put("/services/:id/reject", async (req, res) => {
  
/*
=================================================
ADMIN STATS
=================================================
*/

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await pool.query(`
      SELECT COUNT(*) AS count
      FROM users
    `);

    const totalProviders = await pool.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE is_provider = true
    `);

    const pendingProviders = await pool.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE provider_status = 'pending'
    `);

    const approvedProviders = await pool.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE provider_status = 'approved'
    `);

    res.json({
      success: true,
      stats: {
        totalUsers: Number(totalUsers.rows[0].count),
        totalProviders: Number(totalProviders.rows[0].count),
        pendingProviders: Number(pendingProviders.rows[0].count),
        approvedProviders: Number(approvedProviders.rows[0].count),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
