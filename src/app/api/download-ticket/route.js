import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { generateTicketPDF, generateSimpleTicket } from 'src/utils/jspdf-final';

// Initialize Stripe only if API key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

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

    // Fetch actual payment data from Stripe to get real booking details
    // In a real production app, you'd store this in a database
    // For now, we'll fetch the metadata from Stripe
    let bookingData;
    
    try {
      if (stripe) {
        // Fetch actual payment data from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        console.log('🔍 Retrieved payment intent metadata:', paymentIntent.metadata);
        
        // Extract booking data from metadata stored during checkout
        const metadata = paymentIntent.metadata;
        
        bookingData = {
          eventTitle: metadata.eventTitle || 'In Stitches Comedy Club',
          eventDate: metadata.eventDate || new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          venue: 'Peadar Kearney\'s Pub - Cellar',
          ticketName: metadata.ticketName || 'General Admission',
          quantity: parseInt(metadata.quantity) || 1,
          unitPrice: parseFloat(metadata.totalPrice) / parseInt(metadata.quantity) || 12,
          totalPrice: parseFloat(metadata.totalPrice) || 12,
          customerEmail: metadata.customerEmail || 'customer@example.com',
          paymentIntentId: paymentIntentId,
        };
        
        console.log('📥 Download Ticket API - Retrieved booking data from Stripe:', bookingData);
      } else {
        throw new Error('Stripe not configured');
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      // Use default fallback data
      bookingData = {
        eventTitle: 'In Stitches Comedy Club',
        eventDate: 'Event Date',
        venue: 'Peadar Kearney\'s Pub - Cellar',
        ticketName: 'General Admission',
        quantity: 1,
        unitPrice: 12,
        totalPrice: 12,
        customerEmail: 'customer@example.com',
        paymentIntentId: paymentIntentId,
      };
    }

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
