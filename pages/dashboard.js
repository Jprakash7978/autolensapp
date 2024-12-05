// pages/dashboard.js
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard({ user }) {
  const router = useRouter();

  const handleAddManually = () => {
    router.push('/select-car');
  };

  return (
    <div className={styles.container}>
      <button onClick={() => signOut()} className={styles.logoutButton}>
        <span>Logout</span> 🔒
      </button>
      <h2>Welcome, {user.name}</h2>
      <p>Your email is: {user.email}</p>
      <button onClick={handleAddManually} className={styles.addButton}>
        Add Manually
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}
