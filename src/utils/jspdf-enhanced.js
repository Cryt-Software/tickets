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
        dark: '#0d47a1',
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
    console.log('🎫 Generating enhanced PDF ticket...');
    
    // Create new PDF document (A4 landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Enhanced color palette
    const primaryBlue = '#0d47a1';
    const secondaryBlue = '#1976d2';
    const accentOrange = '#ff9800';
    const successGreen = '#2e7d32';
    const lightBlue = '#e3f2fd';
    const cream = '#fff8e1';
    const darkText = '#1a1a1a';
    const lightText = '#666666';
    const white = '#ffffff';

    // Background
    doc.setFillColor('#fafafa');
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header with enhanced styling
    doc.setFillColor(primaryBlue);
    doc.roundedRect(15, 10, pageWidth - 30, 30, 5, 5, 'F');

    // Header text with improved typography
    doc.setTextColor(white);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTHUB', pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Digital Event Ticket', pageWidth / 2, 32, { align: 'center' });

    // Event card with modern styling
    doc.setFillColor(white);
    doc.setDrawColor(secondaryBlue);
    doc.setLineWidth(2);
    doc.roundedRect(20, 50, pageWidth - 40, 22, 8, 8, 'FD');

    doc.setTextColor(primaryBlue);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventTitle, pageWidth / 2, 63, { align: 'center' });

    doc.setTextColor(accentOrange);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventDate, pageWidth / 2, 68, { align: 'center' });

    // Generate QR code
    const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
    const qrCodeImage = await generateQRCode(qrText);

    // Modern info layout
    const leftStart = 25;
    const rightStart = pageWidth / 2 + 10;

    // Left section with enhanced styling
    doc.setFillColor(lightBlue);
    doc.roundedRect(leftStart - 5, 80, (pageWidth / 2) - 15, 22, 6, 6, 'F');

    doc.setTextColor(darkText);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Event details with icons
    doc.text('🏢 Venue:', leftStart, 90);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.venue, leftStart + 15, 90);

    doc.setFont('helvetica', 'normal');
    doc.text('🎫 Ticket Type:', leftStart, 97);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.ticketName, leftStart + 20, 97);

    doc.setFont('helvetica', 'normal');
    doc.text('📊 Quantity:', leftStart, 104);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.quantity.toString(), leftStart + 18, 104);

    // Enhanced pricing box
    doc.setFillColor(successGreen);
    doc.roundedRect(rightStart - 20, 75, 85, 35, 12, 12, 'F');

    doc.setTextColor(white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL PAID', (rightStart + 22.5), 87, { align: 'center' });

    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`€${bookingData.totalPrice}`, (rightStart + 22.5), 98, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`€${bookingData.unitPrice} per ticket • ${bookingData.quantity} ticket${bookingData.quantity > 1 ? 's' : ''}`, (rightStart + 22.5), 104, { align: 'center' });

    // Booking information card
    doc.setFillColor(cream);
    doc.setDrawColor('#e0e0e0');
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 115, pageWidth - 40, 28, 6, 6, 'FD');

    doc.setTextColor(darkText);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    doc.text('🆔 Booking ID:', 30, 128);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.paymentIntentId.substring(0, 20) + '...', 55, 128);

    doc.setFont('helvetica', 'normal');
    doc.text('👤 Customer:', 30, 135);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.customerEmail, 52, 135);

    doc.setFont('helvetica', 'normal');
    doc.text('📅 Booking Date:', 30, 142);
    doc.setFont('helvetica', 'bold');
    doc.text(new Date().toLocaleDateString('en-IE'), 58, 142);

    // QR Code with styling
    if (qrCodeImage) {
      doc.setFillColor(white);
      doc.roundedRect(pageWidth - 38, 120, 20, 20, 4, 4, 'F');
      doc.setDrawColor(secondaryBlue);
      doc.setLineWidth(1);
      doc.roundedRect(pageWidth - 38, 120, 20, 20, 4, 4, 'S');
      
      doc.addImage(qrCodeImage, 'PNG', pageWidth - 34, 124, 12, 12);
    }

    // Important notes with enhanced warning design
    doc.setFillColor('#fff3e0');
    doc.setDrawColor('#ff9800');
    doc.setLineWidth(1);
    doc.roundedRect(20, 150, pageWidth - 40, 25, 6, 6, 'FD');

    doc.setTextColor('#424242');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠️ IMPORTANT INFORMATION', pageWidth / 2, 163, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const notesY = 170;
    doc.text('• Arrive 15 minutes before event starts', 28, notesY);
    doc.text('• Bring valid photo ID (18+ years required)', 28, notesY + 5);
    doc.text('• Present this ticket at venue entry', 28, notesY + 10);
    doc.text('• This booking is non-refundable and non-transferable', 28, notesY + 15);

    // Enhanced footer
    doc.setTextColor(lightText);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing EventHub!', pageWidth / 2, pageHeight - 25, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('© 2024 EventHub • www.eventhub.com • Support: help@eventhub.com', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Generate PDF buffer
    const pdfOutput = doc.output('datauristring');
    const base64Data = pdfOutput.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    console.log('✅ Enhanced PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Error generating enhanced PDF ticket:', error);
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
