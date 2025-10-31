

// import React, { useState } from "react";
// import { View, Button, Alert, Platform } from "react-native";
// import { launchImageLibrary, Asset } from "react-native-image-picker";
// import { useDispatch } from "react-redux";
// import { uploadReelThunk, addOne } from "../../features/reels/reelsSlice";
// import { AppDispatch } from "../../app/store";

// export default function UploadReelScreen() {
//   const dispatch = useDispatch<AppDispatch>();
//   const [uploading, setUploading] = useState(false);

//   const pickVideo = async () => {
//     const result = await launchImageLibrary({ mediaType: "video", selectionLimit: 1 });
//     if (!result.assets || result.assets.length === 0) return;

//     const video: Asset = result.assets[0];
//     if (!video.uri) return;

//     setUploading(true);

//     const username = "Anonymous"; 
//     const res = await dispatch(
//       uploadReelThunk({
//         videoUri: Platform.OS === "ios" ? video.uri.replace("file://", "") : video.uri,
//         username,
//       })
//     );

//     setUploading(false);

//     if (res.payload?.reel?._id) {
//       // ✅ Immediately update feed
//       dispatch(addOne(res.payload.reel));
//       Alert.alert("error", "Upload failed");
//     } else {
//       Alert.alert("Success", "Reel uploaded!");// changed to success to test
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
//       <Button title={uploading ? "Uploading..." : "Upload Reel"} onPress={pickVideo} disabled={uploading} />
//     </View>
//   );
// }



import React, { useState } from "react";
import { View, Button, Alert, Platform } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadReelThunk, addOne } from "../../features/reels/reelsSlice";
import { AppDispatch, RootState } from "../../app/store";

export default function UploadReelScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [uploading, setUploading] = useState(false);

  // ✅ Get username
  const user = useSelector((state: RootState) => state.auth?.user);
  const username = user?.username || user?.name || "Anonymous";

  const pickVideo = async () => {
    try {
      console.log("📌 Opening gallery...");

      const result = await launchImageLibrary({
        mediaType: "video",
        selectionLimit: 1,
      });

      console.log("📄 Picker result:", result);

      if (!result.assets?.length) {
        console.log("❌ No video selected");
        return;
      }

      const asset = result.assets[0];
      if (!asset?.uri) {
        console.log("❌ No URI found");
        return;
      }

      let videoUri = asset.uri;

      // ✅ iOS fix
      if (Platform.OS === "ios") {
        videoUri = videoUri.replace("file://", "");
      }

      console.log("🎬 Final URI:", videoUri);

      setUploading(true);

      // ✅ dispatch upload
      const response = await dispatch(
        uploadReelThunk({
          videoUri,
          username,
        })
      );

      console.log("✅ upload response:", response);

      setUploading(false);

      const reelFromBackend =
        response?.payload?.reel || response?.payload?.data || response?.payload;

      if (reelFromBackend?._id) {
        dispatch(addOne(reelFromBackend));

        Alert.alert("✅ Success", "Reel uploaded successfully!");
        return;
      }

      Alert.alert("❌ Upload Failed", "Could not upload reel.");
    } catch (err) {
      console.log("❌ Exception:", err);
      setUploading(false);
      Alert.alert("⚠ Error", "Something went wrong!");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Button
        title={uploading ? "Uploading..." : "Upload Reel"}
        onPress={pickVideo}
        disabled={uploading}
      />
    </View>
  );
}
