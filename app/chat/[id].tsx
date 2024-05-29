import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  PanResponder,
  Animated,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatScreen = () => {
  const { id, chatName, messages } = useLocalSearchParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [isRecording, setIsRecording] = useState(false);
  const lockOpacity = useRef(new Animated.Value(0)).current;
  const micButtonRef = useRef(null);
  const textInputRef = useRef(null);

  const handleBackPress = () => {
    router.back();
  };

  const handlePlusPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleInputFocus = () => {
    if (isExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(false);
    }
  };

  const handleInputChange = (text) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTyping(text.length > 0);
  };

  const handleContentSizeChange = (event) => {
    setInputHeight(Math.min(event.nativeEvent.contentSize.height, 120)); // Set a maximum height
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.timing(lockOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < -50) { // Swipe up threshold
          setIsRecording(true);
        }
      },
      onPanResponderRelease: () => {
        Animated.timing(lockOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        if (isRecording) {
          console.log("Recording locked");
        } else {
          setIsRecording(false);
        }
      },
    })
  ).current;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    if (result.type !== 'cancel') {
      console.log(result.uri);
    }
  };

  const toggleEmojiKeyboard = () => {
    textInputRef.current.blur();
    textInputRef.current.focus();
  };

  const parsedMessages = messages ? JSON.parse(messages) : [];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.avatar} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{chatName}</Text>
            <Text style={styles.headerSubtitle}>online</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="call-outline" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="videocam-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <ImageBackground
         source={require('../../assets/images/defaultbackground.png')} // Add your default background image URL here
          style={styles.chatBackground}
        >
          <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 80, paddingTop: 16 }}>
            {parsedMessages.map((message) => (
              <View key={message.id} style={[styles.messageRow, message.sender === 'me' ? styles.myMessageRow : styles.otherMessageRow]}>
                {message.sender !== 'me' && (
                  <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.messageAvatar} />
                )}
                <View style={[styles.messageContainer, message.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
                  <Text style={styles.messageText}>{message.text}</Text>
                  <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </ImageBackground>
        <View style={styles.inputContainer}>
          {isExpanded ? (
            <View style={styles.extraIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={openCamera}>
                <Icon name="camera" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
                <Icon name="image" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={pickDocument}>
                <Icon name="document" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.plusButton} onPress={handlePlusPress}>
              <Icon name="add" size={24} color="#000" />
            </TouchableOpacity>
          )}
          <View style={[styles.inputWrapper, isExpanded && styles.inputWrapperExpanded]}>
            <TextInput
              ref={textInputRef}
              placeholder="Send message"
              style={[styles.input, { height: Math.max(40, inputHeight) }]}
              onFocus={handleInputFocus}
              onChangeText={handleInputChange}
              onContentSizeChange={handleContentSizeChange}
              multiline
            />
            <TouchableOpacity style={styles.emojiButton} onPress={() => {
              textInputRef.current.blur();
              Keyboard.dismiss();
              setTimeout(() => textInputRef.current.focus(), 100);
            }}>
              <Icon name="happy-outline" size={24} color="#888" />
            </TouchableOpacity>
          </View>
          {isTyping ? (
            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          ) : !isExpanded && (
            <View style={styles.micButtonContainer} ref={micButtonRef} {...panResponder.panHandlers}>
              <TouchableOpacity style={styles.micButton}>
                <Icon name="mic" size={24} color="#000" />
              </TouchableOpacity>
              <Animated.View style={[styles.lockIcon, { opacity: lockOpacity }]}>
                <Icon name="lock-closed-outline" size={24} color="#000" />
              </Animated.View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  chatBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 8,
    padding: 10,
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  plusButton: {
    padding: 10,
  },
  animatedInputContainer: {
    flex: 1,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  inputWrapperExpanded: {
    flex: 1,
    marginRight: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  emojiButton: {
    marginLeft: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
  },
  micButtonContainer: {
    position: 'relative',
  },
  micButton: {
    padding: 10,
  },
  lockIcon: {
    position: 'absolute',
    bottom: 60,
    left: '50%',
    transform: [{ translateX: -12 }],
  },
  extraIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginHorizontal: 5,
  },
});

export default ChatScreen;
