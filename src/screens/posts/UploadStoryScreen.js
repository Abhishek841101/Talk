// src/screens/UploadStoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { useDispatch, useSelector } from 'react-redux';
import { addStory } from '../../features/stories/storiesSlice';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

export default function UploadStoryScreen() {
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    pickImage(); // auto-open camera/gallery
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow media access to upload stories.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      navigation.goBack(); // cancel if no image selected
    }
  };

  const handleUpload = () => {
    if (!image) {
      Alert.alert('No image selected');
      return;
    }

    dispatch(
      addStory({
        id: uuidv4(),
        username: auth.username || 'You',
        avatar: auth.avatar || 'https://i.pravatar.cc/150?img=68',
        storyImage: image,
      })
    );

    navigation.replace('HomeMain'); // Go back to home feed
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <Button title="Post Story" onPress={handleUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  preview: {
    width: '100%',
    height: 500,
    marginBottom: 20,
    borderRadius: 10,
  },
});
