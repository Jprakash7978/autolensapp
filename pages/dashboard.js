// pages/dashboard.js
import { getSession } from 'next-auth/react';

export default function Dashboard({ user }) {
  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Your email is: {user.email}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}
