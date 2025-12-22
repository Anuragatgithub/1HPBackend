import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

/**
 * CORS — localhost + production
 */
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "https://quiet-praline-074788.netlify.app"
  ]
}));

app.use(express.json());

/**
 * Mail transporter (created once)
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

/**
 * SEND ENQUIRY
 */
app.post("/send-enquiry", async (req, res) => {
  const { name, email, phone, type, businessType, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false });
  }

  try {
    await transporter.sendMail({
      from: `1 Heart Productions <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Enquiry - ${type || businessType || "General"}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "NA"}</p>
        <p><b>Event Type:</b> ${type || "NA"}</p>
        <p><b>Business Type:</b> ${businessType || "NA"}</p>
        <p><b>Message:</b> ${message || "NA"}</p>
      `
    });

    // ✅ IMPORTANT: explicit JSON success
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Mail error:", err);

    // ✅ Still respond
    return res.status(200).json({ success: false });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
