import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../features/chat/chatSlice";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function UserListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { allUsers, authUserId } = useSelector((state) => state.chat);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Custom back button always goes to chat list
  const goBackToChatList = () => {
    navigation.navigate("ChatListScreen");
  };

  const toggleSelect = (user) => {
    setSelectedUsers((prev) =>
      prev.some(u => u._id === user._id) ? prev.filter(u => u._id !== user._id) : [...prev, user]
    );
  };

  const startChat = (user) => {
    navigation.navigate("ChatScreen", {
      friendId: user._id,
      friendName: user.username,
      friendAvatar: user.avatar || null,
    });
  };

  const goToGroup = () => {
    navigation.navigate("CreateGroupScreen", { members: selectedUsers });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Custom Back */}
      <TouchableOpacity style={styles.customBack} onPress={goBackToChatList}>
        <Ionicons name="arrow-back" size={22} color="black" />
        <Text style={{ fontSize: 16, marginLeft: 6 }}>Back to Chats</Text>
      </TouchableOpacity>

      <FlatList
        data={allUsers.filter((u) => u._id !== authUserId)}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isSelected = selectedUsers.some(u => u._id === item._id);
          return (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => (selectedUsers.length > 0 ? toggleSelect(item) : startChat(item))}
              onLongPress={() => toggleSelect(item)}
            >
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: "#ddd" }]}>
                  <Ionicons name="person" size={20} color="#666" />
                </View>
              )}
              <Text style={styles.username}>{item.username}</Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={20} color="green" style={{ marginLeft: "auto" }} />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {selectedUsers.length > 1 && (
        <TouchableOpacity style={styles.groupButton} onPress={goToGroup}>
          <Text style={{ color: "#fff", fontSize: 16 }}>Create Group ({selectedUsers.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  customBack: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, justifyContent: "center", alignItems: "center" },
  username: { fontSize: 16 },
  groupButton: {
    backgroundColor: "blue",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
    borderRadius: 10,
  },
});
