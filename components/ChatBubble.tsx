// ChatBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ChatBubbleProps = {
  text: string;
  timestamp: string;
  sender: string;
};

const ChatBubble = ({ text, timestamp, sender }: ChatBubbleProps) => {
  const isMe = sender === 'me';
  return (
    <View style={[styles.container, isMe ? styles.myMessage : styles.theirMessage]}>
      <Text style={styles.messageText}>{text}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default ChatBubble;
