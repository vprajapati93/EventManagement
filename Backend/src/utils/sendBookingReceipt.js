require('dotenv').config({path:'../.env'})
const nodemailer = require("nodemailer");
const receiptTemplate = require("../controller/bookingReceiptTemplate");

console.log(process.env.MAIL_USER);

const sendBookingReceipt = async (booking) => {
  const htmlContent = receiptTemplate(booking);

  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
  });

  await transporter.sendMail({
    from: `"Banquet Hall"${process.env.MAIL_USER}`,
    to: booking.email || `${process.env.MAIL_USER}`,
    subject: `Booking Receipt - ${booking.eventDate}`,
    html: htmlContent,
  });

  console.log("📩 Email sent!");
};


module.exports = sendBookingReceipt;