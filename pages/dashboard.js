export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get the final user data
    const data = sessionStorage.getItem('signupData');
    if (!data) {
      router.push('/signup');
      return;
    }
    
    const parsedData = JSON.parse(data);
    // Check if both verifications are complete
    if (!parsedData.phoneVerified || !parsedData.emailVerified) {
      router.push('/signup');
      return;
    }
    
    setUserData(parsedData);
    // Clear the session storage after successful signup
    sessionStorage.removeItem('signupData');
  }, []);

  // ... rest of the dashboard component
} 