import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av';

const StatusView = () => {
  const { statusId, avatar, name, statusesJson } = useLocalSearchParams();
  const [statuses, setStatuses] = useState(JSON.parse(statusesJson));
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [remainingDuration, setRemainingDuration] = useState(0);

  const handleBackPress = () => {
    router.back();
  };

  const handleNextStatus = () => {
    if (currentStatusIndex < statuses.length - 1) {
      setCurrentStatusIndex(currentStatusIndex + 1);
      resetProgressBar();
    } else {
      router.back();
    }
  };

  const handlePrevStatus = () => {
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex(currentStatusIndex - 1);
      resetProgressBar();
    }
  };

  const resetProgressBar = () => {
    progressAnim.setValue(0);
    startProgressBar();
  };

  const startProgressBar = (duration = 6000) => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
      isInteraction: false,
    }).start(() => {
      if (!paused) {
        handleNextStatus();
      }
    });
  };

  useEffect(() => {
    if (!paused) {
      const duration = currentStatus.type === 'video' ? 30000 : 6000;
      setRemainingDuration(duration);
      startProgressBar(duration);
    }
  }, [currentStatusIndex, paused]);

  const handlePressIn = () => {
    setPaused(true);
    Animated.timing(progressAnim).stop();
    progressAnim.stopAnimation(value => {
      setRemainingDuration(remainingDuration * (1 - value));
    });
  };

  const handlePressOut = () => {
    setPaused(false);
    startProgressBar(remainingDuration);
  };

  const handleInputFocus = () => {
    setPaused(true);
    Animated.timing(progressAnim).stop();
    progressAnim.stopAnimation(value => {
      setRemainingDuration(remainingDuration * (1 - value));
    });
  };

  const handleInputBlur = () => {
    setPaused(false);
    startProgressBar(remainingDuration);
  };

  const currentStatus = statuses[currentStatusIndex];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: -20, android: 0 })}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.content}
            onPress={handleNextStatus}
            onLongPress={handlePrevStatus}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <View style={styles.statusIndicatorsContainer}>
              {statuses.map((status, index) => (
                <View key={index} style={styles.statusIndicatorBackground}>
                  {index === currentStatusIndex ? (
                    <Animated.View
                      style={[
                        styles.statusIndicator,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  ) : (
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: index < currentStatusIndex ? '#fff' : '#555',
                          width: '100%',
                        },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
            <View style={styles.headerOnContent}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>{name}</Text>
                <Text style={styles.headerSubtitle}>Yesterday at 4:05 PM</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            {currentStatus.type === 'text' && (
              <Text style={styles.contentText}>{currentStatus.content}</Text>
            )}
            {currentStatus.type === 'image' && (
              <Image source={{ uri: currentStatus.content }} style={styles.contentImage} />
            )}
            {currentStatus.type === 'video' && (
              <Video
                source={{ uri: currentStatus.content }}
                style={styles.contentVideo}
                resizeMode="cover"
                shouldPlay={!paused}
                isLooping
                useNativeControls
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Reply to the status..."
            style={styles.input}
            placeholderTextColor="#888"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Icon name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  statusIndicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  statusIndicatorBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#555',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  statusIndicator: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  headerOnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    zIndex: 1,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerSubtitle: {
    color: '#ccc',
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 16,
  },
  contentText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  contentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentVideo: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#444',
    backgroundColor: '#000', // Ensures background color is consistent
  },
  input: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 16,
  },
});

export default StatusView;
