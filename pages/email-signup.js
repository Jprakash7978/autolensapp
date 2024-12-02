import styles from "@/styles/Sign.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';

export default function EmailSignup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have the required data
    const signupData = sessionStorage.getItem('signupData');
    if (!signupData) {
      router.push('/signup'); // Redirect if no data found
      return;
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Get existing data and add email
      const signupData = JSON.parse(sessionStorage.getItem('signupData'));
      signupData.email = email;
      sessionStorage.setItem('signupData', JSON.stringify(signupData));
      
      router.push('/email-verification');
    } catch (error) {
      toast.error('Failed to process email');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <div className={styles.header}>
        <h1 className={styles.title}>Sign Up</h1>
      </div>

      <div className={styles.imageContainer}>
        <Image
          src="/email-signup.png"
          alt="Email signup illustration"
          width={280}
          height={200}
          priority
          className={styles.illustration}
        />
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Enter your email"
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.nextButton}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Next'}
        </button>
      </form>
    </div>
  );
} 