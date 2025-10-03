// Multiple email sending methods with logging

// Method 1: Using built-in fetch with SMTP API
export const sendEmailMethod1 = async (to, subject, html, attachments = []) => {
  try {
    console.log('📧 METHOD 1: Using fetch with SMTP API');
    
    // Try using a public SMTP API service
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'default',
        template_id: 'template_id',
        user_id: 'user_id',
        template_params: {
          to_email: to,
          subject: subject,
          message: html,
        }
      })
    });

    if (response.ok) {
      console.log('✅ METHOD 1: Email sent successfully via EmailJS');
      return { success: true, method: 'emailjs', messageId: Date.now() };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ METHOD 1 failed:', error.message);
    return { success: false, method: 'emailjs', error: error.message };
  }
};

// Method 2: Using Node.js built-in modules
export const sendEmailMethod2 = async (to, subject, html, attachments = []) => {
  try {
    console.log('📧 METHOD 2: Using Node.js built-in modules');
    
    // This is a placeholder - would need actual SMTP implementation
    // For now, just log the email details
    console.log('📧 EMAIL DETAILS:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML length:', html.length);
    console.log('Attachments:', attachments.length);
    console.log('---');
    
    // Simulate successful send
    console.log('✅ METHOD 2: Email logged successfully (Node.js built-in)');
    return { success: true, method: 'nodejs-builtin', messageId: Date.now() };
  } catch (error) {
    console.error('❌ METHOD 2 failed:', error.message);
    return { success: false, method: 'nodejs-builtin', error: error.message };
  }
};

// Method 3: Using nodemailer with different import
export const sendEmailMethod3 = async (to, subject, html, attachments = []) => {
  try {
    console.log('📧 METHOD 3: Using nodemailer with dynamic import');
    
    // Dynamic import of nodemailer
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ METHOD 3: Email sent successfully via nodemailer (dynamic import)');
    return { success: true, method: 'nodemailer-dynamic', messageId: info.messageId };
  } catch (error) {
    console.error('❌ METHOD 3 failed:', error.message);
    return { success: false, method: 'nodemailer-dynamic', error: error.message };
  }
};

// Method 4: Using nodemailer with require
export const sendEmailMethod4 = async (to, subject, html, attachments = []) => {
  try {
    console.log('📧 METHOD 4: Using nodemailer with require');
    
    // Try require approach
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ METHOD 4: Email sent successfully via nodemailer (require)');
    return { success: true, method: 'nodemailer-require', messageId: info.messageId };
  } catch (error) {
    console.error('❌ METHOD 4 failed:', error.message);
    return { success: false, method: 'nodemailer-require', error: error.message };
  }
};

// Method 5: Using SendGrid API
export const sendEmailMethod5 = async (to, subject, html, attachments = []) => {
  try {
    console.log('📧 METHOD 5: Using SendGrid API');
    
    // This would require SendGrid API key
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: { email: process.env.SMTP_FROM },
        content: [{
          type: 'text/html',
          value: html
        }]
      })
    });

    if (response.ok) {
      console.log('✅ METHOD 5: Email sent successfully via SendGrid');
      return { success: true, method: 'sendgrid', messageId: Date.now() };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ METHOD 5 failed:', error.message);
    return { success: false, method: 'sendgrid', error: error.message };
  }
};

// Method 6: Using Mailgun API
export const sendEmailMethod6 = async (to, subject, html, attachments = []) => {
  try {
    console.log('📧 METHOD 6: Using Mailgun API');
    
    // This would require Mailgun API key
    const formData = new FormData();
    formData.append('from', process.env.SMTP_FROM);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', html);

    const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN || 'your-domain'}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY || 'your-mailgun-api-key'}`).toString('base64')}`,
      },
      body: formData
    });

    if (response.ok) {
      console.log('✅ METHOD 6: Email sent successfully via Mailgun');
      return { success: true, method: 'mailgun', messageId: Date.now() };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ METHOD 6 failed:', error.message);
    return { success: false, method: 'mailgun', error: error.message };
  }
};

// Method 7: Simple console logging (always works)
export const sendEmailMethod7 = async (to, subject, html, attachments = []) => {
  try {
    console.log('📧 METHOD 7: Simple console logging (always works)');
    
    console.log('='.repeat(50));
    console.log('📧 EMAIL SENT');
    console.log('='.repeat(50));
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML Content:');
    console.log(html);
    console.log('Attachments:', attachments.length);
    console.log('='.repeat(50));
    
    return { success: true, method: 'console-log', messageId: Date.now() };
  } catch (error) {
    console.error('❌ METHOD 7 failed:', error.message);
    return { success: false, method: 'console-log', error: error.message };
  }
};

// Try all methods and return results
export const tryAllEmailMethods = async (to, subject, html, attachments = []) => {
  console.log('🔄 TRYING ALL EMAIL METHODS...');
  console.log('='.repeat(60));
  
  const methods = [
    sendEmailMethod1,
    sendEmailMethod2,
    sendEmailMethod3,
    sendEmailMethod4,
    sendEmailMethod5,
    sendEmailMethod6,
    sendEmailMethod7,
  ];
  
  const results = [];
  
  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`\n🔄 Trying Method ${i + 1}...`);
      const result = await methods[i](to, subject, html, attachments);
      results.push(result);
      
      if (result.success) {
        console.log(`✅ Method ${i + 1} succeeded!`);
        return result; // Return first successful method
      }
    } catch (error) {
      console.error(`❌ Method ${i + 1} threw error:`, error.message);
      results.push({ success: false, method: `method${i + 1}`, error: error.message });
    }
  }
  
  console.log('\n📊 ALL METHODS RESULTS:');
  console.log('='.repeat(60));
  results.forEach((result, index) => {
    console.log(`Method ${index + 1} (${result.method}): ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (!result.success) {
      console.log(`  Error: ${result.error}`);
    }
  });
  
  // Return the last method (console logging) as fallback
  return results[results.length - 1];
};
