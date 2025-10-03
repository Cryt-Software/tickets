import { NextResponse } from 'next/server';
import { createCustomerEmailTemplate, createBillingEmailTemplate } from 'src/utils/email-templates';

// Try to import nodemailer, fallback if not available
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('Nodemailer not installed. Email functionality will be limited.');
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  if (!nodemailer) {
    throw new Error('Nodemailer is not installed. Please run: npm install nodemailer');
  }
  
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};


export async function POST(request) {
  try {
    const {
      to,
      subject,
      html,
      isBilling = false
    } = await request.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, error: 'Missing required email fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: isBilling ? 'Billing notification sent' : 'Customer confirmation sent'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        details: error.message
      },
      { status: 500 }
    );
  }
}

