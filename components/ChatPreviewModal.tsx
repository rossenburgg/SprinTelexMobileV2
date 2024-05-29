import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';

const ChatPreviewModal = ({ visible, chat, onClose }) => {
  // Check if chat is null before accessing its properties
  if (!chat) {
    return null; // or any default content you want to render when chat is null
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lastMessage: {
    fontSize: 16,
  },
});

export default ChatPreviewModal;
