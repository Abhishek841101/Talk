// src/components/YourStory.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const YourStory = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        <View style={styles.plusIcon}>
          <Ionicons name="add" size={16} color="#fff" />
        </View>
      </View>
      <Text style={styles.label}>Your Story</Text>
    </TouchableOpacity>
  );
};

export default YourStory;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0a84ff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 2,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
});
