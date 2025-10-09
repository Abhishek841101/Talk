import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { likeReelThunk } from "../../features/reels/reelsSlice";

export default function ReelActions({ id, username, likes }: { id: string; username: string; likes: number }) {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);

  const onLike = async () => {
    console.log("[Frontend] Like button pressed for:", id);
    setLiked((p) => !p);
    setLocalLikes((c) => (liked ? c - 1 : c + 1)); // instant UI
    const res = await dispatch(likeReelThunk(id));
    if (!res?.payload) {
      Alert.alert("Failed", "Could not like the reel.");
      // revert optimistic
      setLiked((p) => !p);
      setLocalLikes((c) => (liked ? c + 1 : c - 1));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>@{username}</Text>
      <TouchableOpacity style={styles.button} onPress={onLike}>
        <Text style={{ color: liked ? "red" : "white" }}>❤️ {localLikes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Comment", "Coming soon!")}>
        <Text style={{ color: "white" }}>💬 Comment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Share", "Coming soon!")}>
        <Text style={{ color: "white" }}>↗️ Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", right: 10, bottom: 50, alignItems: "center" },
  username: { color: "white", marginBottom: 10 },
  button: { marginBottom: 20 },
});
