import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Generate QR Code as data URL
const generateQRCode = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 200, // Bigger QR code
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const generateTicketPDF = async (bookingData) => {
  try {
    console.log('🎫 Generating simple PDF ticket...');
    
    // Create new PDF document (A4 landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Simple color palette
    const black = '#000000';
    const gray = '#666666';
    const blue = '#0000ff';

    // Simple title
    doc.setTextColor(black);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTHUB', pageWidth / 2, 40, { align: 'center' });

    // Event title
    doc.setTextColor(black);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventTitle, pageWidth / 2, 55, { align: 'center' });

    // Event date
    doc.setTextColor(gray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.eventDate, pageWidth / 2, 65, { align: 'center' });

    // Generate QR code
    const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
    const qrCodeImage = await generateQRCode(qrText);

    // Big QR code in center
    if (qrCodeImage) {
      doc.addImage(qrCodeImage, 'PNG', pageWidth / 2 - 40, 80, 80, 80);
    }

    // Basic info below QR code
    doc.setTextColor(black);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Event details
    doc.text(`Venue: ${bookingData.venue}`, pageWidth / 2 - 30, 180, { align: 'center' });
    doc.text(`Ticket: ${bookingData.ticketName}`, pageWidth / 2 - 30, 185, { align: 'center' });
    doc.text(`Quantity: ${bookingData.quantity}`, pageWidth / 2 - 30, 190, { align: 'center' });
    doc.text(`Total: €${bookingData.totalPrice}`, pageWidth / 2 - 30, 195, { align: 'center' });

    // Booking info
    doc.text(`Booking ID: ${bookingData.paymentIntentId}`, pageWidth / 2 - 30, 205, { align: 'center' });
    doc.text(`Customer: ${bookingData.customerEmail}`, pageWidth / 2 - 30, 210, { align: 'center' });
    doc.text(`Booked: ${new Date().toLocaleDateString('en-IE')}`, pageWidth / 2 - 30, 215, { align: 'center' });

    // Simple footer
    doc.setTextColor(gray);
    doc.setFontSize(10);
    doc.text('Thank you for choosing EventHub!', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Generate PDF buffer
    const pdfOutput = doc.output('datauristring');
    const base64Data = pdfOutput.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    console.log('✅ Simple PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Error generating simple PDF ticket:', error);
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
  return `
═══════════════════════════════════════════════════════
                      🎫 EVENTHUB 🎫
                   DIGITAL EVENT TICKET
════════════════════════════════════════════════════════

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
`;
};
