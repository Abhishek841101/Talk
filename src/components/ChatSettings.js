// components/ChatSettings.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  setChatWallpaperLocal,
  setGroupWallpaperLocal,
} from "../features/chat/chatSlice";
import {
  setChatWallpaperSocket,
  setGroupWallpaperSocket,
} from "../lib/socket";
import { launchImageLibrary } from "react-native-image-picker"; // ✅ replaced expo-image-picker

// Default wallpaper color options
const defaultWallpapers = [
  { id: "default1", color: "#f2f2f2" },
  { id: "default2", color: "#ffe4e1" },
  { id: "default3", color: "#e0f7fa" },
  { id: "default4", color: "#e8f5e9" },
];

export default function ChatSettings({ visible, onClose, friendId, groupId }) {
  const dispatch = useDispatch();

  const [mute, setMute] = useState(false);
  const [disappear, setDisappear] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // ===== Wallpaper Picker =====
  const pickWallpaper = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("Image picker error:", response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          console.log("Wallpaper selected:", uri);
          if (friendId) {
            dispatch(setChatWallpaperLocal({ friendId, wallpaper: uri }));
            setChatWallpaperSocket({ friendId, wallpaper: uri });
          } else if (groupId) {
            dispatch(setGroupWallpaperLocal({ groupId, wallpaper: uri }));
            setGroupWallpaperSocket({ groupId, wallpaper: uri });
          }
        }
      }
    });
  };

  const selectDefaultWallpaper = (wallpaper) => {
    if (friendId) {
      dispatch(setChatWallpaperLocal({ friendId, wallpaper }));
      setChatWallpaperSocket({ friendId, wallpaper });
    } else if (groupId) {
      dispatch(setGroupWallpaperLocal({ groupId, wallpaper }));
      setGroupWallpaperSocket({ groupId, wallpaper });
    }
  };

  // ===== Disappearing messages timer =====
  const setDisappearTimer = (timer) => {
    setDisappear(timer !== "Off");
    console.log("Disappearing messages set:", timer);
    // TODO: emit socket event -> { friendId/groupId, timer }
    setShowTimerModal(false);
  };

  // ===== Mute notifications =====
  const setMuteTimer = (timer) => {
    setMute(true);
    console.log("Mute notifications set:", timer);
    // TODO: emit socket event -> { friendId/groupId, timer }
    setShowMuteModal(false);
  };

  // ===== Block / Report =====
  const handleBlockReport = (action) => {
    Keyboard.dismiss();
    Alert.alert(
      action,
      `Do you want to ${action.toLowerCase()} this user?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () =>
            console.log(`${action} confirmed for:`, friendId || groupId),
        },
      ]
    );
  };

  // ===== Clear Chat =====
  const handleClearChat = () => {
    Alert.alert(
      "Clear this chat?",
      "This will delete all messages and media from this chat on your device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => console.log("Chat cleared:", friendId || groupId),
        },
      ]
    );
  };

  // ===== Export Chat =====
  const handleExportChat = (includeMedia) => {
    console.log(
      "Export chat",
      includeMedia ? "with media" : "without media",
      friendId || groupId
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Chat Settings</Text>

          {/* Wallpaper / Theme */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => setShowThemeModal(true)}
          >
            <Text>Chat Wallpaper / Theme</Text>
          </TouchableOpacity>

          {/* Mute Notifications */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => setShowMuteModal(true)}
          >
            <Text>Mute Notifications</Text>
          </TouchableOpacity>

          {/* Disappearing Messages */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => setShowTimerModal(true)}
          >
            <Text>Disappearing Messages</Text>
          </TouchableOpacity>

          {/* Block & Report */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleBlockReport("Block")}
          >
            <Text style={{ color: "red" }}>Block</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleBlockReport("Report")}
          >
            <Text style={{ color: "orange" }}>Report</Text>
          </TouchableOpacity>

          {/* Clear / Export */}
          <TouchableOpacity style={styles.option} onPress={handleClearChat}>
            <Text>Clear Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleExportChat(false)}
          >
            <Text>Export Chat (Without Media)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleExportChat(true)}
          >
            <Text>Export Chat (Include Media)</Text>
          </TouchableOpacity>

          {/* Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* ===== Disappearing Timer Modal ===== */}
        <Modal visible={showTimerModal} transparent animationType="fade">
          <View style={styles.subModal}>
            {["Off", "24h", "7 days", "90 days"].map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.subOption}
                onPress={() => setDisappearTimer(t)}
              >
                <Text>{t}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.subOption}
              onPress={() => setShowTimerModal(false)}
            >
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* ===== Mute Timer Modal ===== */}
        <Modal visible={showMuteModal} transparent animationType="fade">
          <View style={styles.subModal}>
            {["8 hours", "1 week", "Always"].map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.subOption}
                onPress={() => setMuteTimer(t)}
              >
                <Text>{t}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.subOption}
              onPress={() => setShowMuteModal(false)}
            >
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* ===== Wallpaper / Theme Modal ===== */}
        <Modal visible={showThemeModal} transparent animationType="fade">
          <View style={styles.subModal}>
            <TouchableOpacity style={styles.subOption} onPress={pickWallpaper}>
              <Text>Choose from Gallery</Text>
            </TouchableOpacity>
            <FlatList
              horizontal
              data={defaultWallpapers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.wallpaperPreview,
                    { backgroundColor: item.color },
                  ]}
                  onPress={() => selectDefaultWallpaper(item.color)}
                />
              )}
            />
            <TouchableOpacity
              style={styles.subOption}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  closeBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  subModal: {
    margin: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  subOption: {
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  wallpaperPreview: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
