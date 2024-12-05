import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import styles from '@/styles/AddManually.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function AddManually({ user }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/addCarManually', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ make, model, year, userId: user.id }),
      });

      if (response.ok) {
        toast.success('Car added successfully!');
        router.push('/select-car');
      } else {
        toast.error('Failed to add car!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred!');
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <h2>Add Car Manually</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={styles.inputField}
          required
        />
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
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