// components/ShareModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { getAllUsersForShare, sharePost } from "../lib/api";
import { useSelector } from "react-redux";

export default function ShareModal({ visible, onClose, postId }) {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const auth = useSelector((s) => s.auth); // adapt to your auth slice shape
  const token = auth?.token;
  const currentUser = auth?.user; // { _id, username, ... }

  useEffect(() => {
    if (visible) fetchUsers();
    else {
      setSearch("");
      setFiltered([]);
      setUsers([]);
      setMessage("");
    }
  }, [visible]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await getAllUsersForShare({ token });
      // depending on API response: if list is in res.users or res.data adjust accordingly
      const list = Array.isArray(res) ? res : res.users || res.data || [];
      // remove current user from list
      const filteredList = list.filter((u) => u._id !== currentUser?._id);
      setUsers(filteredList);
      setFiltered(filteredList);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("fetchUsers err:", err);
      Alert.alert("Error", "Unable to fetch users");
    }
  }

  function onSearch(text) {
    setSearch(text);
    const q = text.trim().toLowerCase();
    if (!q) return setFiltered(users);
    setFiltered(
      users.filter(
        (u) =>
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.name && u.name.toLowerCase().includes(q))
      )
    );
  }

  async function handleSend(receiverId) {
    if (!currentUser) {
      return Alert.alert("Not logged in");
    }
    try {
      setLoading(true);
      const payload = {
        token,
        senderId: currentUser._id,
        receiverId,
        postId,
        message,
      };
      const res = await sharePost(payload);
      setLoading(false);
      if (res && res.success) {
        Alert.alert("Shared", "Post shared successfully");
        onClose();
      } else {
        Alert.alert("Error", res?.message || "Could not share post");
      }
    } catch (err) {
      setLoading(false);
      console.error("share err:", err);
      Alert.alert("Error", err.response?.message || err.message || "Server error");
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => handleSend(item._id)}>
      <Image
        source={item.profilePic ? { uri: item.profilePic } : require("../assets/profile.jpg")}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{item.username || item.name || "Unknown"}</Text>
        {item.bio ? <Text numberOfLines={1} style={styles.bio}>{item.bio}</Text> : null}
      </View>
      <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend(item._id)}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Share Post</Text>

          <TextInput
            placeholder="Add a message (optional)"
            value={message}
            onChangeText={setMessage}
            style={styles.messageInput}
          />

          <TextInput
            placeholder="Search friends..."
            value={search}
            onChangeText={onSearch}
            style={styles.searchInput}
          />

          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(i) => i._id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
              style={{ marginTop: 12 }}
            />
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    maxHeight: "80%",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  messageInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  username: { fontSize: 15, fontWeight: "600" },
  bio: { color: "#666", fontSize: 12 },
  sendBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sendText: { color: "#fff", fontWeight: "600" },
  closeBtn: {
    marginTop: 8,
    alignSelf: "center",
    padding: 8,
  },
  closeText: { color: "#007bff", fontSize: 16 },
});
