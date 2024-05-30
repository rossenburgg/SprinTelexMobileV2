import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;
  const { login } = useAuth();

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('http://192.168.8.130:5000/api/user/verify-login-otp', { phoneNumber, otp });
      if (response.data.token) {
        await login(phoneNumber, otp);
        navigation.replace('(tabs)');
      } else {
        console.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default OTPVerificationScreen;
