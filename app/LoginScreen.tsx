import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleSendOtp = async () => {
    try {
      console.log('Sending OTP to:', phoneNumber);
      const response = await axios.post('http://192.168.8.130:5000/api/user/send-login-otp', { phoneNumber });
      console.log(response.data);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      console.log('Verifying OTP for:', phoneNumber);
      const response = await axios.post('http://192.168.8.130:5000/api/user/verify-login-otp', { phoneNumber, otp });
      console.log('OTP verification response:', response.data);
      await login(phoneNumber, otp);
      navigation.navigate('(tabs)'); // Ensure the correct route is used
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!otpSent ? (
        <>
          <Text>Login</Text>
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <Button title="Send OTP" onPress={handleSendOtp} />
        </>
      ) : (
        <>
          <Text>Enter OTP</Text>
          <TextInput
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default LoginScreen;
