// Modern PDF Ticket Generator using jspdf
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

// Generate QR Code as data URL
const generateQRCode = async (text) => {
  try {
    if (!QRCode) {
      return null;
    }
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 120,
      margin: 2,
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

// Modern gradient effect simulation
const addGradientBackground = (doc, x, y, width, height, color1, color2, isVertical = true) => {
  // Since jsPDF doesn't support gradients, we simulate it with layered rectangles
  const steps = 10;
  const stepHeight = height / steps;
  const stepWidth = width / steps;
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    let r, g, b;
    
    if (isVertical) {
      r = Math.round(color1.r + (color2.r - color1.r) * ratio);
      g = Math.round(color1.g + (color2.g - color1.g) * ratio);
      b = Math.round(color1.b + (color2.b - color1.b) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(x, y + i * stepHeight, width, stepHeight + 1, 'F');
    } else {
      r = Math.round(color1.r + (color2.r - color1.r) * ratio);
      g = Math.round(color1.g + (color2.g - color1.g) * ratio);
      b = Math.round(color1.b + (color2.b - color1.b) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(x + i * stepWidth, y, stepWidth + 1, height, 'F');
    }
  }
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Generate modern PDF ticket using jspdf
export const generateTicketPDF = async (bookingData) => {
  try {
    if (!jsPDF) {
      throw new Error('jsPDF package not available');
    }
    
    // Create new PDF document in landscape for modern ticket layout
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Document dimensions in landscape
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Modern color scheme with gradients
    const colors = {
      primary: { hex: '#1a237e', rgb: hexToRgb('#1a237e') },
      secondary: { hex: '#3949ab', rgb: hexToRgb('#3949ab') },
      accent: { hex: '#ff6f00', rgb: hexToRgb('#ff6f00') },
      success: { hex: '#4caf50', rgb: hexToRgb('#4caf50') },
      gray: { hex: '#f8f9fa', rgb: hexToRgb('#f8f9fa') },
      darkGray: { hex: '#495057', rgb: hexToRgb('#495057') },
      white: { hex: '#ffffff', rgb: hexToRgb('#ffffff') },
      black: { hex: '#212121', rgb: hexToRgb('#212121') }
    };
    
    // Clean slate - white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Modern subtle border with rounded corners effect
    doc.setDrawColor(colors.primary.rgb.r, colors.primary.rgb.g, colors.primary.rgb.b);
    doc.setLineWidth(3);
    doc.rect(15, 10, pageWidth - 30, pageHeight - 20);
    
    // Header gradient background
    const headerHeight = 45;
    addGradientBackground(
      doc, 
      20, 
      15, 
      pageWidth - 40, 
      headerHeight,
      colors.primary.rgb,
      colors.secondary.rgb,
      true
    );
    
    // Modern header text with shadow effect (simulated)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTHUB', pageWidth / 2, 38, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('Digital Ticket', pageWidth / 2, 52, { align: 'center' });
    
    // Ticket content area with modern spacing
    const contentStartY = 85;
    
    // Event highlight card
    doc.setFillColor(colors.gray.rgb.r, colors.gray.rgb.g, colors.gray.rgb.b);
    doc.roundedRect(30, contentStartY - 5, pageWidth - 60, 35, 5, 5);
    doc.rect(30, contentStartY - 5, pageWidth - 60, 35, 'F');
    
    // Event title with modern typography
    doc.setTextColor(colors.black.rgb.r, colors.black.rgb.g, colors.black.rgb.b);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventTitle, 40, contentStartY + 12);
    
    // Event date with accent color
    doc.setFillColor(colors.accent.rgb.r, colors.accent.rgb.g, colors.accent.rgb.b);
    doc.rect(40, contentStartY + 18, 8, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.eventDate, 50, contentStartY + 24);
    
    // Ticket details section
    const detailsY = contentStartY + 50;
    
    // Left column - Booking details
    doc.setTextColor(colors.darkGray.rgb.r, colors.darkGray.rgb.g, colors.darkGray.rgb.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const leftCol = 40;
    let detailY = detailsY;
    
    // Venue
    doc.setTextColor(colors.darkGray.rgb.r, colors.darkGray.rgb.g, colors.darkGray.rgb.b);
    doc.setFont('helvetica', 'normal');
    doc.text('VENUE', leftCol, detailY);
    doc.setTextColor(colors.black.rgb.r, colors.black.rgb.g, colors.black.rgb.b);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.venue, leftCol + 30, detailY);
    detailY += 12;
    
    // Ticket type
    doc.setTextColor(colors.darkGray.rgb.r, colors.darkGray.rgb.g, colors.darkGray.rgb.b);
    doc.setFont('helvetica', 'normal');
    doc.text('TICKET TYPE', leftCol, detailY);
    doc.setTextColor(colors.black.rgb.r, colors.black.rgb.g, colors.black.rgb.b);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.ticketName, leftCol + 30, detailY);
    detailY += 12;
    
    // Quantity
    doc.setTextColor(colors.darkGray.rgb.r, colors.darkGray.rgb.g, colors.darkGray.rgb.b);
    doc.setFont('helvetica', 'normal');
    doc.text('QUANTITY', leftCol, detailY);
    doc.setTextColor(colors.black.rgb.r, colors.black.rgb.g, colors.black.rgb.b);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.quantity.toString(), leftCol + 30, detailY);
    detailY += 12;
    
    // Right column - Pricing
    const rightCol = pageWidth / 2 + 20;
    
    // Price box
    doc.setFillColor(colors.success.rgb.r, colors.success.rgb.g, colors.success.rgb.b);
    doc.roundedRect(rightCol - 10, detailsY - 10, 100, 50, 8, 8);
    doc.rect(rightCol - 10, detailsY - 10, 100, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL PAID', rightCol, detailsY + 5);
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`€${bookingData.totalPrice}`, rightCol, detailsY + 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`€${bookingData.unitPrice} per ticket`, rightCol, detailsY + 35);
    
    // Booking ID section
    const bookingY = detailsY + 60;
    
    doc.setTextColor(colors.black.rgb.r, colors.black.rgb.g, colors.black.rgb.b);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING ID', 40, bookingY);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.paymentIntentId, 40 + 25, bookingY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Booking Date', 40, bookingY + 8);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(new Date().toLocaleDateString('en-IE'), 40 + 25, bookingY + 8);
    
    // QR Code section
    try {
      const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
      const qrCodeDataURL = await generateQRCode(qrText);
      
      if (qrCodeDataURL) {
        // QR Code positioning
        const qrSize = 35;
        const qrX = pageWidth - 80;
        const qrY = bookingY - 15;
        
        // QR Code background
        doc.setFillColor(255, 255, 255);
        doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'F');
        
        // QR Code border
        doc.setDrawColor(colors.primary.rgb.r, colors.primary.rgb.g, colors.primary.rgb.b);
        doc.setLineWidth(2);
        doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
        
        // Convert data URL to base64 and add QR code
        const base64Data = qrCodeDataURL.split(',')[1];
        doc.addImage(base64Data, 'PNG', qrX, qrY, qrSize, qrSize);
        
        // QR Code label
        doc.setTextColor(colors.darkGray.rgb.r, colors.darkGray.rgb.g, colors.darkGray.rgb.b);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Scan for verification', qrX + qrSize/2, qrY + qrSize + 8, { align: 'center' });
      }
    } catch (qrError) {
      console.warn('QR code generation failed:', qrError);
    }
    
    // Important notes section with modern design
    const notesY = bookingY + 35;
    
    // Notes background with accent color
    doc.setFillColor(colors.accent.rgb.r, colors.accent.rgb.g, colors.accent.rgb.b);
    doc.roundedRect(30, notesY, pageWidth - 60, 30, 10, 10);
    doc.rect(30, notesY, pageWidth - 60, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT INFORMATION', pageWidth / 2, notesY + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('• Arrive 15 minutes early', 35, notesY + 20);
    doc.text('• Bring valid ID (18+)', 35, notesY + 28);
    doc.text('• Non-refundable ticket', pageWidth - 110, notesY + 20);
    doc.text('• Present at venue entry', pageWidth - 110, notesY + 28);
    
    // Footer with modern typography
    const footerY = pageHeight - 20;
    
    doc.setTextColor(colors.darkGray.rgb.r, colors.darkGray.rgb.g, colors.darkGray.rgb.b);
    doc.setFontSize('helvetica', 'normal');
    doc.setFontSize(9);
    
    // Decorative line in footer
    doc.setDrawColor(colors.primary.rgb.r, colors.primary.rgb.g, colors.primary.rgb.b);
    doc.setLineWidth(1);
    doc.line(50, footerY - 15, pageWidth - 50, footerY - 15);
    
    doc.text('Thank you for choosing EventHub', pageWidth / 2, footerY - 5, { align: 'center' });
    doc.text('© 2024 EventHub • www.eventhub.com', pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
    
  } catch (error) {
    console.error('Error generating modern PDF ticket:', error);
    throw error;
  }
};

// Modern fallback simple text-based ticket generator
export const generateSimpleTicket = (bookingData) => {
  const ticketContent = `
╔══════════════════════════════════════════════════════════════════════╗
║                        🎫 EVENTHUB 🎫                              ║
║                       DIGITAL TICKET                               ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  🎭 EVENT: ${bookingData.eventTitle.padEnd(52)} ║
║  📅 DATE: ${bookingData.eventDate.padEnd(54)} ║
║  🏟️  VENUE: ${bookingData.venue.padEnd(51)} ║
║  🎟️  TICKET: ${bookingData.ticketName.padEnd(49)} ║
║  🔢 QUANTITY: ${bookingData.quantity.toString().padEnd(47)} ║
║  💰 UNIT PRICE: €${bookingData.unitPrice.toString().padEnd(45)} ║
║                                                                    ║
║  💳 TOTAL PAID: €${bookingData.totalPrice.toString().padEnd(47)} ║
║                                                                    ║
║  🆔 BOOKING ID: ${bookingData.paymentIntentId.padEnd(41)} ║
║  👤 CUSTOMER: ${bookingData.customerEmail.padEnd(47)} ║
║  📝 BOOKING DATE: ${new Date().toLocaleDateString('en-IE').padEnd(42)} ║
║                                                                    ║
║  📋 IMPORTANT INFORMATION:                                         ║
║  • Please arrive 15 minutes before the event starts               ║
║  • Bring a valid ID for age verification (18+)                  ║
║  • This booking is non-refundable and non-exchangeable          ║
║  • Present this ticket at the venue for entry                   ║
║                                                                    ║
║  🙏 Thank you for choosing EventHub!                              ║
║  🌐 © 2024 EventHub • www.eventhub.com                          ║
╚══════════════════════════════════════════════════════════════════════╝
  `;
  
  return ticketContent;
};
