import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPost, setUploadProgress } from '../../features/posts/postsSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function UploadScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // -------------------- Image Picker --------------------
  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
        return Alert.alert('Error', response.errorMessage);
      }
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const takePhoto = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('Camera Error:', response.errorMessage);
        return Alert.alert('Error', response.errorMessage);
      }
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const removeImage = () => setImage(null);
  const resetForm = () => {
    setCaption('');
    setImage(null);
  };

  // -------------------- Upload Post --------------------
  const handleUpload = async () => {
    if (!caption.trim() && !image)
      return Alert.alert('Error', 'Please add text or select an image');
    setUploading(true);
    dispatch(setUploadProgress(0));
    try {
      await dispatch(uploadPost({ image, caption: caption.trim() })).unwrap();
      Alert.alert('Success', 'Your post has been uploaded!', [
  { text: 'OK', onPress: () => { resetForm(); navigation.navigate('HomeTab', { screen: 'HomeScreen' }); } },
]);

    } catch (err) {
      console.error(err);
      Alert.alert('Upload Failed', err || 'Something went wrong');
    } finally {
      setUploading(false);
      dispatch(setUploadProgress(0));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUpload}
          disabled={(!caption.trim() && !image) || uploading}
        >
          <Text
            style={[
              styles.shareButton,
              (!caption.trim() && !image) && styles.shareButtonDisabled,
            ]}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Image preview */}
        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <Ionicons name="close-circle" size={28} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Text input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="What's happening?"
            placeholderTextColor="#999"
            multiline
            value={caption}
            onChangeText={setCaption}
          />
        </View>

        {/* Image buttons */}
        <View style={styles.imageButtons}>
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            <Ionicons name="images-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color="#1DA1F2" />
            <Text style={styles.uploadingText}>Posting...</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  backButton: { padding: 5 },
  shareButton: { fontSize: 16, fontWeight: 'bold', color: '#1DA1F2' },
  shareButtonDisabled: { color: '#ccc' },
  content: { padding: 16 },
  inputWrapper: { borderBottomWidth: 0.5, borderColor: '#ddd', paddingBottom: 8 },
  textInput: { fontSize: 16, minHeight: 80, color: '#000' },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: { width: '100%', height: 250, borderRadius: 12 },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 2,
  },
  imageButtons: { flexDirection: 'row', gap: 10, marginTop: 12 },
  imageButton: {
    flex: 1,
    backgroundColor: '#1DA1F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  uploadingContainer: { marginTop: 20, alignItems: 'center' },
  uploadingText: { marginTop: 10, fontSize: 16, color: '#666' },
});

