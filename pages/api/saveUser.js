import pool from '@/utils/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, phoneNumber, email, password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required'
    });
  }

  try {
    const connection = await pool.getConnection();

    try {
      // Check if user already exists
      const [existingUsers] = await connection.query(
        'SELECT * FROM user WHERE email = ? ',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user with password
      const [result] = await connection.query(
        `INSERT INTO user (
          firstName, 
          lastName, 
          phoneNumber, 
          email, 
          password,
          phoneVerified, 
          emailVerified
        ) VALUES (?, ?, ?, ?, ?, true, true)`,
        [firstName, lastName, phoneNumber, email, hashedPassword]
      );

      res.status(200).json({
        success: true,
        message: 'User data saved successfully',
        userId: result.insertId
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save user data'
    });
  }
} 