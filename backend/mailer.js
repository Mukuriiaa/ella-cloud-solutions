const nodemailer = require("nodemailer");

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? Number(SMTP_PORT) : 587,
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function sendContactNotification(data) {
  const transporter = getTransporter();

  if (!transporter) {
    return { sent: false, reason: "SMTP not configured" };
  }

  const to = process.env.CONTACT_TO || process.env.SMTP_USER;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `New Contact Enquiry: ${data.firstName} ${data.lastName || ""}`.trim(),
    text: [
      `Name: ${data.firstName} ${data.lastName || ""}`.trim(),
      `Email: ${data.email}`,
      `Phone: ${data.phone || "N/A"}`,
      `Service: ${data.service || "N/A"}`,
      "",
      "Message:",
      data.message,
    ].join("\n"),
  });

  return { sent: true };
}

module.exports = {
  sendContactNotification,
};
