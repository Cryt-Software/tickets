import { pdf, Document, Page, Text } from '@react-pdf/renderer';

export const generateTicketPDF = async (bookingData) => {
  try {
    console.log('🎫 DEBUG: Starting PDF generation...');
    
    // Create the most basic PDF possible
    const doc = (
      <Document>
        <Page size="A4">
          <Text style={{ fontSize: 20 }}>EVENTHUB</Text>
          <Text>Event: {bookingData.eventTitle}</Text>
          <Text>Date: {bookingData.eventDate}</Text>
          <Text>Total: €{bookingData.totalPrice}</Text>
        </Page>
      </Document>
    );
    
    console.log('🔄 DEBUG: Creating PDF buffer...');
    
    // Try different methods to get the PDF data
    const pdfInstance = pdf(doc);
    
    // Try arrayBuffer() method first
    let pdfBuffer;
    try {
      const arrayBuffer = await pdfInstance.toBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
      console.log('✅ DEBUG: PDF created with toBuffer(). Size:', pdfBuffer.length);
    } catch (bufferError) {
      console.log('⚠️  toBuffer failed, trying alternative method:', bufferError.message);
      
      // Try alternative method
      try {
        const blob = await pdfInstance.toBlob();
        const arrayBuffer = await blob.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
        console.log('✅ DEBUG: PDF created with toBlob(). Size:', pdfBuffer.length);
      } catch (blobError) {
        console.log('⚠️  toBlob failed, trying string method:', blobError.message);
        
        // Try using toString method and convert
        const pdfString = await pdfInstance.toString();
        pdfBuffer = Buffer.from(pdfString);
        console.log('✅ DEBUG: PDF created with toString(). Size:', pdfBuffer.length);
      }
    }
    
    return pdfBuffer;

  } catch (error) {
    console.error('❌ DEBUG: PDF generation failed:', error);
    throw error;
  }
};

export const generateSimpleTicket = (bookingData) => {
  return `Simple ticket: ${bookingData.eventTitle} - €${bookingData.totalPrice}`;
};
