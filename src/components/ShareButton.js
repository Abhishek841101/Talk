



import React, { useState } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Share,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { sendShare, addSentShare } from "../features/share/shareSlice";
import { getSocket } from "../lib/socket";

const ShareButton = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const senderId = useSelector(state => state.auth?.user?._id);
  const dispatch = useDispatch();

  const handleShare = async () => {
    if (!senderId) return Alert.alert("Error", "User not logged in!");

    try {
      setLoading(true);

      const postId = item?._id ?? item?.id ?? "";
      const caption = item?.caption ?? "";
      const media = item?.media ?? "";
      const url = `https://yourapp.com/posts/${postId}`;

      // 1️⃣ Open native share dialog (WhatsApp, SMS, Instagram…)
      await Share.share({
        title: "Share Post",
        message: `${caption}\n\n${url}`,
        url: media ? `https://yourserver.com${media}` : undefined,
      });

      console.log("[ShareButton] Shared via native dialog.");

      // 2️⃣ Optional: save to backend (no receiverId)
      const result = await dispatch(
        sendShare({ senderId, postId, message: caption }) // receiverId removed
      ).unwrap();

      dispatch(addSentShare(result));

      // 3️⃣ Optional socket
      const socket = getSocket();
      if (socket) socket.emit("newShare", { ...result });

      Alert.alert("✅ Shared successfully!", "Share recorded in app.");
    } catch (err) {
      console.error("[ShareButton] Error:", err);
      Alert.alert("Error", err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleShare}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#8b98a5" />
      ) : (
        <Ionicons name="paper-plane-outline" size={22} color="#8b98a5" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ShareButton;
