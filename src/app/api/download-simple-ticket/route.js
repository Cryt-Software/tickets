import { NextResponse } from 'next/server';
import { generateTicketPDF, generateSimpleTicket } from 'src/utils/simple-pdf';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('paymentIntent');

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment Intent ID is required' }, { status: 400 });
    }

    // Mock booking data (replace with actual data from your database)
    const bookingData = {
      eventTitle: 'In Stitches Comedy Club: Sun - Wed - Stand Up Comedy',
      eventDate: 'October 16, 2025',
      venue: 'Peadar Kearney\'s Pub - Cellar',
      ticketName: 'General Admission',
      quantity: 1,
      unitPrice: 15,
      totalPrice: 15,
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
          ' Content-Disposition': `attachment; filename="simple-ticket-${paymentIntentId}.pdf"`,
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
          'Content-Disposition': `attachment; filename="simple-ticket-${paymentIntentId}.txt"`,
          'Content-Length': buffer.length.toString(),
        },
      });
    }

  } catch (error) {
    console.error('Error generating simple ticket download:', error);
    return NextResponse.json(
      { error: 'Failed to generate simple ticket' },
      { status: 500 }
    );
  }
}
