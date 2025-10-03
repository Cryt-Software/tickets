import { pdf } from '@react-pdf/renderer';
import React from 'react';
import QRCode from 'qrcode';
import TicketPDFDocument from '../components/TicketPDFDocument';


// Generate QR Code as base64 string
const generateQRCodeBase64 = async (text) => {
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
    
    return qrCodeDataURL; // Return the full data URL
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const generateTicketPDF = async (bookingData) => {
  try {
    console.log('🎫 Generating React PDF ticket...');
    
    // Generate QR code
    const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
    const qrCodeDataURL = await generateQRCodeBase64(qrText);
    
    // Prepare booking data
    const pdfData = {
      ...bookingData,
      qrCode: qrCodeDataURL
    };
    
    console.log('📋 PDF Data prepared:', {
      eventTitle: pdfData.eventTitle,
      eventDate: pdfData.eventDate,
      venue: pdfData.venue,
      ticketName: pdfData.ticketName,
      quantity: pdfData.quantity,
      unitPrice: pdfData.unitPrice,
      totalPrice: pdfData.totalPrice,
      hasQrCode: !!pdfData.qrCode
    });
    
    // Create PDF using React component
    const MyDocument = React.createElement(TicketPDFDocument, { bookingData: pdfData });
    
    console.log('⚙️ Generating PDF buffer...');
    
    // Generate PDF buffer
    const pdfBuffer = await pdf(MyDocument).toBuffer();
    
    console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Error generating React PDF ticket:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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
