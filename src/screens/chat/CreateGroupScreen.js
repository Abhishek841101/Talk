import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreateGroupScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { members } = route.params; // selected user objects or IDs

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupImage, setGroupImage] = useState(null);

  // ✅ Handle instant group creation
  const createGroup = () => {
    if (!title.trim()) {
      alert("Please enter a group name");
      return;
    }

    // Simulate API/DB save
    const newGroup = {
      title,
      description,
      members,
      groupImage,
    };
    console.log("Group Created:", newGroup);

    // ✅ Auto-navigate back to ChatListScreen after creation
    navigation.navigate("ChatListScreen");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Group Image */}
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={() => alert("TODO: Pick Image")}
      >
        {groupImage ? (
          <Image source={{ uri: groupImage }} style={styles.groupImage} />
        ) : (
          <Ionicons name="camera" size={40} color="#666" />
        )}
      </TouchableOpacity>
      <Text style={styles.imageLabel}>Add Group Icon</Text>

      {/* Group Title */}
      <Text style={styles.label}>Group Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter group name"
      />

      {/* Group Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter group description"
        multiline
      />

      {/* Members Preview */}
      <Text style={styles.label}>Members ({members?.length || 0})</Text>
      <FlatList
        data={members}
        keyExtractor={(item, index) => item._id || index.toString()}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.memberChip}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
            ) : (
              <Ionicons name="person-circle" size={32} color="#aaa" />
            )}
            <Text style={styles.memberName} numberOfLines={1}>
              {item.username || "User"}
            </Text>
          </View>
        )}
      />

      {/* Create Button */}
      <TouchableOpacity style={styles.createBtn} onPress={createGroup}>
        <Text style={{ color: "#fff", fontSize: 16 }}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "bold" },

  imagePicker: {
    alignSelf: "center",
    marginTop: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  groupImage: { width: "100%", height: "100%" },
  imageLabel: { textAlign: "center", marginTop: 6, color: "#555" },

  label: { fontSize: 14, color: "#555", marginTop: 16, marginLeft: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 16,
    marginHorizontal: 16,
  },

  memberChip: {
    alignItems: "center",
    marginRight: 12,
    marginTop: 10,
    marginLeft: 10,
  },
  memberAvatar: { width: 40, height: 40, borderRadius: 20 },
  memberName: { fontSize: 12, marginTop: 4, maxWidth: 50, textAlign: "center" },

  createBtn: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: "blue",
    padding: 14,
    alignItems: "center",
    borderRadius: 10,
  },
});
