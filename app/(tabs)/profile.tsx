import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import the hook

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation(); // Get the navigation object
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scrollY = useRef(new Animated.Value(0)).current;

  const profilePictureSize = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [120, 40],
    extrapolate: 'clamp',
  });

  const profilePictureTop = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [40, Platform.OS === 'ios' ? -height * 0.02 : 10],
    extrapolate: 'clamp',
  });

  const profileOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const profilePositionLeft = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [width / 2 - 76, width / 2 - 20],
    extrapolate: 'clamp',
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const showSearchIcon = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={{ opacity: showSearchIcon }}>
          <Icon name="search-outline" size={24} color={colors.primary} />
        </Animated.View>
        <Text style={styles.headerText}>Settings</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')} // Navigate to EditProfile screen
        >
          <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.searchBarContainer, { opacity: searchBarOpacity }]}>
        <View style={styles.searchWrapper}>
          <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            placeholderTextColor="#888"
          />
        </View>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.profileInfo, { opacity: profileOpacity }]}>
          <Animated.Image
            source={{ uri: 'https://picsum.photos/200' }}
            style={[
              styles.avatar,
              {
                width: profilePictureSize,
                height: profilePictureSize,
                top: profilePictureTop,
                left: profilePositionLeft,
              },
            ]}
          />
          <Text style={styles.name}>Rossen</Text>
          <Text style={styles.phone}>+375 25 753 9362</Text>
          <Text style={styles.username}>@rossenburgg</Text>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.menuCard}>
          <View style={styles.accountContainer}>
            <TouchableOpacity style={styles.accountItem}>
              <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.accountAvatar} />
              <Text style={styles.accountText}>@Defc0n</Text>
              <View style={styles.accountBadge}>
                <Text style={styles.accountBadgeText}>11.7K</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.accountItem}>
              <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.accountAvatar} />
              <Text style={styles.accountText}>Dd</Text>
              <View style={styles.accountBadge}>
                <Text style={styles.accountBadgeText}>62</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.addAccountButton}>
              <Text style={styles.addAccountText}>Add Account</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="bookmark-outline" size={24} color={colors.primary} />
            <Text style={styles.menuText}>Saved Messages</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="call-outline" size={24} color={colors.primary} />
            <Text style={styles.menuText}>Recent Calls</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="chatbox-ellipses-outline" size={24} color={colors.primary} />
            <Text style={styles.menuText}>Stickers</Text>
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>15</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="notifications-outline" size={24} color={colors.primary} />
            <Text style={styles.menuText}>Notifications and Sounds</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="lock-closed-outline" size={24} color={colors.primary} />
            <Text style={styles.menuText}>Privacy and Security</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="server-outline" size={24} color={colors.primary} />
            <Text style={styles.menuText}>Data and Storage</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="color-palette-outline" size={24} color={colors.primary} />
            <Text style={styles.menuText}>Appearance</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#EFEFF4',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  editButton: {
    position: 'absolute',
    right: 16,
    zIndex: 2, // Ensure this is on top
  },
  editButtonText: {
    fontSize: 18,
  },
  searchBarContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 16,
    top: 120,
    zIndex: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    position: 'relative', // Needed for absolute positioning of the avatar
  },
  avatar: {
    position: 'absolute', // Absolute positioning for animation
    width: 120, // Increased size for profile picture
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 140, // Adjust for profile picture size
  },
  phone: {
    fontSize: 16,
    color: '#888',
  },
  username: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  changePhotoText: {
    fontSize: 16,
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  accountContainer: {
    paddingHorizontal: 0,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  accountText: {
    fontSize: 16,
    flex: 1,
  },
  accountBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  accountBadgeText: {
    color: '#fff',
    fontSize: 14,
  },
  addAccountButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addAccountText: {
    fontSize: 16,
    color: '#007AFF',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  menuBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProfileScreen;
