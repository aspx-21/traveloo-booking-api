const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const {
    fullName,
    email,
    destination,
    vehicle,
    startDateTime,
    endDateTime,
    totalRent,
    reservationFee,
    amountDue
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const message = {
  from: `"Traveloo" <${process.env.SMTP_USER}>`,
  to: email,
  subject: "Your Traveloo Booking is Confirmed!",
  html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1484C0;">Hi ${fullName},</h2>
      <p>Thank you for booking with <strong>Traveloo Car Rental</strong>!</p>
      <h3 style="color: #1484C0; margin-top: 30px;">Booking Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td><strong>Destination:</strong></td><td>${destination}</td></tr>
        <tr><td><strong>Vehicle:</strong></td><td>${vehicle}</td></tr>
        <tr><td><strong>Start Date/Time:</strong></td><td>${startDateTime}</td></tr>
        <tr><td><strong>End Date/Time:</strong></td><td>${endDateTime}</td></tr>
        <tr><td><strong>Total Rent:</strong></td><td>₱${totalRent}</td></tr>
        <tr><td><strong>Reservation Fee:</strong></td><td>₱${reservationFee}</td></tr>
        <tr><td><strong>Amount Due:</strong></td><td><strong>₱${amountDue}</strong></td></tr>
      </table>
      <p style="margin-top: 30px;">Please prepare the required documents and remaining payment upon pick-up.</p>
      <p>If you have any questions, just reply to this email.</p>
      <p style="margin-top: 40px;">- Traveloo Car Rental</p>
    </div>
  `
};


  try {
    await transporter.sendMail(message);
    res.status(200).send("Email sent!");
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send("Email failed to send.");
  }
}
