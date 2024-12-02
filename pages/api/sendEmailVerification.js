import nodemailer from 'nodemailer';

// Create reusable transporter with updated configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Using port 587 instead of 465
  secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Allowing self-signed certificates
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    // Verify transporter connection
    await transporter.verify();
    console.log('Server is ready to take our messages');

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create email options
    const mailOptions = {
      from: `"Verification Service" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    res.status(200).json({ 
      success: true, 
      otp,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error('Error sending verification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send verification code',
      details: error.message
    });
  }
} 