require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const { pool, initDb } = require("./backend/db");
const { sendContactNotification } = require("./backend/mailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    res.status(500).json({ ok: false, db: "disconnected", error: err.message });
  }
});

app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: "firstName, email and message are required",
    });
  }

  try {
    const insertQuery = `
      INSERT INTO contact_messages
      (first_name, last_name, email, phone, service, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at;
    `;

    const values = [
      firstName.trim(),
      lastName ? lastName.trim() : null,
      email.trim(),
      phone ? phone.trim() : null,
      service || null,
      message.trim(),
    ];

    const result = await pool.query(insertQuery, values);

    // Email is optional; do not fail request if SMTP is not configured.
    let mailStatus = { sent: false, reason: "SMTP not configured" };
    try {
      mailStatus = await sendContactNotification({ firstName, lastName, email, phone, service, message });
    } catch (mailErr) {
      mailStatus = { sent: false, reason: mailErr.message };
    }

    return res.status(201).json({
      ok: true,
      message: "Contact message received",
      record: result.rows[0],
      emailNotification: mailStatus,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Failed to save contact message",
      details: err.message,
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message || err);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

start();
