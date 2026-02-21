import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";


dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",

    // ✅ OLD Netlify (keep for safety)
    "https://idyllic-fudge-58d003.netlify.app",
    "https://onehp-backend.onrender.com/send-enquiry",

    // ✅ NEW CUSTOM DOMAIN (VERY IMPORTANT)
    "https://1heartproductions.in",
    "https://www.1heartproductions.in"
  ],
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));


app.use(express.json());

// ✅ Mail transporter
// ✅ Mail transporter (Brevo SMTP)



//Route
app.post("/send-enquiry", async (req, res) => {
  const {
  name,
  email,
  phone,
  type,
  businessType,
  performanceCategory,
  message,
  passType
} = req.body;

  try {
    // Admin email
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "1 Heart Productions",
          email: "1heart.eventproductions@gmail.com"
        },
        to: [{ email: "1heart.eventproductions@gmail.com" }],
        subject: `New Enquiry - ${type || businessType || "General"}`,
        htmlContent: `
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || "NA"}</p>
          <p><b>Event Type:</b> ${type || "NA"}</p>
          <p><b>Business Type:</b> ${businessType || "NA"}</p>
          <p><b>Performance Category:</b> ${performanceCategory || "NA"}</p>
          <p><b>Message:</b> ${message || "NA"}</p>
          <p><b>pass Type:</b> ${passType || "NA"}</p>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    // Auto-reply to user
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "1 Heart Productions",
          email: "1heart.eventproductions@gmail.com"
        },
        to: [{ email }],
        subject: "We received your enquiry – 1 Heart Productions",
        htmlContent: `
          <h3>Hi ${name},</h3>
          <p>Thank you for contacting <b>1 Heart Productions</b>.
          We have received your enquiry and will contact you shortly.</p>

          <p><b>Phone:</b> ${phone || "NA"}</p>
          <p><b>Service:</b> ${type || businessType || "General Enquiry"}</p>
          <p><b>Performance Category:</b> ${performanceCategory || "NA"}</p>
           <p><b>Pass Type:</b> ${passType || "NA"}</p>


          <p>Warm regards,<br>
          <b>Team 1 Heart Productions</b><br>
          +91 91707 27478</p>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Brevo API error:", err.response?.data || err.message);
    return res.status(500).json({ success: false });
  }
});


  


// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});


