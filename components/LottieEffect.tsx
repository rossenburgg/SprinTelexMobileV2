import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

const LottieEffect = ({ visible, style }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (visible) {
      animationRef.current.play();
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.lottieEffectContainer, style]}>
      <LottieView
        ref={animationRef}
        source={require('../assets/Lottie/readconfetti.json')}
        loop={false}
        autoPlay={false}
        style={styles.lottieAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lottieEffectContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
});

export default LottieEffect;
