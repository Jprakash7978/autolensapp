import { v4 as uuidv4 } from 'uuid';
import pool from '@/utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { make, model, year, userId } = req.body;

    try {
      const connection = await pool.getConnection();

      // Generate a UUID
      const carId = uuidv4();

      // Insert into carlisting table with the generated UUID
      await connection.query(
        'INSERT INTO carlisting (id, make, model, year) VALUES (?, ?, ?, ?)',
        [carId, make, model, year]
      );

      console.log('Inserted Car ID:', carId);

      // Insert into userscar table
      await connection.query(
        'INSERT INTO userscar (userid, carid, ismanual) VALUES (?, ?, ?)',
        [userId, carId, true]
      );

      connection.release();
      res.status(200).json({ message: 'Car added successfully', carId });
    } catch (error) {
      console.error('Error adding car:', error);
      res.status(500).json({ error: 'Failed to add car' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
