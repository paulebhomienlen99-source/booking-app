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

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
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

router.use(verifyAdminToken);

/*
=================================================
DASHBOARD
=================================================
*/

router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

/*
=================================================
PROFILE
=================================================
*/

router.get("/profile", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, email
      FROM admin_users
      WHERE id = $1
      `,
      [req.admin.adminId]
    );

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
      SELECT *
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

    res.json({
      success: true,
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

    await pool.query(
      `
      DELETE FROM providers
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
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
      SELECT *
      FROM services
      WHERE approved = false
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
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE services
      SET approved = true
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    res.json({
      success: true,
      service: result.rows[0],
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
REJECT SERVICE
=================================================
*/

router.put("/services/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM services
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
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
ADMIN STATS
=================================================
*/

router.get("/stats", async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT COUNT(*) FROM users`
    );

    const providers = await pool.query(
      `SELECT COUNT(*) FROM providers`
    );

    const services = await pool.query(
      `SELECT COUNT(*) FROM services`
    );

    const reservations =
      await pool.query(
        `SELECT COUNT(*) FROM reservations`
      );

    const cancelledReservations =
      await pool.query(
        `
        SELECT COUNT(*)
        FROM reservations
        WHERE status = 'cancelled'
        `
      );

    const reviews =
      await pool.query(
        `SELECT COUNT(*) FROM reviews`
      );

    const revenue =
      await pool.query(
        `
        SELECT COALESCE(
          SUM(s.price),
          0
        ) AS revenue
        FROM reservations r
        JOIN services s
          ON s.id = r.listing_id
        WHERE r.status = 'confirmed'
        `
      );

    const approvedProviders =
      await pool.query(
        `
        SELECT COUNT(*)
        FROM providers
        WHERE approved = true
        `
      );
const monthlyRevenue =
  await pool.query(
    `
    SELECT
      TO_CHAR(
        DATE_TRUNC('month', r.created_at),
        'Mon'
      ) AS month,

      COALESCE(
        SUM(s.price),
        0
      ) AS revenue

    FROM reservations r

    JOIN services s
      ON s.id = r.listing_id

    WHERE r.status = 'confirmed'

    GROUP BY
      DATE_TRUNC('month', r.created_at)

    ORDER BY
      DATE_TRUNC('month', r.created_at)
    `
  );
    res.json({
      success: true,
      stats: {
        users: Number(
          users.rows[0].count
        ),

        providers: Number(
          providers.rows[0].count
        ),

        approvedProviders:
          Number(
            approvedProviders
              .rows[0].count
          ),

        services: Number(
          services.rows[0].count
        ),

        reservations:
          Number(
            reservations
              .rows[0].count
          ),

        cancelledReservations:
          Number(
            cancelledReservations
              .rows[0].count
          ),

        reviews: Number(
          reviews.rows[0].count
        ),

        revenue: Number(
  revenue.rows[0].revenue
),

monthlyRevenue:
  monthlyRevenue.rows,
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
router.get("/reservations", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.status,
        r.created_at,
        u.email AS customer_name,
        s.title AS service_name
      FROM reservations r
      JOIN users u
        ON u.id = r.customer_id
      JOIN services s
        ON s.id = r.listing_id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      reservations: result.rows,
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