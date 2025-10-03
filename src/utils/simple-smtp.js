// Simple SMTP email sender - reliable implementation
const nodemailer = require('nodemailer');

// Test connection function
export const testSMTPConnection = async () => {
  try {
    console.log('🔍 Testing SMTP connection...');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test the connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    return { success: true, message: 'SMTP connection verified' };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Send email with proper error handling
export const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📋 Subject: ${subject}`);
    console.log(`📎 Attachments: ${attachments.length}`);
    
    // Validate required environment variables
    const requiredEnvVars = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_FROM: process.env.SMTP_FROM,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    console.log('🔧 Creating transporter with config:', {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      // Don't log the password for security
      passSet: !!process.env.SMTP_PASS,
      from: process.env.SMTP_FROM
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add TLS options for better reliability
      tls: {
        rejectUnauthorized: false // For self-signed certificates
      }
    });

    // Prepare mail options
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments,
      // Add extra options for better delivery
      date: new Date(),
      encoding: 'utf-8'
    };

    console.log('📤 Sending email...');
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Response:', info.response);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    };

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    return {
      success: false,
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      }
    };
  }
};
