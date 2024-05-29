import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { Button, Input, YStack, Separator } from 'tamagui';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import RNHapticFeedback from 'react-native-haptic-feedback';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, withTiming } from 'react-native-reanimated';
import ChatItem from '../../components/ChatItem'; // Import the ChatItem component

type StatusContent = {
  id: number;
  type: 'text' | 'image' | 'video';
  content: string; // URL for image/video or text content
  viewed: boolean; // Indicates whether the status has been viewed
};

type Status = {
  id: number;
  avatar: string;
  name: string;
  statuses: StatusContent[];
};

const statuses: Status[] = [
  {
    id: 1,
    avatar: 'https://picsum.photos/200',
    name: 'My Story',
    statuses: [
      { id: 1, type: 'image', content: 'https://picsum.photos/300', viewed: false },
      { id: 2, type: 'text', content: 'Hello, this is a text status!', viewed: false },
      { id: 3, type: 'video', content: 'https://www.w3schools.com/html/mov_bbb.mp4', viewed: false },
    ],
  },
  {
    id: 2,
    avatar: 'https://picsum.photos/200',
    name: 'Richard',
    statuses: [
      { id: 1, type: 'image', content: 'https://picsum.photos/400', viewed: false },
    ],
  },
  // Add more statuses here
];

type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  messages: Array<{ id: number; text: string; timestamp: string; sender: string }>;
};

const chats: Chat[] = [
  {
    id: 1,
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: '2:45 PM',
    unreadCount: 3,
    avatar: 'https://picsum.photos/id/1011/200',
    messages: [
      { id: 1, text: 'Hello!', timestamp: '10:45 AM', sender: 'me' },
      { id: 2, text: 'How are you?', timestamp: '10:46 AM', sender: 'other' },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    lastMessage: 'Are you coming to the party?',
    timestamp: '1:30 PM',
    unreadCount: 2,
    avatar: 'https://picsum.photos/id/1012/200',
    messages: [
      { id: 1, text: 'Are you coming to the party?', timestamp: '1:30 PM', sender: 'me' },
      { id: 2, text: 'Yes, I will be there!', timestamp: '1:35 PM', sender: 'other' },
    ],
  },
  {
    id: 3,
    name: 'Alice Johnson',
    lastMessage: 'Can you send me the report?',
    timestamp: '11:20 AM',
    unreadCount: 5,
    avatar: 'https://picsum.photos/id/1013/200',
    messages: [
      { id: 1, text: 'Can you send me the report?', timestamp: '11:20 AM', sender: 'me' },
      { id: 2, text: 'Sure, I will send it by today.', timestamp: '11:25 AM', sender: 'other' },
    ],
  },
  {
    id: 4,
    name: 'Bob Williams',
    lastMessage: 'Good morning!',
    timestamp: '9:00 AM',
    unreadCount: 1,
    avatar: 'https://picsum.photos/id/1014/200',
    messages: [
      { id: 1, text: 'Good morning!', timestamp: '9:00 AM', sender: 'me' },
      { id: 2, text: 'Good morning to you too!', timestamp: '9:05 AM', sender: 'other' },
    ],
  },
  {
    id: 5,
    name: 'Charlie Brown',
    lastMessage: 'What time is the meeting?',
    timestamp: 'Yesterday',
    unreadCount: 4,
    avatar: 'https://picsum.photos/id/1015/200',
    messages: [
      { id: 1, text: 'What time is the meeting?', timestamp: 'Yesterday', sender: 'me' },
      { id: 2, text: 'It’s at 3 PM.', timestamp: 'Yesterday', sender: 'other' },
    ],
  },
  {
    id: 6,
    name: 'Charlie Brown',
    lastMessage: 'What time is the meeting?',
    timestamp: 'Yesterday',
    unreadCount: 4,
    avatar: 'https://picsum.photos/id/1015/200',
    messages: [
      { id: 1, text: 'What time is the meeting?', timestamp: 'Yesterday', sender: 'me' },
      { id: 2, text: 'It’s at 3 PM.', timestamp: 'Yesterday', sender: 'other' },
    ],
  },
];


const ChatListScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(scrollY.value > 100 ? 0 : 60, { duration: 200 }),
    };
  });

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollY.value > 50 ? 0 : 1, { duration: 200 }),
    };
  });

  const handleLongPress = (chat: Chat) => {
    RNHapticFeedback.trigger('impactLight');
    setSelectedChat(chat);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedChat(null);
  };

  const handlePress = (chat: Chat) => {
    router.push({
      pathname: `/chat/${chat.id}`,
      params: { chatName: chat.name, messages: JSON.stringify(chat.messages) },
    });
  };

  const handleStatusPress = (status: Status) => {
    router.push({
      pathname: `/StatusView`,
      params: {
        statusId: status.id,
        avatar: status.avatar,
        name: status.name,
        statusesJson: JSON.stringify(status.statuses),
      },
    });
  };

  return (
    <YStack flex={1} backgroundColor={colors.background}>
      <Animated.View style={[headerHeight, opacity, { overflow: 'hidden', paddingHorizontal: 16, paddingVertical: 8 }]}>
        <Input
          placeholder="Search"
          width="100%"
          backgroundColor="#f0f0f0"
          borderRadius="$4"
          paddingHorizontal="$3"
          placeholderTextColor="#888"
        />
      </Animated.View>
      <View style={styles.statusContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusScroll}
        >
          {statuses.map(status => (
            <TouchableOpacity key={status.id} style={styles.statusItem} onPress={() => handleStatusPress(status)}>
              <View style={styles.statusAvatarContainer}>
                <Image source={{ uri: status.avatar }} style={styles.statusAvatar} />
                {status.name === 'My Story' && (
                  <View style={styles.plusIconContainer}>
                    <Icon name="add-circle" size={24} color="#007AFF" />
                  </View>
                )}
              </View>
              <Text style={styles.statusName}>{status.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {chats.map(chat => (
          <ChatItem key={chat.id} chat={chat} onPress={() => handlePress(chat)} onLongPress={() => handleLongPress(chat)} />
        ))}
      </Animated.ScrollView>
      <YStack position="absolute" bottom="$4" right="$4">
        <Button circular size="$4">
          +
        </Button>
      </YStack>
      {selectedChat && (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={closeModal}
          backdropOpacity={1}
          backdropColor="transparent"
          style={{ margin: 0 }}
        >
          <TouchableOpacity style={styles.absolute} onPress={closeModal} activeOpacity={1}>
            <BlurView intensity={30} style={styles.absolute} />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ChatModal chat={selectedChat} closeModal={closeModal} />
          </View>
        </Modal>
      )}
    </YStack>
  );
};

const ChatModal = ({ chat, closeModal }: { chat: Chat; closeModal: () => void }) => (
  <View style={modalStyles.modalContainer}>
    <View style={modalStyles.header}>
      <Image source={{ uri: chat.avatar }} style={modalStyles.avatar} />
      <View style={modalStyles.headerTextContainer}>
        <Text style={modalStyles.chatName}>{chat.name}</Text>
        <Text style={modalStyles.timestamp}>{chat.timestamp}</Text>
      </View>
      <TouchableOpacity onPress={closeModal}>
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>
    </View>
    <ScrollView style={modalStyles.messagesContainer}>
      {chat.messages.map((message) => (
        <ChatBubble key={message.id} text={message.text} timestamp={message.timestamp} sender={message.sender} />
      ))}
    </ScrollView>
    
  </View>
);

const styles = StyleSheet.create({
  statusContainer: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  statusScroll: {
    paddingHorizontal: 16,
  },
  statusItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusAvatarContainer: {
    position: 'relative',
  },
  statusAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  statusName: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 20,
    marginVertical: 162,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  messagesContainer: {
    marginTop: 20,
  },
  message: {
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default ChatListScreen;
