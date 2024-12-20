import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '@/styles/Login.module.css';
import { Toaster, toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      toast.error('Invalid email or password');
    } else {
      toast.success('Login successful');
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <h2 className={styles.loginTitle}>Log In</h2>
      <Image
        src="/signup.png"
        alt="Login Illustration"
        width={200}
        height={200}
        className={styles.image}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <div className={styles.passwordContainer}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.eyeButton}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      <button onClick={handleLogin} className={styles.button}>
        Submit
      </button>
    </div>
  );
} 