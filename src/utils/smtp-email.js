// SMTP Email sender - CommonJS compatible
const nodemailer = require('nodemailer');

// Generate transporter
const getTransporter = () => {
  console.log('🔧 Creating SMTP transporter...');
  console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM,
    passSet: !!process.env.SMTP_PASS
  });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Test SMTP connection
const testConnection = async () => {
  try {
    console.log('🔍 Testing SMTP connection...');
    
    const transporter = getTransporter();
    await transporter.verify();
    
    console.log('✅ SMTP connection verified successfully!');
    return { success: true, message: 'SMTP connection verified' };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send email
const sendSMTPEmail = async (to, subject, html, attachments = []) => {
  try {
    console.log(`📧 Sending email to: ${to}`);
    console.log(`📋 Subject: ${subject}`);
    console.log(`📎 Attachments: ${attachments.length}`);

    // Validate environment variables
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments,
      date: new Date(),
      encoding: 'utf-8'
    };

    console.log('📤 Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Server Response:', info.response);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted || [],
      rejected: info.rejected || []
    };

  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.error('🔍 Error type:', error.name);
    console.error('🔍 Error code:', error.code);
    console.error('🔍 Command:', error.command);
    console.error('🔍 Response:', error.response);
    
    return {
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        command: error.command,
        response: error.response
      }
    };
  }
};

module.exports = {
  testConnection,
  sendSMTPEmail
};
