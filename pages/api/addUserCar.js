import pool from '@/utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, carId, isManual } = req.body;

    try {
      const connection = await pool.getConnection();

      // Check if the entry already exists
      const [existing] = await connection.query(
        'SELECT * FROM userscar WHERE userid = ? AND carid = ?',
        [userId, carId]
      );

      if (existing.length > 0) {
        connection.release();
        return res.status(409).json({ error: 'Car already added for this user' });
      }

      // Insert the new entry
      await connection.query(
        'INSERT INTO userscar (userid, carid, ismanual) VALUES (?, ?, ?)',
        [userId, carId, isManual]
      );
      connection.release();

      res.status(200).json({ message: 'Car added successfully' });
    } catch (error) {
      console.error('Error adding car:', error);
      res.status(500).json({ error: 'Failed to add car' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}