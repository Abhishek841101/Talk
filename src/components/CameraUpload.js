import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function CameraUpload() {
  const [photo, setPhoto] = useState(null);

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      const asset = response.assets[0];
      setPhoto(asset);
      uploadImage(asset);
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      const asset = response.assets[0];
      setPhoto(asset);
      uploadImage(asset);
    });
  };

  const uploadImage = async (asset) => {
    const data = new FormData();
    data.append('file', {
      uri: asset.uri,
      type: asset.type,
      name: asset.fileName,
    });

    try {
      const res = await fetch('http://10.0.2.2:3000/upload', {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const json = await res.json();
      Alert.alert('Uploaded', json.message);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="📸 Open Camera" onPress={openCamera} />
      <View style={{ marginTop: 10 }} />
      <Button title="🖼 Open Gallery" onPress={openGallery} />
      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}
    </View>
  );
}