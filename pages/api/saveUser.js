import pool from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, phoneNumber, email } = req.body;

  try {
    const connection = await pool.getConnection();

    try {
      // Check if user already exists
      const [existingUsers] = await connection.query(
        'SELECT * FROM user WHERE email = ? OR phoneNumber = ?',
        [email, phoneNumber]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'User with this email or phone number already exists'
        });
      }

      // Insert new user
      const [result] = await connection.query(
        `INSERT INTO user (
          firstName, 
          lastName, 
          phoneNumber, 
          email, 
          phoneVerified, 
          emailVerified
        ) VALUES (?, ?, ?, ?, true, true)`,
        [firstName, lastName, phoneNumber, email]
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