// Clean High-Quality PDF Ticket Generator using jspdf
// Try to import jspdf and qrcode, with fallbacks
let jsPDF, QRCode;
try {
  jsPDF = (await import('jspdf')).default;
  QRCode = (await import('qrcode')).default;
  console.log('PDF packages loaded successfully');
} catch (error) {
  console.warn('PDF/QRCode packages not available, using text-only tickets');
  jsPDF = null;
  QRCode = null;
}

// Generate QR Code as high-quality data URL
const generateQRCode = async (text) => {
  try {
    if (!QRCode) {
      return null;
    }
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 200,
      margin: 4,
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

// Convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Generate high-quality PDF ticket
export const generateTicketPDF = async (bookingData) => {
  try {
    if (!jsPDF) {
      throw new Error('jsPDF package not available');
    }
    
    // Create PDF document with high DPI
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Get document dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // High-quality color scheme
    const colors = {
      primary: hexToRgb('#1a237e'),
      secondary: hexToRgb('#3948ab'),
      accent: hexToRgb('#ff6f00'),
      success: hexToRgb('#4caf50'),
      lightGray: hexToRgb('#f8f9fa'),
      darkGray: hexToRgb('#495057'),
      white: hexToRgb('#ffffff'),
      black: hexToRgb('#212121'),
      lightBlue: hexToRgb('#e3f2fd')
    };
    
    // Clear background
    doc.setFillColor(colors.white.r, colors.white.g, colors.white.b);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Modern header
    const headerHeight = 50;
    const headerPadding = 20;
    
    // Header background
    doc.setFillColor(colors.darkGray.r, colors.darkGray.g, colors.darkGray.b);
    doc.rect(headerPadding, 15, pageWidth - (headerPadding * 2), headerHeight, 'F');
    
    // Header text
    doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.text('EVENTHUB', pageWidth / 2, 37, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('Digital Event Ticket', pageWidth / 2, 48, { align: 'center' });
    
    // Event details section
    const eventY = 85;
    
    // Event title background
    doc.setFillColor(colors.lightBlue.r, colors.lightBlue.g, colors.lightBlue.b);
    doc.rect(25, eventY - 8, pageWidth - 50, 30, 'F');
    
    // Event title
    doc.setTextColor(colors.black.r, colors.black.g, colors.black.b);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventTitle, pageWidth / 2, eventY + 8, { align: 'center', maxWidth: pageWidth - 60 });
    
    // Content sections
    const contentY = eventY + 35;
    
    // Event details
    doc.setTextColor(colors.darkGray.r, colors.darkGray.g, colors.darkGray.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const leftCol = 30;
    let detailsY = contentY;
    
    doc.text('VENUE:', leftCol, detailsY);
    doc.setTextColor(colors.black.r, colors.black.g, colors.black.b);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.venue, leftCol + 25, detailsY);
    detailsY += 12;
    
    doc.setTextColor(colors.darkGray.r, colors.darkGray.g, colors.darkGray.b);
    doc.setFont('helvetica', 'normal');
    doc.text('DATE:', leftCol, detailsY);
    doc.setTextColor(colors.black.r, colors.black.g, colors.black.b);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventDate, leftCol + 25, detailsY);
    detailsY += 12;
    
    doc.setTextColor(colors.darkGray.r, colors.darkGray.g, colors.darkGray.b);
    doc.setFont('helvetica', 'normal');
    doc.text('TICKET TYPE:', leftCol, detailsY);
    doc.setTextColor(colors.black.r, colors.black.g, colors.black.b);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.ticketName, leftCol + 25, detailsY);
    
    // Pricing section
    const rightCol = pageWidth - 130;
    
    // Price container
    doc.setFillColor(colors.success.r, colors.success.g, colors.success.b);
    doc.rect(rightCol, contentY - 15, 110, 55, 'F');
    
    // Price label
    doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL PAID', rightCol + 55, contentY - 5, { align: 'center' });
    
    // Price amount
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`€${bookingData.totalPrice}`, rightCol + 55, contentY + 12, { align: 'center' });
    
    // Per ticket info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`€${bookingData.unitPrice} per ticket`, rightCol + 55, contentY + 22, { align: 'center' });
    
    // Quantity info
    doc.setTextColor(colors.black.r, colors.black.g, colors.black.b);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Quantity: ${bookingData.quantity}`, rightCol + 55, contentY + 32, { align: 'center' });
    
    // Booking information section
    const bookingY = contentY + 45;
    
    doc.setTextColor(colors.black.r, colors.black.g, colors.black.b);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Booking ID
    doc.text('BOOKING ID:', leftCol, bookingY);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const bookingId = bookingData.paymentIntentId;
    doc.text(bookingId, leftCol + 25, bookingY);
    
    // Customer info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('CUSTOMER:', leftCol, bookingY + 8);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.customerEmail, leftCol + 25, bookingY + 8);
    
    // Booking date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING DATE:', leftCol, bookingY + 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(new Date().toLocaleDateString('en-IE'), leftCol + 30, bookingY + 18);
    
    // QR Code section
    try {
      const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
      const qrCodeDataURL = await generateQRCode(qrText);
      
      if (qrCodeDataURL) {
        // QR Code positioning
        const qrSize = 45;
        const qrX = pageWidth - 80;
        const qrY = bookingY - 10;
        
        // QR Code container
        doc.setFillColor(colors.white.r, colors.white.g, colors.white.b);
        doc.rect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 'F');
        
        // QR Code border
        doc.setDrawColor(colors.primary.r, colors.primary.g, colors.primary.b);
        doc.setLineWidth(2);
        doc.rect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
        
        // Add QR code
        const base64Data = qrCodeDataURL.split(',')[1];
        doc.addImage(base64Data, 'PNG', qrX, qrY, qrSize, qrSize);
        
        // QR Code label
        doc.setTextColor(colors.darkGray.r, colors.darkGray.g, colors.darkGray.b);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Scan for verification', qrX + (qrSize/2), qrY + qrSize + 12, { align: 'center' });
      }
    } catch (qrError) {
      console.warn('QR code generation failed:', qrError);
    }
    
    // Important information section
    const notesY = bookingY + 40;
    
    // Notes container
    doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.rect(25, notesY, pageWidth - 50, 35, 'F');
    
    doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT INFORMATION', pageWidth / 2, notesY + 12, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Information points
    const bulletItems = [
      '• Arrive 15 minutes before the event starts',
      '• Bring valid ID (18+ years required)',
      '• Present this ticket at venue entry',
      '• This booking is non-refundable'
    ];
    
    let bulletY = notesY + 22;
    bulletItems.forEach(item => {
      doc.text(item, 30, bulletY);
      bulletY += 6;
    });
    
    // Footer section
    const footerY = pageHeight - 25;
    
    // Decorative line
    doc.setDrawColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.setLineWidth(2);
    doc.line(60, footerY - 15, pageWidth - 60, footerY - 15);
    
    doc.setTextColor(colors.darkGray.r, colors.darkGray.g, colors.darkGray.b);
    

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for choosing EventHub', pageWidth / 2, footerY - 5, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text('© 2024 EventHub • www.eventhub.com', pageWidth / 2, footerY + 8, { align: 'center' });
    
    // Get PDF buffer with high quality
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
    
  } catch (error) {
    console.error('Error generating high-quality PDF ticket:', error);
    throw error;
  }
};

// Enhanced text-based ticket
export const generateSimpleTicket = (bookingData) => {
  const ticketContent = `
===================================================
                  🎫 EVENTHUB 🎫
               DIGITAL EVENT TICKET
===================================================

🎭 EVENT: ${bookingData.eventTitle}
📅 DATE: ${bookingData.eventDate}
🏟️  VENUE: ${bookingData.venue}
🎟️  TICKET: ${bookingData.ticketName} (Qty: ${bookingData.quantity})

💰 TOTAL PAID: €${bookingData.totalPrice}
    (€${bookingData.unitPrice} per ticket)

🆔 BOOKING ID: ${bookingData.paymentIntentId}
👤 CUSTOMER: ${bookingData.customerEmail}
📝 BOOKED: ${new Date().toLocaleDateString('en-IE')}

===================================================

📋 IMPORTANT INFORMATION:
• Arrive 15 minutes before event starts
• Bring valid ID (18+ years required)
• Present this ticket at venue entry
• This booking is non-refundable

===================================================

🙏 Thank you for choosing EventHub!
🌐 © 2024 EventHub • www.eventhub.com

Ticket #${bookingData.paymentIntentId.substring(-8)}
  `;
  
  return ticketContent;
};
