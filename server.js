import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "https://quiet-praline-074788.netlify.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/* ------------- BREVO SMTP ------------- */
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

/* ------------ HEALTH CHECK ------------ */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ----------- SEND ENQUIRY (NON-BLOCKING) ----------- */
app.post("/send-enquiry", (req, res) => {
  const { name, email, phone, type, businessType, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false });
  }

  // ✅ FRONTEND KO TURANT RESPONSE
  res.status(200).json({ success: true });

  // 🔥 MAIL BACKGROUND ME
  transporter
    .sendMail({
      from: `"1 Heart Productions" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Enquiry - ${type || businessType || "General"}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "NA"}</p>
        <p><b>Event Type:</b> ${type || "NA"}</p>
        <p><b>Business Type:</b> ${businessType || "NA"}</p>
        <p><b>Message:</b> ${message || "NA"}</p>
      `,
    })
    .then(() => {
      console.log("✅ Mail triggered in background");
    })
    .catch((err) => {
      console.error("❌ Mail error:", err.message);
    });
});

/* ------------- SERVER ------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
