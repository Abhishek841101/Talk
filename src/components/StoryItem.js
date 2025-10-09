// src/components/StoryItem.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StoryItem = ({ story }) => {

     const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('StoryViewer', { story });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: story.avatar }} style={styles.avatar} />
      <Text style={styles.username} numberOfLines={1}>
        {story.username}
      </Text>
    </TouchableOpacity>
  );
};

export default StoryItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#c13584', // Instagram gradient color
  },
  username: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
    maxWidth: 64,
    textAlign: 'center',
  },
});
