// components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'expo-router';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/AuthScreen');
      } else {
        router.replace('(tabs)');
      }
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;
