import nodemailer from "nodemailer";

export const transporter =
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

export async function sendMail({
  to,
  subject,
  html,
}) {
  try {
    console.log("INVIO EMAIL A:", to);

    const info =
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });

    console.log(
      "EMAIL INVIATA ✅",
      info.messageId
    );

    return info;
  } catch (error) {
    console.error(
      "ERRORE SMTP ❌",
      error
    );

    throw error;
  }
}