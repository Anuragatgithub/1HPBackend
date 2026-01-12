import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "https://oneheartproduction.netlify.app",
    "https://idyllic-fudge-58d003.netlify.app", // if frontend live
  ],
  methods: ["POST"],
}));

app.use(express.json());

// ✅ Mail transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});


// ✅ Route
app.post("/send-enquiry", async (req, res) => {
  const { name, email, phone, type, businessType, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"1 Heart Production Website" <${process.env.EMAIL_USER}>`,
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
      `,
    });

    // ✅ Auto-reply to customer
await transporter.sendMail({
  from: `"1 Heart Productions" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "We received your enquiry – 1 Heart Productions",
  html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h3>Hi ${name},</h3>

      <p>Thank you for contacting <b>1 Heart Productions</b>.  
      We have received your enquiry and our team will contact you shortly.</p>

      <p><b>Your Details:</b></p>
      <ul>
        <li><b>Phone:</b> ${phone || "NA"}</li>
        <li><b>Service:</b> ${type || businessType || "General Enquiry"}</li>
      </ul>

      <p>If your requirement is urgent, you may also reach us on WhatsApp.</p>

      <p>Warm Regards,<br>
      <b>Team 1 Heart Productions</b><br>
      📞 +91 91707 27478</p>
    </div>
  `
});


    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({ success: false });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

