// PDF Ticket Generator using jspdf
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
      width: 150,
      margin: 2,
      color: {
        dark: '#1976d2',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

// Generate PDF ticket using jspdf
export const generateTicketPDF = async (bookingData) => {
  try {
    if (!jsPDF) {
      throw new Error('jsPDF package not available');
    }
    
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Document dimensions in mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colors
    const primaryColor = '#1976d2';
    const textColor = '#333333';
    const lightGray = '#f5f5f5';
    
    // Add background color
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add border
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Header section
    doc.setFillColor(primaryColor);
    doc.rect(15, 15, pageWidth - 30, 25, 'F');
    
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('EVENTHUB', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text('BOOKING CONFIRMATION', pageWidth / 2, 38, { align: 'center' });
    
    // Event details section
    doc.setTextColor(textColor);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    
    // Event title
    const eventTitle = bookingData.eventTitle;
    const titleY = 60;
    doc.text(eventTitle, 20, titleY);
    
    // Event details
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    let yPos = titleY + 15;
    
    doc.text(`Date: ${bookingData.eventDate}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Venue: ${bookingData.venue}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Ticket Type: ${bookingData.ticketName}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Quantity: ${bookingData.quantity}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Unit Price: €${bookingData.unitPrice}`, 20, yPos);
    yPos += 15;
    
    // Total price (highlighted)
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(primaryColor);
    doc.text(`Total Paid: €${bookingData.totalPrice}`, 20, yPos);
    
    // Booking information box
    doc.setTextColor(textColor);
    doc.setFillColor(lightGray);
    doc.rect(20, yPos + 15, pageWidth - 40, 40, 'F');
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const boxY = yPos + 25;
    doc.text(`Booking ID: ${bookingData.paymentIntentId}`, 25, boxY);
    doc.text(`Customer: ${bookingData.customerEmail}`, 25, boxY + 8);
    doc.text(`Booking Date: ${new Date().toLocaleDateString('en-IE')}`, 25, boxY + 16);
    
    // QR Code section
    try {
      const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
      const qrCodeDataURL = await generateQRCode(qrText);
      
      if (qrCodeDataURL) {
        // Add QR Code to PDF
        const qrSize = 40; // mm
        const qrX = pageWidth - 60;
        const qrY = yPos + 15;
        
        // Convert data URL to base64
        const base64Data = qrCodeDataURL.split(',')[1];
        
        doc.addImage(base64Data, 'PNG', qrX, qrY, qrSize, qrSize);
        
        // QR Code label
        doc.setTextColor(textColor);
        doc.setFontSize(10);
        doc.text('QR Code', qrX, qrY + qrSize + 5, { align: 'center' });
      } else {
        // Fallback: QR placeholder
        doc.setFillColor('#f0f0f0');
        doc.rect(qrX, qrY, qrSize, qrSize, 'F');
        doc.setTextColor('#666666');
        doc.setFontSize(12);
        doc.text('QR Code', qrX + qrSize/2, qrY + qrSize/2, { align: 'center' });
        doc.text('(Not Available)', qrX + qrSize/2, qrY + qrSize/2 + 5, { align: 'center' });
      }
    } catch (qrError) {
      console.warn('QR code generation failed:', qrError);
    }
    
    // Footer
    const footerY = pageHeight - 30;
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Present this ticket at the venue for entry', pageWidth / 2, footerY, { align: 'center' });
    doc.text('© 2024 EventHub. All rights reserved.', pageWidth / 2, footerY + 10, { align: 'center' });
    
    // Important notes section
    doc.setFillColor('#fff3cd');
    doc.rect(20, footerY - 40, pageWidth - 40, 25, 'F');
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('IMPORTANT NOTES:', 25, footerY - 30);
    
    doc.setFont(undefined, 'normal');
    doc.text('• Please arrive 15 minutes before the event starts', 25, footerY - 25);
    doc.text('• Bring a valid ID for age verification (18+)', 25, footerY - 20);
    doc.text('• This booking is non-refundable and non-exchangeable', 25, footerY - 15);
    
    // Get PDF as ArrayBuffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
    
  } catch (error) {
    console.error('Error generating PDF ticket:', error);
    throw error;
  }
};

// Fallback simple text-based ticket generator
export const generateSimpleTicket = (bookingData) => {
  const ticketContent = `
╔════════════════════════════════════════════════════════════════════╗
║                            EVENTHUB                              ║
║                        BOOKING CONFIRMATION                     ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Event: ${bookingData.eventTitle.padEnd(50)} ║
║  Date: ${bookingData.eventDate.padEnd(52)} ║
║  Venue: ${bookingData.venue.padEnd(51)} ║
║  Ticket Type: ${bookingData.ticketName.padEnd(43)} ║
║  Quantity: ${bookingData.quantity.toString().padEnd(49)} ║
║  Unit Price: €${bookingData.unitPrice.toString().padEnd(43)} ║
║                                                                    ║
║  Total Paid: €${bookingData.totalPrice.toString().padEnd(45)} ║
║                                                                    ║
║  Booking ID: ${bookingData.paymentIntentId.padEnd(41)} ║
║  Customer: ${bookingData.customerEmail.padEnd(47)} ║
║  Booking Date: ${new Date().toLocaleDateString('en-IE').padEnd(42)} ║
║                                                                    ║
║  IMPORTANT NOTES:                                                  ║
║  • Please arrive 15 minutes before the event starts               ║
║  • Bring a valid ID for age verification (18+)                   ║
║  • This booking is non-refundable and non-exchangeable           ║
║  • Present this ticket at the venue for entry                   ║
║                                                                    ║
║  © 2024 EventHub. All rights reserved.                           ║
╚════════════════════════════════════════════════════════════════════╝
  `;
  
  return ticketContent;
};