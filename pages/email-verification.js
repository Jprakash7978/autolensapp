import styles from "@/styles/Sign.module.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';

export default function EmailVerification() {
  const router = useRouter();
  const [signupData, setSignupData] = useState(null);
  const hasInitialized = useRef(false);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [serverOTP, setServerOTP] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    // Get stored data
    const data = sessionStorage.getItem('signupData');
    if (!data) {
      router.push('/signup');
      return;
    }
    setSignupData(JSON.parse(data));
  }, []);

  // Send verification code only once when component mounts
  useEffect(() => {
    if (!hasInitialized.current && signupData?.email) {
      hasInitialized.current = true;
      sendVerificationCode();
    }
  }, [signupData]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowResend(true);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const sendVerificationCode = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setShowResend(false);
    try {
      const response = await fetch('/api/sendEmailVerification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signupData?.email }),
      });

      const data = await response.json();
      if (data.success) {
        setServerOTP(data.otp);
        toast.success('Verification code sent successfully!');
      } else {
        toast.error('Failed to send verification code');
        setShowResend(true);
      }
    } catch (error) {
      toast.error('Error sending verification code');
      setShowResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(300);
    setOtp(['', '', '', '', '', '']);
    setServerOTP(null); // Reset serverOTP to trigger new OTP generation
    hasInitialized.current = false; // Reset initialization flag
    sendVerificationCode();
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOTP = otp.join('');
    
    if (enteredOTP.length !== 6) {
      toast.error('Please enter complete verification code');
      return;
    }

    if (parseInt(enteredOTP) === serverOTP) {
      try {
        // Update stored data with email verification status
        const updatedData = { ...signupData, emailVerified: true };
        sessionStorage.setItem('signupData', JSON.stringify(updatedData));
        
        // Save user data to database
        const response = await fetch('/api/saveUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            phoneNumber: signupData.phoneNumber,
            email: signupData.email
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to save user data');
        }

        toast.success('Email verified successfully!');
        setTimeout(() => {
          router.push('/signup-success');
        }, 1500);
      } catch (error) {
        toast.error(error.message || 'Error completing signup');
      }
    } else {
      toast.error('Invalid verification code');
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <div className={styles.header}>
        <h1 className={styles.title}>Verification</h1>
      </div>

      <div className={styles.imageContainer}>
        <Image
          src="/email-verify.png"
          alt="Email verification illustration"
          width={280}
          height={200}
          priority
          className={styles.illustration}
        />
      </div>

      {signupData && (
        <p className={styles.verificationText}>
          Enter the code from the email<br />
          we sent to {signupData.email}
        </p>
      )}

      <div className={styles.timer}>
        {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
      </div>

      <form onSubmit={handleVerify} className={styles.form}>
        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              id={`otp-${index}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.otpInput}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button type="submit" className={styles.nextButton}>
          Verify
        </button>
      </form>

      {showResend && !isLoading && (
        <button 
          onClick={handleResendCode}
          className={styles.resendButton}
        >
          Resend verification code
        </button>
      )}

      {isLoading && <div className={styles.loader}>Sending verification code...</div>}
    </div>
  );
} 