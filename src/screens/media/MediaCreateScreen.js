// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { launchImageLibrary } from "react-native-image-picker";
// import Icon from "react-native-vector-icons/Ionicons";

// export default function MediaCreateScreen({ navigation }) {
//   const [video, setVideo] = useState(null);
//   const [title, setTitle] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);

//   // ✅ Auto open gallery on open screen
//   useEffect(() => {
//     pickVideo();
//   }, []);

//   // ✅ Select video
//   const pickVideo = async () => {
//     const result = await launchImageLibrary({
//       mediaType: "video",
//       includeExtra: true,
//     });

//     if (result?.assets?.length > 0) {
//       setVideo(result.assets[0]);
//       setThumbnail(result.assets[0].uri); // Thumbnail same from uri
//     }
//   };

//   const handleUpload = () => {
//     console.log("Uploading...");
//     // 🔥 Upload API call here
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.top}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.titleText}>Add details</Text>
//       </View>

//       <ScrollView style={{ flex: 1 }}>
        
//         {/* Thumbnail */}
//         <View style={styles.thumbnailBox}>
//           {thumbnail ? (
//             <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
//           ) : (
//             <View style={styles.thumbnailPlaceholder} />
//           )}

//           <TouchableOpacity
//             style={styles.editThumb}
//             onPress={pickVideo}
//           >
//             <Icon name="pencil" size={18} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* User Info */}
//         <View style={styles.userRow}>
//           <Image
//             source={{ uri: "https://i.pravatar.cc/150" }}
//             style={styles.avatar}
//           />
//           <View>
//             <Text style={styles.userName}>Your Name</Text>
//             <Text style={styles.userHandle}>@username</Text>
//           </View>
//         </View>

//         {/* Title */}
//         <TextInput
//           placeholder="Create a title..."
//           placeholderTextColor="#777"
//           value={title}
//           onChangeText={setTitle}
//           style={styles.input}
//         />

//         {/* Options */}
//         <View style={styles.optionRow}>
//           <Icon name="list-circle-outline" size={22} color="#fff" />
//           <Text style={styles.optionText}>Add description</Text>
//         </View>

//         <View style={styles.optionRow}>
//           <Icon name="globe" size={22} color="#fff" />
//           <Text style={styles.optionText}>Visibility • Public</Text>
//         </View>

//         <View style={styles.optionRow}>
//           <Icon name="people" size={22} color="#fff" />
//           <Text style={styles.optionText}>Select audience</Text>
//         </View>

//         <View style={styles.optionRow}>
//           <Icon name="location" size={22} color="#fff" />
//           <Text style={styles.optionText}>Location</Text>
//         </View>

//         {/* More... */}
//       </ScrollView>

//       {/* Upload Button */}
//       <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
//         <Text style={styles.uploadText}>Upload</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   top: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     gap: 15,
//   },
//   titleText: { color: "#fff", fontSize: 18, fontWeight: "600" },
//   thumbnailBox: { width: "100%", height: 220, backgroundColor: "#222" },
//   thumbnail: { width: "100%", height: "100%" },
//   thumbnailPlaceholder: { width: "100%", height: "100%" },
//   editThumb: {
//     position: "absolute",
//     bottom: 10,
//     left: 10,
//     backgroundColor: "#444",
//     padding: 8,
//     borderRadius: 20,
//   },
//   userRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     gap: 10,
//   },
//   avatar: { width: 45, height: 45, borderRadius: 50 },
//   userName: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   userHandle: { color: "#aaa", fontSize: 13 },
//   input: {
//     color: "#fff",
//     borderBottomWidth: 1,
//     borderColor: "#222",
//     padding: 15,
//     fontSize: 16,
//   },
//   optionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     gap: 20,
//     borderBottomWidth: 1,
//     borderColor: "#111",
//   },
//   optionText: { color: "#fff", fontSize: 16 },
//   uploadBtn: {
//     backgroundColor: "#fff",
//     paddingVertical: 14,
//     margin: 10,
//     borderRadius: 40,
//     alignItems: "center",
//   },
//   uploadText: {
//     color: "#000",
//     fontSize: 18,
//     fontWeight: "600",
//   },
// });





import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  launchImageLibrary,
} from "react-native-image-picker";

import Icon from "react-native-vector-icons/Ionicons";

import { useDispatch, useSelector } from "react-redux";
import { uploadMedia } from "../../features/media/mediaSlice";

export default function MediaCreateScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.media);
  const user = useSelector((state) => state.auth.user);

  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  // ✅ Auto open gallery to select video
  useEffect(() => {
    pickVideo();
  }, []);

  // ✅ PICK VIDEO
  const pickVideo = async () => {
    const result = await launchImageLibrary({
      mediaType: "video",
      includeBase64: false,
    });

    if (result?.assets?.length > 0) {
      const asset = result.assets[0];

      setVideo(asset);
      setThumbnail(asset.uri); // First thumbnail from video
    }
  };

  // ✅ PICK THUMBNAIL IMAGE
  const pickThumbnail = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (result?.assets?.length > 0) {
      const asset = result.assets[0];
      setThumbnail(asset.uri);
    }
  };

  // ✅ UPLOAD
  const handleUpload = async () => {
    if (!video) return Alert.alert("Please select a video first!");
    if (!title.trim()) return Alert.alert("Enter a title!");

    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    formData.append("media", {
      uri: video.uri,
      name: video.fileName || "video.mp4",
      type: video.type || "video/mp4",
    });

    // ✅ Send Thumbnail (if updated)
    if (thumbnail && thumbnail !== video.uri) {
      formData.append("thumbnail", {
        uri: thumbnail,
        name: "thumbnail.jpg",
        type: "image/jpeg",
      });
    }

    const res = await dispatch(uploadMedia(formData));

    if (res?.payload) {
      Alert.alert("Uploaded Successfully");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Upload Details</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* THUMBNAIL */}
        <View style={styles.thumbnailBox}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          ) : (
            <View style={styles.thumbnailPlaceholder} />
          )}

          <TouchableOpacity style={styles.editThumb} onPress={pickThumbnail}>
            <Icon name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* USER INFO */}
        <View style={styles.userRow}>
          <Image
            source={{ uri: user?.avatar || "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userHandle}>@{user?.username}</Text>
          </View>
        </View>

        {/* TITLE */}
        <TextInput
          placeholder="Title..."
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        {/* DESCRIPTION */}
        <TextInput
          placeholder="Add description..."
          placeholderTextColor="#777"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, { height: 90 }]}
        />

      </ScrollView>

      {/* Upload button */}
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.uploadText}>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  top: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 15,
  },
  titleText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  thumbnailBox: { width: "100%", height: 230, backgroundColor: "#222" },
  thumbnail: { width: "100%", height: "100%" },
  thumbnailPlaceholder: { width: "100%", height: "100%" },
  editThumb: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#444",
    padding: 8,
    borderRadius: 20,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  avatar: { width: 45, height: 45, borderRadius: 50 },
  userName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  userHandle: { color: "#aaa", fontSize: 13 },

  input: {
    color: "#fff",
    borderBottomWidth: 1,
    borderColor: "#222",
    padding: 15,
    fontSize: 16,
  },

  uploadBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    margin: 10,
    borderRadius: 40,
    alignItems: "center",
  },
  uploadText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
});
