import { NextResponse } from 'next/server';
import { generateTicketPDF, generateSimpleTicket } from 'src/utils/jspdf-final';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('paymentIntent');
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    // Generate sample booking data based on payment intent ID
    // In a real app, you'd fetch this from a database
    const bookingData = {
      eventTitle: 'In Stitches Comedy Club',
      eventDate: 'October 15, 2024',
      venue: 'Peadar Kearney\'s Pub - Cellar',
      ticketName: 'General Admission',
      quantity: 1,
      unitPrice: 25,
      totalPrice: 25,
      customerEmail: 'customer@example.com',
      paymentIntentId: paymentIntentId,
    };

    try {
      // Try to generate PDF ticket
      const ticketBuffer = await generateTicketPDF(bookingData);
      
      return new NextResponse(ticketBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="ticket-${paymentIntentId}.pdf"`,
          'Content-Length': ticketBuffer.length.toString(),
        },
      });
    } catch (pdfError) {
      console.warn('PDF generation failed, generating text ticket:', pdfError);
      
      // Fallback to text ticket
      const textTicket = generateSimpleTicket(bookingData);
      const buffer = Buffer.from(textTicket, 'utf8');
      
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="ticket-${paymentIntentId}.txt"`,
          'Content-Length': buffer.length.toString(),
        },
      });
    }

  } catch (error) {
    console.error('Error generating ticket download:', error);
    return NextResponse.json(
      { error: 'Failed to generate ticket' },
      { status: 500 }
    );
  }
}
