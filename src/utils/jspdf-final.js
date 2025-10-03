import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Generate QR Code as data URL
const generateQRCode = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 300, // Much bigger QR code
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
    console.log('🎫 Generating clean PDF ticket...');
    
    // Create new PDF document (A4 landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Clean color palette
    const primaryBlue = '#1a237e';
    const secondaryBlue = '#3f51b5';
    const accentOrange = '#ff6f00';
    const successGreen = '#4caf50';
    const lightGray = '#f8f9fa';
    const darkGray = '#495057';
    const white = '#ffffff';

    // Header text - clean and bold
    doc.setTextColor(darkGray);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTHUB', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Digital Event Ticket', pageWidth / 2, 37, { align: 'center' });

    // Header line break
    doc.setDrawColor(primaryBlue);
    doc.setLineWidth(3);
    doc.line(20, 42, pageWidth - 20, 42);

    // Event details - clean card design
    doc.setTextColor(primaryBlue);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventTitle, pageWidth / 2, 55, { align: 'center' });

    doc.setTextColor(accentOrange);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventDate, pageWidth / 2, 62, { align: 'center' });

    // Event details line break
    doc.setDrawColor(secondaryBlue);
    doc.setLineWidth(1);
    doc.line(20, 68, pageWidth - 20, 68);

    // Generate QR code
    const qrText = `Booking ID: ${bookingData.paymentIntentId}nnEvent: ${bookingData.eventTitle}nDate: ${bookingData.eventDate}nCustomer: ${bookingData.customerEmail}`;
    const qrCodeImage = await generateQRCode(qrText);

    // Clean layout - left info, right pricing
    const leftColumn = 30;
    const rightColumn = pageWidth / 2 + 10;

    // Left column - clean event info
    doc.setTextColor(darkGray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    // Venue with better spacing
    doc.text('VENUE:', leftColumn, 78);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    
    // Align all values horizontally at the same X position
    const valueStartX = leftColumn + 30; // Consistent starting position for all values
    
    // Venue
    const venueText = bookingData.venue;
    if (venueText.length > 35) {
      doc.text(venueText.substring(0, 35), valueStartX, 78);
      const remainingText = venueText.substring(35);
      if (remainingText.length > 0) {
        doc.text(remainingText, valueStartX, 82);
      }
    } else {
      doc.text(venueText, valueStartX, 78);
    }

    // Ticket type - aligned horizontally with venue value
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray);
    doc.text('TICKET TYPE:', leftColumn, 84);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    doc.text(bookingData.ticketName, valueStartX, 84); // Same X position as venue

    // Quantity - aligned horizontally with venue and ticket values
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray);
    doc.text('QUANTITY:', leftColumn, 90);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    doc.text(bookingData.quantity.toString(), valueStartX, 90); // Same X position as other values

    // Section divider line
    doc.setDrawColor('#e0e0e0');
    doc.setLineWidth(0.5);
    doc.line(20, 98, pageWidth - 20, 98);

    // Right column - clean pricing section
    doc.setTextColor(successGreen);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAID', rightColumn + 20, 110, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`€${bookingData.totalPrice}`, rightColumn + 20, 120, { align: 'center' });

    doc.setTextColor(darkGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`€${bookingData.unitPrice} per ticket`, rightColumn + 20, 126, { align: 'center' });

    // Main divider line
    doc.setDrawColor(primaryBlue);
    doc.setLineWidth(2);
    doc.line(20, 135, pageWidth - 20, 135);

    // Booking information - clean section
    doc.setTextColor(darkGray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    // Booking ID with more spacing
    doc.text('BOOKING ID:', 30, 148);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    
    // Clean booking ID - remove pi_ prefix and truncate to 15 chars without ellipsis
    let cleanBookingId = bookingData.paymentIntentId;
    
    // Remove pi_ prefix if present
    if (cleanBookingId.startsWith('pi_')) {
      cleanBookingId = cleanBookingId.substring(3); // Remove 'pi_' prefix
    }
    
    // Truncate to 15 characters (no ellipsis)
    const truncatedId = cleanBookingId.substring(0, 15);
    doc.text(truncatedId, 65, 148);

    // Customer email with more spacing
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray);
    doc.text('CUSTOMER:', 30, 155);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    doc.text(bookingData.customerEmail, 65, 155);

    // Booking date with more spacing
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray);
    doc.text('BOOKED ON:', 30, 162);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    doc.text(new Date().toLocaleDateString('en-IE'), 65, 162);

    // QR Code - much bigger placement
    if (qrCodeImage) {
      doc.addImage(qrCodeImage, 'PNG', pageWidth - 55, 130, 30, 30);
    }

    // Important notes divider
    doc.setDrawColor(accentOrange);
    doc.setLineWidth(1.5);
    doc.line(20, 170, pageWidth - 20, 170);

    // Important notes - centered list
    doc.setTextColor('#ff6f00');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT INFORMATION', pageWidth / 2, 182, { align: 'center' });

    doc.setTextColor(darkGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    let yPos = 190;
    const notes = [
      '• Arrive 15 minutes before event starts',
      '• Bring valid photo ID (18+ years required)',
      '• Present this ticket at venue entry',
      '• This booking is non-refundable'
    ];
    
    notes.forEach(note => {
      doc.text(note, pageWidth / 2, yPos, { align: 'center' }); // Center aligned properly
      yPos += 4.5;
    });

    // Final divider
    doc.setDrawColor('#e0e0e0');
    doc.setLineWidth(1);
    doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);

    // Generate PDF buffer
    const pdfOutput = doc.output('datauristring');
    const base64Data = pdfOutput.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    console.log('✅ Clean PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Error generating clean PDF ticket:', error);
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