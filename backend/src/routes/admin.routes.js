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
const topProviders =
  await pool.query(`
    SELECT
      p.name,
      COUNT(r.id) AS bookings
    FROM providers p
    LEFT JOIN reservations r
      ON r.provider_id = p.id
    GROUP BY p.id, p.name
    ORDER BY bookings DESC
    LIMIT 5
  `);
     const topCustomers =
  await pool.query(`
    SELECT
      u.email,
      COUNT(r.id) AS bookings
    FROM users u
    LEFT JOIN reservations r
      ON r.customer_id = u.id
    GROUP BY u.id, u.email
    ORDER BY bookings DESC
    LIMIT 5
    `); 
  const topServices =
  await pool.query(`
    SELECT
      s.title,
      COUNT(r.id) AS bookings
    FROM services s
    LEFT JOIN reservations r
      ON r.listing_id = s.id
    GROUP BY s.id, s.title
    ORDER BY bookings DESC
    LIMIT 5
  `);
   const revenuePerProvider =
  await pool.query(`
    SELECT
      p.name,
      COALESCE(
        SUM(s.price),
        0
      ) AS revenue
    FROM providers p
    LEFT JOIN reservations r
      ON r.provider_id = p.id
      AND r.status = 'confirmed'
    LEFT JOIN services s
      ON s.id = r.listing_id
    GROUP BY p.id, p.name
    ORDER BY revenue DESC
    LIMIT 5
  `); 
  const topRatedProviders =
  await pool.query(`
    SELECT
      p.name,
      ROUND(
        COALESCE(
          AVG(r.rating),
          0
        )::numeric,
        1
      ) AS rating
    FROM providers p
    LEFT JOIN reviews r
      ON r.provider_id = p.id
    GROUP BY p.id, p.name
    ORDER BY rating DESC
    LIMIT 5
  `);
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
topProviders:
  topProviders.rows,
      topCustomers:
  topCustomers.rows,  
  topServices:
  topServices.rows,
  revenuePerProvider:
  revenuePerProvider.rows,
  topRatedProviders:
  topRatedProviders.rows,
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

        p.name AS provider_name,

        s.title AS service_name,
        s.price,

        CASE
          WHEN r.status = 'confirmed'
          THEN 'paid'
          ELSE 'refunded'
        END AS payment_status

      FROM reservations r

      JOIN users u
        ON u.id = r.customer_id

      JOIN providers p
        ON p.id = r.provider_id

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
/*
=================================================
ADMIN USERS
=================================================
*/

router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
  id,
  email,
  role,
  is_active
FROM users
ORDER BY id DESC
    `);

    res.json({
      success: true,
      users: result.rows,
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
=====================================
USER DETAILS
=====================================
*/

router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        is_active,
        reset_token,
        reset_token_expires
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
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
=====================================
CHANGE USER ROLE
=====================================
*/

router.patch("/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "customer",
      "provider",
      "admin",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING id, email, role
      `,
      [role, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
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
=====================================
SUSPEND USER
=====================================
*/

router.patch("/users/:id/suspend", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE users
      SET is_active = false
      WHERE id = $1
      RETURNING id, email, role, is_active
      `,
      [id]
    );

    res.json({
      success: true,
      user: result.rows[0],
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
=====================================
REACTIVATE USER
=====================================
*/

router.patch("/users/:id/reactivate", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE users
      SET is_active = true
      WHERE id = $1
      RETURNING id, email, role, is_active
      `,
      [id]
    );

    res.json({
      success: true,
      user: result.rows[0],
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
=====================================
DELETE USER
=====================================
*/

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      `
      SELECT id, email, role
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const user = userResult.rows[0];

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Cannot delete admin users",
      });
    }

    await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
  console.error(error);

  if (error.code === "23503") {
    return res.status(400).json({
      success: false,
      error:
        "Non puoi eliminare un utente che ha prenotazioni associate",
    });
  }

 res.status(500).json({
  success: false,
  error: "Internal server error",
});
}
});

/*
=====================================
ADMIN REVIEWS
=====================================
*/

router.get("/reviews", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        reservation_id,
        customer_id,
        provider_id,
        rating,
        comment,
        created_at
      FROM reviews
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      reviews: result.rows,
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