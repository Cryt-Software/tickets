// Email templates for booking confirmations

export const createCustomerEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - ${data.eventTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .success-icon { font-size: 48px; color: #4caf50; }
        .total { font-size: 18px; font-weight: bold; color: #1976d2; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! 🎉</h1>
          <p>Thank you for your purchase</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 20px;">
            <div class="success-icon">✅</div>
            <h2>Your booking has been confirmed</h2>
          </div>
          
          <div class="booking-details">
            <h3>Event Details</h3>
            <p><strong>Event:</strong> ${data.eventTitle}</p>
            <p><strong>Date:</strong> ${data.eventDate}</p>
            <p><strong>Venue:</strong> ${data.venue}</p>
            <p><strong>Ticket Type:</strong> ${data.ticketName}</p>
            <p><strong>Quantity:</strong> ${data.quantity}</p>
            <p><strong>Unit Price:</strong> €${data.unitPrice}</p>
            <p class="total"><strong>Total Paid:</strong> €${data.totalPrice}</p>
          </div>
          
          <div class="booking-details">
            <h3>Booking Information</h3>
            <p><strong>Booking ID:</strong> ${data.paymentIntentId}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Booking Date:</strong> ${new Date().toLocaleDateString('en-IE')}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>Important Notes:</h4>
            <ul>
              <li>Your ticket is attached to this email as a PDF/image file</li>
              <li>Please arrive 15 minutes before the event starts</li>
              <li>Bring a valid ID for age verification (18+)</li>
              <li>This booking is non-refundable and non-exchangeable</li>
              <li>Keep this email and ticket as your booking confirmation</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing EventHub!</p>
          <p>If you have any questions, please contact us at billing@eventmite.com</p>
          <p>© 2024 EventHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const createBillingEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking - ${data.eventTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .new-booking { font-size: 48px; color: #ff9800; }
        .total { font-size: 18px; font-weight: bold; color: #1976d2; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Received 📧</h1>
          <p>EventHub Booking Notification</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 20px;">
            <div class="new-booking">🎫</div>
            <h2>New booking has been processed</h2>
          </div>
          
          <div class="booking-details">
            <h3>Event Details</h3>
            <p><strong>Event:</strong> ${data.eventTitle}</p>
            <p><strong>Date:</strong> ${data.eventDate}</p>
            <p><strong>Venue:</strong> ${data.venue}</p>
            <p><strong>Ticket Type:</strong> ${data.ticketName}</p>
            <p><strong>Quantity:</strong> ${data.quantity}</p>
            <p><strong>Unit Price:</strong> €${data.unitPrice}</p>
            <p class="total"><strong>Total Revenue:</strong> €${data.totalPrice}</p>
          </div>
          
          <div class="booking-details">
            <h3>Customer Information</h3>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Payment Intent ID:</strong> ${data.paymentIntentId}</p>
            <p><strong>Booking Date:</strong> ${new Date().toLocaleDateString('en-IE')}</p>
            <p><strong>Payment Status:</strong> ✅ Completed</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>Next Steps:</h4>
            <ul>
              <li>Customer has been sent a confirmation email with PDF ticket attachment</li>
              <li>Payment has been processed successfully</li>
              <li>Booking is confirmed and ready for the event</li>
              <li>PDF ticket is attached to this email for your records</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>EventHub Booking System</p>
          <p>This is an automated notification</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
