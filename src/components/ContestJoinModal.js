
// import React, { useState } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { useDispatch } from "react-redux";
// import { joinContestAPI } from "../features/Contests/ContestsSlice";

// export default function ContestJoinModal({ visible, onClose, contest, onJoined }) {
//   const dispatch = useDispatch();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [media, setMedia] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Pick image or video
//   const pickMedia = async () => {
//     try {
//       let result;
//       if (contest?.type === "video") {
//         result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//           allowsEditing: true,
//           quality: 1,
//         });
//       } else {
//         result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           allowsEditing: true,
//           quality: 1,
//         });
//       }

//       if (!result.canceled) {
//         setMedia(result.assets[0].uri);
//       }
//     } catch (err) {
//       Alert.alert("Error", "Failed to pick media");
//     }
//   };

//   // Submit join
//   const handleSubmit = async () => {
//     if (!contest?._id) {
//       Alert.alert("Error", "Contest ID not found");
//       return;
//     }

//     if (!title.trim() || !description.trim() || !media) {
//       Alert.alert("Error", "Please fill all fields and select media");
//       return;
//     }

//     setLoading(true);

//     try {
//       const fileName = media.split("/").pop();
//       const fileType = contest?.type === "video" ? "video/mp4" : "image/jpeg";

//       const formData = new FormData();
//       formData.append("contestId", contest._id);
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim())));
//       formData.append("media", { uri: media, name: fileName, type: fileType });

//       const res = await dispatch(joinContestAPI({ contestId: contest._id, formData })).unwrap();

//       Alert.alert("Success", "Joined successfully!", [
//         {
//           text: "OK",
//           onPress: () => {
//             onJoined && onJoined();
//             onClose && onClose();
//           },
//         },
//       ]);
//     } catch (err) {
//       const msg = err?.message || err?.response?.data?.message || "Failed to join contest";

//       if (msg.includes("Already joined")) {
//         Alert.alert("Notice", "You have already joined this contest.", [
//           {
//             text: "OK",
//             onPress: () => onClose && onClose(), // Auto-close modal
//           },
//         ]);
//       } else {
//         Alert.alert("Error", msg);
//       }
//     } finally {
//       setLoading(false);
//       setTitle("");
//       setDescription("");
//       setTags("");
//       setMedia(null);
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <Text style={styles.header}>Join Contest</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Title"
//             value={title}
//             onChangeText={setTitle}
//           />
//           <TextInput
//             style={[styles.input, { height: 80 }]}
//             placeholder="Description"
//             value={description}
//             onChangeText={setDescription}
//             multiline
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Tags (comma separated)"
//             value={tags}
//             onChangeText={setTags}
//           />

//           <TouchableOpacity style={styles.mediaBtn} onPress={pickMedia}>
//             <Text style={{ color: "#fff" }}>
//               {media ? "Media Selected" : contest?.type === "video" ? "Pick Video" : "Pick Photo"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Join</Text>}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
//   container: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 12, maxHeight: "85%" },
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#FF6B00" },
//   input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 8 },
//   mediaBtn: { backgroundColor: "#FF6B00", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 6 },
//   submitBtn: { backgroundColor: "#00A8FF", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 6 },
//   submitText: { color: "#fff", fontWeight: "bold" },
//   cancelBtn: { backgroundColor: "#ccc", padding: 12, borderRadius: 8, alignItems: "center" },
//   cancelText: { color: "#333", fontWeight: "bold" },
// });































