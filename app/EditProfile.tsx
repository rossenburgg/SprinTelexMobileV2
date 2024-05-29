import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.profileImage || 'https://picsum.photos/200');
  const [username, setUsername] = useState(user?.username || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [birthday, setBirthday] = useState(user?.dob ? new Date(user.dob).toLocaleDateString() : '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('http://192.168.8.130:5000/api/user/update-profile', {
        userId: user._id,
        username,
        phoneNumber,
        bio,
        dob: birthday ? new Date(birthday) : null,
      });
      console.log('Profile updated:', response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['#EFEFF4', '#FFFFFF'],
    extrapolate: 'clamp',
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setBirthday(date.toLocaleDateString());
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerButtonText, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSaveProfile}>
          <Text style={[styles.headerButtonText, { color: colors.primary }]}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change Photo</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.grayText}>Specify your name and, if you want, add a photo to your profile.</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <Text style={styles.grayText}>You can add a few lines about yourself. In settings, you can choose who will see it.</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Bio"
            placeholderTextColor="#888"
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <Text style={styles.grayText}>Your birthday can only be seen by your contacts.</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.input} onPress={showDatePicker}>
            <Text style={styles.inputText}>Birthday</Text>
            <Text style={styles.inputValue}>{birthday || 'Set'}</Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <View style={styles.card}>
          <TouchableOpacity style={styles.input}>
            <Text style={styles.inputText}>Change Number</Text>
            <Text style={styles.inputValue}>{phoneNumber}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.grayText}>You can connect multiple accounts with different phone numbers.</Text>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4', // Overall background color
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 55 : 0,
    width: '100%',
    zIndex: 2,
    position: 'absolute',
    top: 0,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtonText: {
    fontSize: 18,
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoText: {
    fontSize: 16,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    paddingVertical: 0,
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
  },
  inputText: {
    fontSize: 16,
    color: '#888',
  },
  inputValue: {
    fontSize: 16,
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  grayText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addAccountText: {
    fontSize: 16,
    color: '#007AFF',
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
  },
});

export default EditProfileScreen;
