import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createCustomerEmailTemplate, createBillingEmailTemplate } from 'src/utils/email-templates';
import { generateTicketPDF, generateSimpleTicket } from 'src/utils/pdf-ticket-generator-v3';
const { sendSMTPEmail, testConnection } = require('src/utils/smtp-email');


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { 
      eventTitle, 
      eventDate, 
      ticketName, 
      quantity, 
      unitPrice, 
      totalPrice,
      customerEmail,
      paymentMethodId 
    } = await request.json();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to cents
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        eventTitle,
        eventDate,
        ticketName,
        quantity: quantity.toString(),
        totalPrice: totalPrice.toString(),
        customerEmail,
      },
    });

    // Confirm payment intent with payment method
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethodId,
    });

    if (confirmedPayment.status === 'succeeded') {
      // Payment successful - send confirmation emails with PDF tickets
      try {
        // Test SMTP connection first
        console.log('\n🔍 Testing SMTP connection...');
        const smtpTest = await testConnection();
        
        if (!smtpTest.success) {
          console.error('❌ SMTP test failed:', smtpTest.error);
          // Still continue with payment - email failure shouldn't block payment
        } else {
          console.log('✅ SMTP connection verified!');
        }

        // Prepare booking data for ticket generation
        const bookingData = {
          eventTitle,
          eventDate,
          venue: 'Peadar Kearney\'s Pub - Cellar', // You can make this dynamic
          ticketName,
          quantity,
          unitPrice,
          totalPrice,
          customerEmail,
          paymentIntentId: confirmedPayment.id,
        };

        // Generate PDF ticket
        let ticketAttachment = null;
        try {
          const ticketBuffer = await generateTicketPDF(bookingData);
          ticketAttachment = {
            filename: `ticket-${confirmedPayment.id}.pdf`,
            content: ticketBuffer,
            contentType: 'application/pdf'
          };
          console.log('✅ PDF ticket generated successfully');
        } catch (pdfError) {
          console.warn('❌ PDF generation failed, using text ticket:', pdfError);
          // Fallback to text-based ticket
          const textTicket = generateSimpleTicket(bookingData);
          ticketAttachment = {
            filename: `ticket-${confirmedPayment.id}.txt`,
            content: textTicket,
            contentType: 'text/plain'
          };
          console.log('✅ Text ticket generated as fallback');
        }

        // Send customer confirmation email with ticket attachment
        console.log('\n📧 SENDING CUSTOMER EMAIL...');
        const customerEmailResult = await sendSMTPEmail(
          customerEmail,
          `Booking Confirmation - ${eventTitle}`,
          createCustomerEmailTemplate(bookingData),
          [ticketAttachment]
        );

        // Send billing notification email with ticket attachment
        console.log('\n📧 SENDING BILLING EMAIL...');
        const billingEmailResult = await sendSMTPEmail(
          'billing@eventmite.com',
          `New Booking - ${eventTitle}`,
          createBillingEmailTemplate(bookingData),
          [ticketAttachment]
        );

        console.log('\n📊 EMAIL RESULTS SUMMARY:');
        console.log('=====================================');
        console.log('Customer Email:', customerEmailResult.success ? '✅ SUCCESS' : '❌ FAILED');
        if (customerEmailResult.success) {
          console.log('  Message ID:', customerEmailResult.messageId);
        } else {
          console.log('  Error:', customerEmailResult.error);
          if (customerEmailResult.details) {
            console.log('  Details:', JSON.stringify(customerEmailResult.details, null, 2));
          }
        }
        
        console.log('Billing Email:', billingEmailResult.success ? '✅ SUCCESS' : '❌ FAILED');
        if (billingEmailResult.success) {
          console.log('  Message ID:', billingEmailResult.messageId);
        } else {
          console.log('  Error:', billingEmailResult.error);
          if (billingEmailResult.details) {
            console.log('  Details:', JSON.stringify(billingEmailResult.details, null, 2));
          }
        }
        console.log('=====================================\n');
        
      } catch (emailError) {
        console.error('❌ Error in email sending process:', emailError);
        // Don't fail the payment if email fails
      }

      // Payment successful
      return NextResponse.json({ 
        success: true,
        paymentIntentId: confirmedPayment.id,
        message: 'Payment successful'
      });
    } else {
      // Payment failed
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment failed',
          details: confirmedPayment.last_payment_error?.message || 'Unknown error'
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Card error',
          details: error.message
        },
        { status: 400 }
      );
    } else if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request',
          details: error.message
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment processing failed',
          details: error.message
        },
        { status: 500 }
      );
    }
  }
}
