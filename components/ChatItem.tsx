import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { ListItem, XStack, YStack, Separator } from 'tamagui';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import LottieEffect from '../components/LottieEffect'; // Import the LottieEffect component

const ChatItem = ({ chat, onPress, onLongPress }) => {
  const burstAnim = useSharedValue(1);
  const [unreadCount, setUnreadCount] = useState(chat.unreadCount);
  const [showLottie, setShowLottie] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: burstAnim.value }],
    };
  });

  useEffect(() => {
    if (showLottie) {
      const timer = setTimeout(() => {
        setShowLottie(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLottie]);

  const handleUnreadCountPress = () => {
    if (unreadCount > 0) {
      burstAnim.value = withTiming(1.5, { duration: 100, easing: Easing.ease }, () => {
        burstAnim.value = withTiming(0, { duration: 100, easing: Easing.ease }, () => {
          runOnJS(setUnreadCount)(0);
          runOnJS(setShowLottie)(true);
        });
      });
    }
  };

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <YStack>
        <ListItem hoverTheme paddingVertical="$4" paddingHorizontal="$4" backgroundColor="white">
          <XStack space="$3" alignItems="center">
            <YStack
              width={50}
              height={50}
              borderRadius={25}
              overflow="hidden"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                source={{ uri: chat.avatar }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            </YStack>
            <YStack flex={1}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="700" color="#000" fontSize={16}>{chat.name}</Text>
                <Text color="#888" fontSize={12}>{chat.timestamp}</Text>
              </XStack>
              <XStack justifyContent="space-between" alignItems="center">
                <Text color="#888" numberOfLines={1} flex={1}>{chat.lastMessage}</Text>
                <View style={styles.unreadBubbleContainer}>
                  {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleUnreadCountPress} style={styles.unreadBubble}>
                      <Animated.View style={[styles.unreadCountContainer, animatedStyle]}>
                        <Text style={styles.unreadCountText}>{unreadCount}</Text>
                      </Animated.View>
                    </TouchableOpacity>
                  )}
                  {showLottie && (
                    <LottieEffect
                      visible={showLottie}
                      style={styles.lottieEffectContainer}
                    />
                  )}
                </View>
              </XStack>
            </YStack>
          </XStack>
        </ListItem>
        <Separator marginVertical="$2" marginHorizontal={60} />
      </YStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  unreadBubbleContainer: {
    position: 'relative',
    width: 20,
    height: 20,
  },
  unreadBubble: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
  },
  unreadCountContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountText: {
    color: 'white',
    fontSize: 12,
  },
  lottieEffectContainer: {
    position: 'absolute',
    top: -20,  // Adjust the positioning to center the Lottie effect
    left: -20, // Adjust the positioning to center the Lottie effect
    width: 60, // Increase size for a bigger Lottie effect
    height: 60, // Increase size for a bigger Lottie effect
    zIndex: 10,
  },
});

export default ChatItem;
