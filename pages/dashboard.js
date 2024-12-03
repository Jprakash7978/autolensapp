import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = true; // Replace with actual authentication check

    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {/* Dashboard content */}
    </div>
  );
} 