import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('auth-token');
      if (token) {
        try {
          const response = await axios.get('http://192.168.8.130:5000/api/user/me', {
            headers: { 'auth-token': token }
          });
          if (response.status === 200) {
            setUser(response.data);
            console.log('User loaded:', response.data);
          } else {
            console.error('Failed to load user:', response);
          }
        } catch (error) {
          console.error('Failed to load user', error);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (phoneNumber, otp) => {
    try {
      const response = await axios.post('http://192.168.8.130:5000/api/user/verify-login-otp', { phoneNumber, otp });
      if (response.data.token) {
        await AsyncStorage.setItem('auth-token', response.data.token);
        setUser(response.data.user);
        console.log('Login successful:', response.data.user);
      } else {
        console.error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
