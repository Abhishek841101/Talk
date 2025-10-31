import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from "react-native";
import Video from "react-native-video";

export default function LiveDetailScreen({ route }) {
  const { live } = route.params;
  const playerRef = useRef(null);
  const [comments, setComments] = useState([
    { id: "1", user: "Rohit", text: "Awesome session 🔥" },
    { id: "2", user: "Priya", text: "Love this topic ❤️" },
  ]);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, { id: Date.now().toString(), user: "You", text: newComment }]);
    setNewComment("");
  };

  return (
    <View style={styles.container}>
      <Video
        ref={playerRef}
        source={{ uri: live.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        repeat
        controls
      />

      <Text style={styles.title}>{live.title}</Text>
      <Text style={styles.host}>Hosted by {live.host}</Text>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.comment}>
            <Text style={styles.username}>{item.user}: </Text>
            {item.text}
          </Text>
        )}
        style={styles.commentList}
      />

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Type a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={addComment} style={styles.sendBtn}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  video: { width: "100%", height: 250 },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold", margin: 10 },
  host: { color: "#ccc", fontSize: 14, marginLeft: 10 },
  commentList: { flex: 1, backgroundColor: "#111", padding: 10 },
  comment: { color: "#eee", marginBottom: 6 },
  username: { fontWeight: "bold", color: "#0af" },
  inputBox: {
    flexDirection: "row",
    backgroundColor: "#111",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#222",
  },
  input: { flex: 1, color: "#fff", backgroundColor: "#222", borderRadius: 8, paddingHorizontal: 10 },
  sendBtn: { marginLeft: 10, backgroundColor: "#007AFF", borderRadius: 8, padding: 10 },
  sendText: { color: "#fff", fontWeight: "bold" },
});
