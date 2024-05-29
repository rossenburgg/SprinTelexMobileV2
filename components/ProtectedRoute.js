import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/LoginScreen');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
