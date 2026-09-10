import { AuthProvider, useAuth } from '@/lib/auth';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import CreeperLoading from '@/components/CreeperLoading';

function Gate() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <CreeperLoading />;
  }

  return profile ? <Dashboard /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
