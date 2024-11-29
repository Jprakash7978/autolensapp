import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Format phone number consistently
    const formattedPhone = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber}`; // Add +91 if not present

    console.log('Sending OTP:', otp);
    console.log('To phone:', formattedPhone);
    console.log('From phone:', twilioPhone);

    // Send SMS using Twilio
    const message = await client.messages.create({
      body: `Your Auto Lens verification code is: ${otp}`,
      to: formattedPhone,
      from: twilioPhone,
    });

    console.log('Twilio message sent:', message.sid);

    // Return success response with OTP
    res.status(200).json({ 
      success: true, 
      otp,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Error in sendOTP:', error);
    res.status(500).json({ 
      error: 'Failed to send OTP',
      details: error.message,
      twilioPhone: twilioPhone, // For debugging
      accountSid: accountSid.slice(-4) // Show last 4 chars for verification
    });
  }
} 