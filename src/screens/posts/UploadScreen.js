
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
import Video from 'react-native-video';

export default function UploadScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [media, setMedia] = useState(null); // { uri, type }
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // -------------------- Media Picker --------------------
  const pickMedia = async () => {
    const options = {
      mediaType: 'mixed', // supports image + video
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
        const asset = response.assets[0];
        setMedia({ uri: asset.uri, type: asset.type, name: asset.fileName });
      }
    });
  };

  const takeMedia = async () => {
    const options = {
      mediaType: 'mixed',
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
        const asset = response.assets[0];
        setMedia({ uri: asset.uri, type: asset.type, name: asset.fileName });
      }
    });
  };

  const removeMedia = () => setMedia(null);
  const resetForm = () => {
    setCaption('');
    setMedia(null);
  };

  // -------------------- Upload Post --------------------
  const handleUpload = async () => {
    if (!caption.trim() && !media)
      return Alert.alert('Error', 'Please add text or select an image/video');

    setUploading(true);
    dispatch(setUploadProgress(0));

    try {
      await dispatch(uploadPost({ media, caption: caption.trim() })).unwrap();
      Alert.alert('Success', 'Your post has been uploaded!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            navigation.navigate('HomeTab', { screen: 'HomeScreen' });
          },
        },
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
          disabled={(!caption.trim() && !media) || uploading}
        >
          <Text
            style={[
              styles.shareButton,
              (!caption.trim() && !media) && styles.shareButtonDisabled,
            ]}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Media preview */}
        {media && (
          <View style={styles.mediaPreviewContainer}>
            {media.type.startsWith('image') ? (
              <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
            ) : (
              <Video
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
                controls
                resizeMode="cover"
              />
            )}
            <TouchableOpacity style={styles.removeMediaButton} onPress={removeMedia}>
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

        {/* Media buttons */}
        <View style={styles.mediaButtons}>
          <TouchableOpacity onPress={pickMedia} style={styles.mediaButton}>
            <Ionicons name="images-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takeMedia} style={styles.mediaButton}>
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
  mediaPreviewContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaPreview: { width: '100%', height: 250, borderRadius: 12, backgroundColor: '#000' },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 2,
  },
  mediaButtons: { flexDirection: 'row', gap: 10, marginTop: 12 },
  mediaButton: {
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
