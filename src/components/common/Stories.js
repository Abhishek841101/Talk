import React from 'react';
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Sample dummy data for stories
const storiesData = [
  { id: '1', username: 'alice', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', username: 'bob', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', username: 'charlie', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', username: 'david', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', username: 'eve', avatar: 'https://i.pravatar.cc/150?img=5' },
];

export default function Stories() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {storiesData.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <Image source={{ uri: story.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{story.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  storyItem: {
    width: 70,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff8501',
  },
  username: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});
