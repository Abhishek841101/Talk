// src/components/Stories.js

import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { addStory } from '../features/stories/storiesSlice'; // Make sure this exists

export default function Stories({ navigation }) {
  const dispatch = useDispatch();

  // Safe access to Redux state
  const stories = useSelector((state) => state.stories?.items || []);
  const auth = useSelector((state) => state.auth) || {};
  const { username = 'User', avatar = '' } = auth;

  // ---------------- Add Story ----------------
  const handleAddStory = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.didCancel) return;

      if (result.assets?.length) {
        const imageUri = result.assets[0].uri;

        const newStory = {
          id: Date.now().toString(),
          username,
          avatar,
          storyImage: imageUri,
        };

        dispatch(addStory(newStory));
      }
    } catch (error) {
      console.log('Error selecting image:', error);
      Alert.alert('Error', 'Could not select image. Try again.');
    }
  };

  // ---------------- Render Single Story ----------------
  const renderStory = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('StoryViewer', { story: item })}
    >
      <View style={styles.storyItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username} numberOfLines={1}>
          {item.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ id: 'your_story', username: 'Your Story', avatar }, ...stories]}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.id === 'your_story' ? (
            <TouchableOpacity onPress={handleAddStory}>
              <View style={styles.storyItem}>
                <Image
                  source={{ uri: avatar }}
                  style={[styles.avatar, styles.addBorder]}
                />
                <Text style={styles.username}>Your Story</Text>
              </View>
            </TouchableOpacity>
          ) : (
            renderStory({ item })
          )
        }
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>No stories yet</Text>
          </View>
        }
      />
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { paddingVertical: 10, paddingLeft: 10 },
  storyItem: { alignItems: 'center', marginRight: 12 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#c13584',
  },
  addBorder: {
    borderColor: '#0095f6',
  },
  username: { marginTop: 4, fontSize: 12, maxWidth: 70, textAlign: 'center' },
});
