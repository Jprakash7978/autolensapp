import { getSession } from 'next-auth/react';
import styles from '@/styles/SelectCar.module.css';
import pool from '@/utils/db';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';

Modal.setAppElement('#__next');

export default function SelectCar({ cars, user }) {
  const router = useRouter();
  const [selectedCar, setSelectedCar] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (car) => {
    setSelectedCar(car);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCar(null);
    setModalIsOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('/api/addUserCar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          carId: selectedCar.id,
          isManual: false,
        }),
      });

      if (response.ok) {
        toast.success('Car added successfully!');
        closeModal();
      } else if (response.status === 409) {
        toast.error('Car already added for this user!');
        closeModal();
      } else {
        toast.error('Failed to add car!');
        closeModal();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred!');
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <h2 className={styles.title}>Select your car</h2>
      <ul className={styles.carList}>
        {cars.map((car) => (
          <li
            key={`${car.make}-${car.model}`}
            className={styles.carItem}
            onClick={() => openModal(car)}
          >
            <div className={styles.carDetails}>
              <strong>{car.make}</strong>
              <span>{car.model}</span>
            </div>
            <span className={styles.carYear}>{car.year}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => router.push('/add-manually')} className={styles.addButton}>
        Add Manually
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Car Selection"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Confirm Selection</h2>
        <p>
          Are you sure you want to add the {selectedCar?.make} {selectedCar?.model}?
        </p>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
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

  const connection = await pool.getConnection();
  const [cars] = await connection.query('SELECT id, make, model, year FROM carlisting');
  connection.release();

  return {
    props: { cars, user: session.user },
  };
} 