import { pdf } from '@react-pdf/renderer';
import React from 'react';
import QRCode from 'qrcode';

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

// Simple React PDF component creation
const createTicketDocument = (bookingData) => {
  return React.createElement(
    'Document',
    {},
    React.createElement(
      'Page',
      {
        size: 'A4',
        orientation: 'landscape',
        style: {
          backgroundColor: '#ffffff',
          padding: 20,
          fontFamily: 'Helvetica',
          fontSize: 12,
        }
      },
      // Header
      React.createElement(
        'View',
        {
          style: {
            backgroundColor: '#1a237e',
            padding: 20,
            marginBottom: 20,
            borderRadius: 8,
            alignItems: 'center',
          }
        },
        React.createElement(
          'Text',
          {
            style: {
              fontSize: 32,
              color: '#ffffff',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 5,
            }
          },
          'EVENTHUB'
        ),
        React.createElement(
          'Text',
          {
            style: {
              fontSize: 16,
              color: '#ffffff',
              textAlign: 'center',
            }
          },
          'Digital Event Ticket'
        )
      ),

      // Event details card
      React.createElement(
        'View',
        {
          style: {
            backgroundColor: '#e3f2fd',
            padding: 20,
            marginBottom: 20,
            borderRadius: 8,
            border: [2, 'solid', '#1976d2'],
          }
        },
        React.createElement(
          'Text',
          {
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1a237e',
              textAlign: 'center',
              marginBottom: 10,
            }
          },
          bookingData.eventTitle || 'Event Title'
        ),

        
        React.createElement(
          'Text',
          {
            style: {
              fontSize: 14,
              color: '#ff6f00',
              textAlign: 'center',
              fontWeight: 'bold',
            }
          },
          bookingData.eventDate || 'Event Date'
        )
      ),

      // Main content area
      React.createElement(
        'View',
        {
          style: {
            flexDirection: 'row',
            marginBottom: 20,
          }
        },
        // Left column
        React.createElement(
          'View',
          {
            style: {
              flex: 1,
              marginRight: 20,
            }
          },
          // Venue
          React.createElement(
            'View',
            { style: { marginBottom: 10, flexDirection: 'row' } },
            React.createElement(
              'Text',
              { style: { fontSize: 12, color: '#495057', width: 80, marginRight: 10 } },
              'VENUE:'
            ),
            React.createElement(
              'Text',
              { style: { fontSize: 14, color: '#212121', fontWeight: 'bold', flex: 1 } },
              bookingData.venue || 'Venue Name'
            )
          ),
          // Ticket type
          React.createElement(
            'View',
            { style: { marginBottom: 10, flexDirection: 'row' } },
            React.createElement(
              'Text',
              { style: { fontSize: 12, color: '#495057', width: 80, marginRight: 10 } },
              'TICKET:'
            ),
            React.createElement(
              'Text',
              { style: { fontSize: 14, color: '#212121', fontWeight: 'bold', flex: 1 } },
              bookingData.ticketName || 'General Admission'
            )
          ),
          // Quantity
          React.createElement(
            'View',
            { style: { marginBottom: 10, flexDirection: 'row' } },
            React.createElement(
              'Text',
              { style: { fontSize: 12, color: '#495057', width: 80, marginRight: 10 } },
              'QTY:'
            ),
            React.createElement(
              'Text',
              { style: { fontSize: 14, color: '#212121', fontWeight: 'bold', flex: 1 } },
              (bookingData.quantity || 1).toString()
            )
          )
        ),

        // Right column - Price
        React.createElement(
          'View',
          {
            style: {
              flex: 1,
              alignItems: 'center',
            }
          },
          React.createElement(
            'View',
            {
              style: {
                backgroundColor: '#4caf50',
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
                width: '100%',
              }
            },
            React.createElement(
              'Text',
              { style: { fontSize: 12, color: '#ffffff', marginBottom: 8 } },
              'TOTAL PAID'
            ),
            React.createElement(
              'Text',
              { style: { fontSize: 28, color: '#ffffff', fontWeight: 'bold', marginBottom: 5 } },
              `€${bookingData.totalPrice || bookingData.unitPrice || 0}`
            ),
            React.createElement(
              'Text',
              { style: { fontSize: 10, color: '#ffffff', marginBottom: 5 } },
              `€${bookingData.unitPrice || 0} per ticket`
            )
          )
        )
      ),

      // Booking information
      React.createElement(
        'View',
        {
          style: {
            backgroundColor: '#f8f9fa',
            padding: 15,
            marginBottom: 20,
            borderRadius: 8,
          }
        },
        React.createElement(
          'View',
          { style: { marginBottom: 8, flexDirection: 'row' } },
          React.createElement(
            'Text',
            { style: { fontSize: 12, color: '#495057', width: 100, marginRight: 10 } },
            'BOOKING ID:'
          ),
          React.createElement(
            'Text',
            { style: { fontSize: 12, color: '#212121', fontWeight: 'bold', flex: 1 } },
            bookingData.paymentIntentId || 'N/A'
          )
        ),
        React.createElement(
          'View',
          { style: { marginBottom: 8, flexDirection: 'row' } },
          React.createElement(
            'Text',
            { style: { fontSize: 12, color: '#495057', width: 100, marginRight: 10 } },
            'CUSTOMER:'
          ),
          React.createElement(
            'Text',
            { style: { fontSize: 12, color: '#212121', fontWeight: 'bold', flex: 1 } },
            bookingData.customerEmail || 'customer@example.com'
          )
        ),
        React.createElement(
          'View',
          { style: { flexDirection: 'row' } },
          React.createElement(
            'Text',
            { style: { fontSize: 12, color: '#495057', width: 100, marginRight: 10 } },
            'BOOKED:'
          ),
          React.createElement(
            'Text',
            { style: { fontSize: 12, color: '#212121', fontWeight: 'bold', flex: 1 } },
            new Date().toLocaleDateString('en-IE')
          )
        )
      ),

      // Important notes
      React.createElement(
        'View',
        {
          style: {
            backgroundColor: '#ff6f00',
            padding: 15,
            marginBottom: 20,
            borderRadius: 8,
          }
        },
        React.createElement(
          'Text',
          {
            style: {
              fontSize: 14,
              color: '#ffffff',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 10,
            }
          },
          'IMPORTANT INFORMATION'
        ),
        React.createElement(
          'Text',
          { style: { fontSize: 10, color: '#ffffff', marginBottom: 3 } },
          '• Arrive 15 minutes before event starts'
        ),
        React.createElement(
          'Text',
          { style: { fontSize: 10, color: '#ffffff', marginBottom: 3 } },
          '• Bring valid ID (18+ years required)'
        ),
        React.createElement(
          'Text',
          { style: { fontSize: 10, color: '#ffffff', marginBottom: 3 } },
          '• Present this ticket at venue entry'
        ),
        React.createElement(
          'Text',
          { style: { fontSize: 10, color: '#ffffff' } },
          '• This booking is non-refundable'
        )
      ),

      // Footer
      React.createElement(
        'View',
        {
          style: {
            alignItems: 'center',
            marginTop: 20,
            borderTopWidth: 2,
            borderTopColor: '#1a237e',
            paddingTop: 15,
          }
        },
        React.createElement(
          'Text',
          { style: { fontSize: 12, color: '#495057', marginBottom: 5 } },
          'Thank you for choosing EventHub!'
        ),
        React.createElement(
          'Text',
          { style: { fontSize: 10, color: '#6c757d' } },
          '© 2024 EventHub • www.eventhub.com'
        )
      )
    )
  );
};

export const generateTicketPDF = async (bookingData) => {
  try {
    // Generate QR code
    const qrText = `Booking ID: ${bookingData.paymentIntentId}\nEvent: ${bookingData.eventTitle}\nDate: ${bookingData.eventDate}\nCustomer: ${bookingData.customerEmail}`;
    const qrCodeDataURL = await generateQRCodeBase64(qrText);
    
    // Create PDF document
    const doc = createTicketDocument(bookingData);
    
    // Generate PDF buffer
    const pdfBuffer = await pdf(doc).toBuffer();
    
    return pdfBuffer;

  } catch (error) {
    console.error('Error generating React PDF ticket:', error);
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
