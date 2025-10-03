import { NextResponse } from 'next/server';
const { sendSMTPEmail, testConnection } = require('src/utils/smtp-email');

export async function GET(request) {
  try {
    console.log('🧪 Testing SMTP configuration...');
    
    // Test SMTP connection
    const connectionTest = await testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'SMTP connection failed',
        details: connectionTest.error
      }, { status: 500 });
    }

    // Test sending a simple email
    const testEmailResult = await sendSMTPEmail(
      process.env.SMTP_FROM, // Send to self
      'SMTP Test Email',
      `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2>🧪 SMTP Test Email</h2>
          <p>This is a test email to verify SMTP configuration.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>SMTP Host: ${process.env.SMTP_HOST}</li>
            <li>SMTP Port: ${process.env.SMTP_PORT}</li>
            <li>SMTP Secure: ${process.env.SMTP_SECURE === 'true' ? 'Yes' : 'No'}</li>
            <li>SMTP User: ${process.env.SMTP_USER}</li>
            <li>SMTP From: ${process.env.SMTP_FROM}</li>
          </ul>
          <p>If you received this email, your SMTP configuration is working correctly!</p>
        </div>
      `
    );

    console.log('📧 Test email result:', testEmailResult);

    return NextResponse.json({
      success: true,
      message: 'SMTP test completed',
      connection: connectionTest,
      emailTest: testEmailResult,
      environment: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_SECURE: process.env.SMTP_SECURE,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_FROM: process.env.SMTP_FROM,
        // Don't expose password
        SMTP_PASS_SET: !!process.env.SMTP_PASS
      }
    });

  } catch (error) {
    console.error('❌ SMTP test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'SMTP test failed',
      details: error.message,
      environment: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_SECURE: process.env.SMTP_SECURE,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_FROM: process.env.SMTP_FROM,
        SMTP_PASS_SET: !!process.env.SMTP_PASS
      }
    }, { status: 500 });
  }
}
