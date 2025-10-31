// ✅ src/screens/posts/PostCreateScreen.js
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
  PermissionsAndroid,
} from 'react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPost, setUploadProgress } from '../../features/posts/postsSlice';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

// =======================================================
// ✅ Ask Android Permission
// =======================================================
const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

// =======================================================
// ✅ Component
// =======================================================
export default function PostCreateScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // =======================================================
  // ✅ Pick From Gallery
  // =======================================================
  const pickMedia = async () => {
    const granted = await requestStoragePermission();
    if (!granted) {
      return Alert.alert("Permission required", "Storage access needed");
    }

    launchImageLibrary(
      {
        mediaType: 'mixed',
        quality: 0.8,
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          console.log("Picker Error:", response.errorMessage);
          return Alert.alert("Error", response.errorMessage);
        }

        const asset = response?.assets?.[0];
        if (!asset) return;

        setMedia({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName ?? `media_${Date.now()}`,
        });
      }
    );
  };

  // =======================================================
  // ✅ Capture From Camera
  // =======================================================
  const takeMedia = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      return Alert.alert("Permission required", "Camera access needed");
    }

    launchCamera(
      {
        mediaType: 'mixed',
        quality: 0.8,
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          console.log("Camera Error:", response.errorMessage);
          return Alert.alert("Error", response.errorMessage);
        }

        const asset = response?.assets?.[0];
        if (!asset) return;

        setMedia({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName ?? `media_${Date.now()}`,
        });
      }
    );
  };

  const removeMedia = () => setMedia(null);

  const resetForm = () => {
    setCaption('');
    setMedia(null);
  };

  // =======================================================
  // ✅ Upload Handler
  // =======================================================
  const handleUpload = async () => {
    if (!caption.trim() && !media) {
      return Alert.alert("Error", "Please add text or media");
    }

    setUploading(true);
    dispatch(setUploadProgress(0));

    try {
      const data = {
        caption: caption.trim(),
        media,
      };

      await dispatch(uploadPost(data)).unwrap();

      Alert.alert("Success", "Post uploaded!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            navigation.navigate("HomeTab", { screen: "HomeScreen" });
          },
        },
      ]);
    } catch (err) {
      console.log(err);
      Alert.alert("Failed", err?.message || "Something went wrong");
    } finally {
      setUploading(false);
      dispatch(setUploadProgress(0));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color="#000" />
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

      <ScrollView contentContainerStyle={styles.content}>
        {/* Media Preview */}
        {media && (
          <View style={styles.previewWrapper}>
            {media.type?.startsWith("image") ? (
              <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
            ) : (
              <Video
                controls
                resizeMode="cover"
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
              />
            )}
            <TouchableOpacity
              onPress={removeMedia}
              style={styles.removeMediaButton}
            >
              <Ionicons name="close-circle" size={26} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Caption */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Write something..."
            placeholderTextColor="#888"
            multiline
            style={styles.textInput}
          />
        </View>

        {/* Buttons */}
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
            <Text style={styles.uploadingText}>Posting…</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: Platform.OS === "ios" ? 45 : 20,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:30,
  },
  shareButton: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1DA1F2",
  },
  shareButtonDisabled: { color: "#ccc" },
  content: { padding: 16 },
  inputWrapper: { marginBottom: 10 },
  textInput: { fontSize: 16, minHeight: 80, color: "#000" },

  previewWrapper: { position: "relative", marginBottom: 15 },
  mediaPreview: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  removeMediaButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  mediaButtons: {
    flexDirection: "row",
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: "#1DA1F2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  uploadingContainer: { marginTop: 20, alignItems: "center" },
  uploadingText: { marginTop: 8, fontSize: 15 },
});
