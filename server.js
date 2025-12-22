import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

app.post("/send-enquiry",async(req,res)=>{
const {name,email,phone,businessType,message}=req.body;
try{
const transporter=nodemailer.createTransport({
service:"gmail",
auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}
});
await transporter.sendMail({
from:`1 Heart Productions <${process.env.EMAIL_USER}>`,
to: process.env.EMAIL_USER,
subject:`New Enquiry - ${businessType}`,
html:`<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Business Type:</b> ${businessType}</p><p><b>Message:</b> ${message}</p>`
});
res.json({success:true});
}catch(e){
res.status(500).json({success:false});
}
});

app.listen(5000,()=>console.log("Backend running on 5000"));
