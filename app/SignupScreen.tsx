import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigation = useNavigation();

  const handleSendOtp = async () => {
    try {
      await axios.post('http://192.168.8.130:5000/api/user/send-otp', { phoneNumber });
      setOtpSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://192.168.8.130:5000/api/user/verify-otp', { phoneNumber, otp });
      console.log(response.data);
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!otpSent ? (
          <>
            <Text>Enter your phone number</Text>
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
            <Text>Enter the OTP sent to your phone</Text>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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

export default SignupScreen;
