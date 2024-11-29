import styles from "@/styles/Sign.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';

export default function Verification() {
  const router = useRouter();
  const { phoneNumber } = router.query;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300);
  const [serverOTP, setServerOTP] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  // Send OTP when component mounts
  useEffect(() => {
    if (phoneNumber) {
      sendOTP();
    }
  }, [phoneNumber]);

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

  const sendOTP = async () => {
    setIsLoading(true);
    setShowResend(false);
    try {
      const response = await fetch('/api/sendOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (data.success) {
        setServerOTP(data.otp);
        toast.success('OTP sent successfully!');
      } else {
        toast.error('Failed to send OTP');
        setShowResend(true);
      }
    } catch (error) {
      toast.error('Error sending OTP');
      setShowResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setTimeLeft(300);
    setOtp(['', '', '', '', '', '']);
    sendOTP();
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    if (isNaN(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
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

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOTP = otp.join('');
    
    if (enteredOTP.length !== 6) {
      toast.error('Please enter complete verification code');
      return;
    }

    // Compare with server OTP
    if (parseInt(enteredOTP) === serverOTP) {
      toast.success('Verification successful!');
      // Wait for toast to show before redirecting
      setTimeout(() => {
        router.push('/dashboard'); // or wherever you want to redirect
      }, 1500);
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
          src="/verify.png"
          alt="Verification illustration"
          width={280}
          height={200}
          priority
          className={styles.illustration}
        />
      </div>

      <p className={styles.verificationText}>
        Enter the code from the sms we<br />
        sent you on {phoneNumber}
      </p>

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
          onClick={handleResendOTP}
          className={styles.resendButton}
        >
          Resend verification code
        </button>
      )}

      {isLoading && <div className={styles.loader}>Sending OTP...</div>}
    </div>
  );
} 