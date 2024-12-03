import styles from "@/styles/Sign.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';

export default function EmailSignup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long, contain 1 capital letter and 1 special character');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Get existing data and add email and password
      const signupData = JSON.parse(sessionStorage.getItem('signupData'));
      signupData.email = email;
      signupData.password = password; // We'll hash this on the server side
      sessionStorage.setItem('signupData', JSON.stringify(signupData));
      
      router.push('/email-verification');
    } catch (error) {
      toast.error('Failed to process signup');
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

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Create password"
            required
          />
          <small className={styles.hint}>
            Must be at least 8 characters with 1 capital letter and 1 special character
          </small>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            placeholder="Confirm password"
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