// ✅ src/components/CameraAudioCapture.js
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { PermissionsAndroid, Platform } from "react-native";

const audioRecorderPlayer = new AudioRecorderPlayer();

async function requestAudioPermission() {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

const CameraAudioCapture = ({ onCapture }) => {
  const [recording, setRecording] = useState(false);

  // ✅ Open Camera
  const handleCamera = async () => {
    const result = await launchCamera({
      mediaType: "photo",
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.[0]) {
      onCapture({ image: result.assets[0].uri });
    }
  };

  // ✅ Open Gallery
  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: "mixed",
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.didCancel && result.assets?.[0]) {
      onCapture({ image: result.assets[0].uri });
    }
  };

  // ✅ Start Audio Record
  const startRecording = async () => {
    const allowed = await requestAudioPermission();
    if (!allowed) return;
    await audioRecorderPlayer.startRecorder();
    setRecording(true);
  };

  // ✅ Stop Audio Record
  const stopRecording = async () => {
    const path = await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    onCapture({ audio: path });
  };

  return (
    <View style={{ flexDirection: "row", gap: 15 }}>
      {/* ✅ Camera */}
      <TouchableOpacity onPress={handleCamera}>
        <Ionicons name="camera" size={28} color="#000" />
      </TouchableOpacity>

      {/* ✅ Gallery */}
      <TouchableOpacity onPress={handleGallery}>
        <Ionicons name="image" size={28} color="#000" />
      </TouchableOpacity>

      {/* ✅ Audio */}
      <TouchableOpacity
        onPress={() => {
          if (!recording) startRecording();
          else stopRecording();
        }}
      >
        <Ionicons
          name={recording ? "mic-circle" : "mic-outline"}
          size={28}
          color={recording ? "red" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CameraAudioCapture;
 