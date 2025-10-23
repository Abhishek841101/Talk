import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image } from 'react-native';

export default function MusicIcon() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/musical-notes.png' }}
      style={{
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 100,
        right: 15,
        transform: [{ rotate }],
      }}
    />
  );
}
