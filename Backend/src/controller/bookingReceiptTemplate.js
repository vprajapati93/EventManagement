const receiptTemplate = (booking) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Booking Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', sans-serif; background: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #333333;">🎉 Booking Confirmed</h2>
        <p>Dear <strong>${booking.customerName}</strong>,</p>
        <p>Thank you for booking with us! Here are your booking details:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0;">📅 <strong>Event Date:</strong></td>
            <td style="padding: 8px 0;">${booking.eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">⏰ <strong>Time:</strong></td>
            <td style="padding: 8px 0;">${booking.eventTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">🏛️ <strong>Hall Type:</strong></td>
            <td style="padding: 8px 0;">${booking.HallType || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">👥 <strong>Guests:</strong></td>
            <td style="padding: 8px 0;">${booking.numberOfGuests}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">💵 <strong>Total Amount:</strong></td>
            <td style="padding: 8px 0;">₹${booking.totalAmount?.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">✅ <strong>Amount Paid:</strong></td>
            <td style="padding: 8px 0;">₹${booking.amountPaid?.toLocaleString()}</td>
          </tr>
        </table>

        ${
          booking.notes
            ? `<div style="margin-top: 20px; background: #f1f1f1; padding: 10px 15px; border-radius: 4px;">
              <strong>Special Notes:</strong>
              <p>${booking.notes}</p>
            </div>`
            : ""
        }

        <p style="margin-top: 30px;">We look forward to hosting your event. If you have any questions, feel free to reply to this email or call us at <strong>+91-XXXXXXXXXX</strong>.</p>

        <p style="margin-top: 20px;">Warm regards,<br><strong>Your Event Team</strong></p>
      </div>
    </body>
  </html>
  `;
};

module.exports = receiptTemplate;
