import styles from "@/styles/Sign.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignupSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Check if user completed signup
    const signupData = sessionStorage.getItem('signupData');
    if (!signupData || !JSON.parse(signupData).emailVerified) {
      router.push('/signup');
      return;
    }
  }, []);

  const handleContinue = () => {
    // Clear signup data and redirect to dashboard
    sessionStorage.removeItem('signupData');
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Signup Complete!</h1>
      </div>

      <div className={styles.imageContainer}>
        <Image
          src="/signup-success.jpg"
          alt="Success illustration"
          width={280}
          height={200}
          priority
          className={styles.illustration}
        />
      </div>

      <div className={styles.successMessage}>
        <h2>Congratulations! Your<br />signup is complete.</h2>
      </div>

      <button 
        onClick={handleContinue}
        className={styles.nextButton}
      >
        Continue
      </button>
    </div>
  );
} 