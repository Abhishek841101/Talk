

import React, { useState } from "react";
import { View, Button, Alert, Platform } from "react-native";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { useDispatch } from "react-redux";
import { uploadReelThunk, addOne } from "../../features/reels/reelsSlice";
import { AppDispatch } from "../../app/store";

export default function UploadReelScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    const result = await launchImageLibrary({ mediaType: "video", selectionLimit: 1 });
    if (!result.assets || result.assets.length === 0) return;

    const video: Asset = result.assets[0];
    if (!video.uri) return;

    setUploading(true);

    const username = "Anonymous"; 
    const res = await dispatch(
      uploadReelThunk({
        videoUri: Platform.OS === "ios" ? video.uri.replace("file://", "") : video.uri,
        username,
      })
    );

    setUploading(false);

    if (res.payload?.reel?._id) {
      // ✅ Immediately update feed
      dispatch(addOne(res.payload.reel));
      Alert.alert("error", "Upload failed");
    } else {
      Alert.alert("Success", "Reel uploaded!");// changed to success to test
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
      <Button title={uploading ? "Uploading..." : "Upload Reel"} onPress={pickVideo} disabled={uploading} />
    </View>
  );
}




