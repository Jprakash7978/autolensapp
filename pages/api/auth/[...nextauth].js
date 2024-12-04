// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import pool from '@/utils/db';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const connection = await pool.getConnection();
          const [users] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);

          if (users.length === 0) {
            return null; // No user found
          }

          const user = users[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null; // Invalid password
          }

          // Return user object to create session
          return { id: user.id, email: user.email, name: user.name };

        } catch (error) {
          console.error('Error in NextAuth authorize:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // You can specify the login page if you have a custom one
    error: '/auth/error', // Custom error page (optional)
  },
  session: {
    strategy: 'jwt', // Use JWTs for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Optional: Add a secret for JWT signing
});
