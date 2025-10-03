import { pdf, Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';

// Simple PDF component for testing
const SimpleTicket = ({ bookingData }) => (
  React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: { padding: 20 } },
      React.createElement(Text, { style: { fontSize: 24, color: '#1a237e', textAlign: 'center', marginBottom: 20 } }, 'EVENTHUB'),
      React.createElement(Text, { style: { fontSize: 18, textAlign: 'center', marginBottom: 30 } }, 'Digital Event Ticket'),
      
      React.createElement(View, { style: { backgroundColor: '#e3f2fd', padding: 15, marginBottom: 20 } },
        React.createElement(Text, { style: { fontSize: 16, fontWeight: 'bold', color: '#1a237e', textAlign: 'center' } }, bookingData.eventTitle),
        React.createElement(Text, { style: { fontSize: 14, color: '#ff6f00', textAlign: 'center' } }, bookingData.eventDate)
      ),

      React.createElement(View, { style: { flexDirection: 'row', marginBottom: 20 } },
        React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, { style: { fontSize: 12, color: '#495057' } }, `Venue: ${bookingData.venue}`),
          React.createElement(Text, { style: { fontSize: 12, color: '#495057' } }, `Ticket: ${bookingData.ticketName}`),
          React.createElement(Text, { style: { fontSize: 12, color: '#495057' } }, `Quantity: ${bookingData.quantity}`)
        ),
        React.createElement(View, { style: { flex: 1, alignItems: 'flex-end' } },
          React.createElement(View, { style: { backgroundColor: '#4caf50', padding: 15, borderRadius: 5 } },
            React.createElement(Text, { style: { fontSize: 12, color: '#ffffff', textAlign: 'center' } }, 'TOTAL PAID'),
            React.createElement(Text, { style: { fontSize: 20, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' } }, `€${bookingData.totalPrice}`)
          )
        )
      ),

      React.createElement(View, { style: { backgroundColor: '#f8f9fa', padding: 15, marginBottom: 20 } },
        React.createElement(Text, { style: { fontSize: 12, color: '#495057' } }, `Booking ID: ${bookingData.paymentIntentId}`),
        React.createElement(Text, { style: { fontSize: 12, color: '#495057' } }, `Customer: ${bookingData.customerEmail}`),
        React.createElement(Text, { style: { fontSize: 12, color: '#495057' } }, `Booking Date: ${new Date().toLocaleDateString('en-IE')}`)
      ),

      React.createElement(View, { style: { backgroundColor: '#fff3cd', padding: 15 } },
        React.createElement(Text, { style: { fontSize: 14, fontWeight: 'bold', color: '#856404', marginBottom: 5 } }, 'Important Notes:'),
        React.createElement(Text, { style: { fontSize: 10, color: '#495057' } }, '• Arrive 15 minutes before event starts'),
        React.createElement(Text, { style: { fontSize: 10, color: '#495057' } }, '• Bring valid ID (18+ years required)'),
        React.createElement(Text, { style: { fontSize: 10, color: '#495057' } }, '• Present this ticket at venue entry')
      )
    )
  )
);

export const generateTicketPDF = async (bookingData) => {
  try {
    console.log('🎫 Generating Simple PDF ticket...');
    
    const ticketDoc = SimpleTicket({ bookingData });
    const pdfBuffer = await pdf(ticketDoc).toBuffer();
    
    console.log('✅ Simple PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Error generating Simple PDF ticket:', error);
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
  `;
  
  return ticketContent;
};