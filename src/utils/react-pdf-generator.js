import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import TicketPDF from '../components/TicketPDF';

// Generate QR Code base64
const generateQRCodeBuffer = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 80,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1a237e',
        light: '#ffffff'
      }
    });
    
    // Convert data URL to buffer
    const base64Data = qrCodeDataURL.split(',')[1];
    return Buffer.from(base64Data, 'base64');
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const generateTicketPDF = async (bookingData) => {
  try {
    // Generate QR code for the booking
    const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
    const qrCodeBuffer = await generateQRCodeBuffer(qrText);
    
    // Prepare booking data for PDF component
    const pdfBookingData = {
      ...bookingData,
      qrCode: qrCodeBuffer // Add QR code buffer
    };

    // Render PDF to stream
    const pdfStream = await renderToStream(
      React.createElement(TicketPDF, { bookingData: pdfBookingData })
    );

    // Convert stream to buffer
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      pdfStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      pdfStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      
      pdfStream.on('error', (error) => {
        reject(error);
      });
    });

  } catch (error) {
    console.error('Error generating React PDF ticket:', error);
    throw error;
  }
};

// Fallback text ticket
export const generateSimpleTicket = (bookingData) => {
  const ticketContent = `
═══════════════════════════════════════════════════════
                      🎫 EVENTHUB 🎫
                   DIGITAL EVENT TICKET
═══════════════════════════════════════════════════════

🎭 EVENT: ${bookingData.eventTitle}
📅 DATE: ${bookingData.eventDate}
🏟️  VENUE: ${bookingData.venue}
🎟️  TICKET: ${bookingData.ticketName} (Qty: ${bookingData.quantity})

💰 TOTAL PAID: €${bookingData.totalPrice}
    (€${bookingData.unitPrice} per ticket)

🆔 BOOKING ID: ${bookingData.paymentIntentId}
👤 CUSTOMER: ${bookingData.customerEmail}
📝 BOOKED: ${new Date().toLocaleDateString('en-IE')}

═══════════════════════════════════════════════════════

📋 IMPORTANT INFORMATION:
• Arrive 15 minutes before event starts
• Bring valid ID (18+ years required)
• Present this ticket at venue entry
• This booking is non-refundable

═══════════════════════════════════════════════════════

🙏 Thank you for choosing EventHub!
🌐 © 2024 EventHub • www.eventhub.com

Ticket #${bookingData.paymentIntentId.substring(-8)}
  `;
  
  return ticketContent;
};
