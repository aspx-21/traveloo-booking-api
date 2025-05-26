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
    text: `
Hi ${fullName},

Thank you for booking with Traveloo!

Here are your booking details:

Destination: ${destination}
Vehicle: ${vehicle}
Start: ${startDateTime}
End: ${endDateTime}
Total Rent: ₱${totalRent}
Reservation Fee: ₱${reservationFee}
Amount Due: ₱${amountDue}

Please prepare the required documents and balance upon pick-up.

If you have any questions, reply to this email.

- Traveloo Car Rental
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
