import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Generate QR Code as data URL
const generateQRCode = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 100,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1a237e',
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
    console.log('🎫 Generating JSPrint PDF ticket...');
    
    // Create new PDF document (A4 landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryBlue = '#1a237e';
    const secondaryBlue = '#3f51b5';
    const accentOrange = '#ff6f00';
    const successGreen = '#4caf50';
    const lightGray = '#f5f5f5';

    // Header background
    doc.setFillColor(primaryBlue);
    doc.rect(20, 15, pageWidth - 40, 25, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTHUB', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Digital Event Ticket', pageWidth / 2, 37, { align: 'center' });

    // Event details box
    doc.setFillColor('#e3f2fd');
    doc.rect(20, 50, pageWidth - 40, 20, 'F');
    
    doc.setDrawColor(secondaryBlue);
    doc.setLineWidth(2);
    doc.rect(20, 50, pageWidth - 40, 20);

    doc.setTextColor(primaryBlue);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventTitle, pageWidth / 2, 62, { align: 'center' });

    doc.setTextColor(accentOrange);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventDate, pageWidth / 2, 67, { align: 'center' });

    // Generate QR code
    const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
    const qrCodeImage = await generateQRCode(qrText);

    // Left column - Event info
    doc.setTextColor('#495057');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('VENUE:', 30, 85);
    doc.text(bookingData.venue, 50, 85);

    doc.text('TICKET TYPE:', 30, 92);
    doc.text(bookingData.ticketName, 60, 92);

    doc.text('QUANTITY:', 30, 99);
    doc.text(bookingData.quantity.toString(), 58, 99);

    // Right column - Pricing box
    doc.setFillColor(successGreen);
    doc.rect(pageWidth - 80, 75, 60, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('TOTAL PAID', pageWidth - 50, 88, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`€${bookingData.totalPrice}`, pageWidth - 50, 98, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`€${bookingData.unitPrice} per ticket`, pageWidth - 50, 103, { align: 'center' });

    // Booking information section
    doc.setFillColor(lightGray);
    doc.rect(20, 120, pageWidth - 40, 25, 'F');

    doc.setTextColor('#495057');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING ID:', 30, 132);
    doc.text(bookingData.paymentIntentId, 60, 132);

    doc.text('CUSTOMER:', 30, 139);
    doc.text(bookingData.customerEmail, 58, 139);

    doc.text('BOOKING DATE:', 30, 146);
    doc.text(new Date().toLocaleDateString('en-IE'), 68, 146);

    // QR Code
    if (qrCodeImage) {
      doc.addImage(qrCodeImage, 'PNG', pageWidth - 35, 120, 15, 15);
    }

    // Important notes section
    doc.setFillColor('#fff3cd');
    doc.rect(20, 155, pageWidth - 40, 25, 'F');

    doc.setTextColor('#856404');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT INFORMATION', pageWidth / 2, 167, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('• Arrive 15 minutes before event starts', 30, 175);
    doc.text('• Bring valid ID (18+ years required)', 30, 181);
    doc.text('• Present this ticket at venue entry', 30, 187);
    doc.text('• This booking is non-refundable', 30, 193);

    // Footer
    doc.setTextColor('#6c757d');
    doc.setFontSize(10);
    doc.text('Thank you for choosing EventHub!', pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.text('© 2024 EventHub • www.eventhub.com', pageWidth / 2, pageHeight - 25, { align: 'center' });

    // Generate PDF buffer
    const pdfOutput = doc.output('datauristring');
    const base64Data = pdfOutput.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Error generating JSPrint PDF ticket:', error);
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
