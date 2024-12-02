import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp, firstName, lastName, phoneNumber } = req.body;

  try {
    // Here you would typically verify the OTP first
    // For demo purposes, we'll assume the OTP is correct

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phoneNumber,
        emailVerified: true,
        phoneVerified: true,
      },
    });

    res.status(200).json({ 
      success: true, 
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create user' 
    });
  } finally {
    await prisma.$disconnect();
  }
} 