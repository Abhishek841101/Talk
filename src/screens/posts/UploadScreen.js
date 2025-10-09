import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../features/posts/postsSlice';

export default function UploadScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // authSlice should return user
  // const userId = useSelector((state) => state.auth.user?.id);

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleUpload = () => {
    if (!image || !caption.trim()) return Alert.alert('Error', 'Add image and caption');
    dispatch(
      addPost({
        image,
        caption,
        username: user?.username || user?.email || 'Anonymous',
        likes: 0,
        // userId,
      })
    );
    setImage(null);
    setCaption('');
    Alert.alert('Uploaded', 'Post uploaded successfully!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
        {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>Select Image</Text>}
      </TouchableOpacity>
      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="Write caption..."
        style={styles.input}
      />
      <TouchableOpacity onPress={handleUpload} style={styles.uploadBtn}>
        <Text style={{ color: '#fff' }}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  imageBox: { height: 300, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  input: { marginTop: 10, borderWidth: 1, padding: 10 },
  uploadBtn: { backgroundColor: '#3897f0', marginTop: 20, padding: 15, alignItems: 'center' },
});
