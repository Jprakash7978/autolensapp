import styles from "@/styles/Sign.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SignUp() {
  const router = useRouter();
  const { step: queryStep, phoneNumber: queryPhone, firstName: queryFirstName, lastName: queryLastName } = router.query;
  
  // Step state (1: name form, 2: phone number form)
  const [step, setStep] = useState(queryStep ? parseInt(queryStep) : 1);
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: queryFirstName || '',
    lastName: queryLastName || '',
    phoneNumber: queryPhone || ''
  });

  // Add error state for phone number
  const [phoneError, setPhoneError] = useState('');

  // Update form data when query params change
  useEffect(() => {
    if (queryStep) {
      setStep(parseInt(queryStep));
    }
    if (queryPhone || queryFirstName || queryLastName) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: queryPhone || prev.phoneNumber,
        firstName: queryFirstName || prev.firstName,
        lastName: queryLastName || prev.lastName
      }));
    }
  }, [queryStep, queryPhone, queryFirstName, queryLastName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // Only allow numbers
      const numbersOnly = value.replace(/[^0-9]/g, '');
      // Limit to 10 digits
      const truncated = numbersOnly.slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: truncated
      }));
      
      // Validate phone number
      if (truncated.length > 0 && truncated.length !== 10) {
        setPhoneError('Phone number must be 10 digits');
      } else {
        setPhoneError('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Validate first and last name
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        alert('Please fill in all required fields');
        return;
      }
      // Move to phone number step with form data in query
      router.push({
        pathname: '/signup',
        query: {
          step: 2,
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      });
    } else if (step === 2) {
      if (!formData.phoneNumber.trim()) {
        setPhoneError('Please enter your phone number');
        return;
      }
      if (formData.phoneNumber.length !== 10) {
        setPhoneError('Phone number must be 10 digits');
        return;
      }
      // Navigate to verification page with all data
      router.push(`/verification?phoneNumber=${formData.phoneNumber}&firstName=${formData.firstName}&lastName=${formData.lastName}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {step === 1 && (
          <Link href="/" className={styles.backButton}>
            ←
          </Link>
        )}
        <h1 className={styles.title}>Sign Up</h1>
      </div>

      {step === 1 ? (
        <>
          <div className={styles.imageContainer}>
            <Image
              src="/signup.png"
              alt="Handshake illustration"
              width={280}
              height={200}
              priority
              className={styles.illustration}
            />
          </div>

          <form className={styles.form} onSubmit={handleNextStep}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.nextButton}>
              Next
            </button>
          </form>
        </>
      ) : (
        <>
          <div className={styles.imageContainer}>
            <Image
              src="/phone.png"
              alt="Phone illustration"
              width={280}
              height={200}
              priority
              className={styles.illustration}
            />
          </div>

          <form className={styles.form} onSubmit={handleNextStep}>
            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber">Phone Number*</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={`${styles.input} ${phoneError ? styles.inputError : ''}`}
                placeholder="Enter 10 digit number"
                pattern="[0-9]{10}"
              />
              {phoneError && (
                <span className={styles.errorMessage}>
                  {phoneError}
                </span>
              )}
            </div>

            <button type="submit" className={styles.nextButton}>
              Next
            </button>
          </form>
        </>
      )}
    </div>
  );
} 