import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  PanResponder,
  AppState,
  ActivityIndicator,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessageOptimistic,
  newMessageReceived,
  sendMessageAcknowledged,
  markMessagesSeenLocal,
  updateUserStatus,
} from "../../features/chat/chatSlice";
import { initSocket, getSocket } from "../../lib/socket";
import { useFocusEffect } from "@react-navigation/native";
import ChatSettings from "../../components/ChatSettings";

// ---------------- Reply Preview ----------------
const ReplyPreview = ({ reply, onCancel }) => {
  if (!reply) return null;
  return (
    <View style={styles.replyPreview}>
      <View style={{ flex: 1 }}>
        <Text style={styles.replyLabel}>Replying to {reply.senderName}</Text>
        <Text style={styles.replyText} numberOfLines={1}>
          {reply.content || "📷 Photo"}
        </Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
        <Ionicons name="close" size={20} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

export default function ChatScreen({ route, navigation }) {
  const { friendId, friendName, friendAvatar } = route.params;
  const dispatch = useDispatch();
  const { messages = {}, allUsers } = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user) || {};

  const flatListRef = useRef();
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [typing, setTyping] = useState(false);
  const [reply, setReply] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [editMessageData, setEditMessageData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const friendMessages = messages?.[friendId] || [];
  const friendStatus = allUsers?.find((u) => String(u._id) === String(friendId));
  const isFriendOnline = friendStatus?.isOnline;

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  // ---------------- Fetch messages ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (friendId) await dispatch(fetchMessages(friendId)).unwrap();
      } catch (err) {
        console.log("Fetch messages error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [friendId]);

  // ---------------- AppState reconnection ----------------
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        const socket = await initSocket();
        if (!socket.connected) socket.connect();
      }
    });
    return () => sub.remove();
  }, []);

  // ---------------- Socket setup ----------------
  useEffect(() => {
    let socket;
    const setup = async () => {
      socket = await initSocket();
      if (!socket) return;
      if (!socket.connected) socket.connect();

      socket.on("new-message", (data) => {
        const { message, tempId } = data;
        const senderId = String(message.sender._id || message.sender);
        const receiverId = String(message.receiver);
        const isMe = senderId === String(currentUser._id);
        const relevant =
          senderId === String(friendId) || receiverId === String(friendId);
        if (!relevant) return;

        if (tempId) dispatch(newMessageReceived({ friendId, message, tempId }));
        else dispatch(newMessageReceived({ friendId, message }));

        if (!isMe && isFocused) {
          const unreadMsgIds = [message._id];
          dispatch(
            markMessagesSeenLocal({
              friendId,
              messageIds: unreadMsgIds,
              userId: currentUser._id,
            })
          );
          socket.emit("mark-seen", {
            friendId,
            messageIds: unreadMsgIds,
            userId: currentUser._id,
          });
        }
      });

      socket.on("message-sent", (ack) => {
        const { tempId, realId } = ack;
        dispatch(sendMessageAcknowledged({ friendId, tempId, realId }));
      });

      socket.on("edit-message", ({ message }) => {
        dispatch(
          newMessageReceived({
            friendId,
            message,
            replaceTempId: message._id,
          })
        );
      });

      socket.on("delete-message", ({ messageId }) => {
        dispatch(
          newMessageReceived({
            friendId,
            message: { _id: messageId, deleted: true },
          })
        );
      });

      socket.on("messages-seen", ({ friendId: fId, messageIds, userId }) => {
        if (String(fId) === String(friendId)) {
          dispatch(markMessagesSeenLocal({ friendId: fId, messageIds, userId }));
        }
      });

      socket.on("typing", ({ from }) => {
        if (String(from) === String(friendId)) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      });

      socket.on("user-status", ({ userId, isOnline }) => {
        dispatch(updateUserStatus({ userId, isOnline }));
      });
    };

    setup();

    return () => {
      socket?.off("new-message");
      socket?.off("message-sent");
      socket?.off("edit-message");
      socket?.off("delete-message");
      socket?.off("messages-seen");
      socket?.off("typing");
      socket?.off("user-status");
    };
  }, [friendId, currentUser._id, isFocused, dispatch]);

  // ---------------- Mark unseen messages as seen ----------------
  useEffect(() => {
    if (!friendMessages.length || !isFocused) return;
    const unseen = friendMessages.filter(
      (m) =>
        String(m.sender) === String(friendId) &&
        !(m.readBy || []).map(String).includes(String(currentUser._id))
    );
    if (unseen.length) {
      const ids = unseen.map((m) => m._id);
      dispatch(
        markMessagesSeenLocal({ friendId, messageIds: ids, userId: currentUser._id })
      );
      getSocket()?.emit("mark-seen", {
        friendId,
        messageIds: ids,
        userId: currentUser._id,
      });
    }
  }, [friendMessages, isFocused]);

  // ---------------- Send or Edit message ----------------
  const sendMessage = async () => {
    if (!input.trim() && !image) return;
    const socket = await initSocket();
    if (!socket) return;

    if (editMessageData) {
      const messageId = editMessageData._id;
      const newContent = input;
      socket.emit("edit-message", { friendId, messageId, newContent });
      setEditMessageData(null);
      setInput("");
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMsg = {
      _id: tempId,
      sender: currentUser._id,
      senderName: "You",
      receiver: friendId,
      content: input,
      image,
      replyTo: reply,
      timestamp: new Date().toISOString(),
      readBy: [String(currentUser._id)],
    };

    dispatch(sendMessageOptimistic({ friendId, message: tempMsg }));
    setInput("");
    setImage(null);
    setReply(null);

    socket.emit("send-message", {
      receiver: friendId,
      content: tempMsg.content,
      image: tempMsg.image,
      tempId,
      replyTo: reply,
    });
  };

  // ---------------- Pick Image ----------------
  const pickImage = async () => {
    const options = { mediaType: "photo", quality: 0.7, selectionLimit: 1 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log("Image picker error:", response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) setImage(uri);
      }
    });
  };

  // ---------------- Take Photo ----------------
  const takePhoto = async () => {
    const options = { mediaType: "photo", quality: 0.7 };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log("Camera error:", response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) setImage(uri);
      }
    });
  };

  // ---------------- Selection & Long Press ----------------
  const handleLongPress = (msg) => setSelectedMessages([msg]);
  const toggleSelect = (msg) => {
    const exists = selectedMessages.find((m) => m._id === msg._id);
    if (exists) setSelectedMessages(selectedMessages.filter((m) => m._id !== msg._id));
    else setSelectedMessages([...selectedMessages, msg]);
  };

  const handleEdit = (msg) => {
    setEditMessageData(msg);
    setInput(msg.content);
    setSelectedMessages([]);
  };

  const handleDelete = (forEveryone) => {
    selectedMessages.forEach((msg) => {
      getSocket()?.emit("delete-message", {
        friendId,
        messageId: msg._id,
        deleteForEveryone: forEveryone,
      });
    });
    setSelectedMessages([]);
    setShowDeleteModal(false);
  };

  const renderMessage = ({ item, index }) => {
    const isMe = String(item.sender) === String(currentUser._id);
    const selected = selectedMessages.find((m) => m._id === item._id);
    const seenByFriend = (item.readBy || []).includes(friendId);

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dx > 20,
      onPanResponderRelease: () => setReply(item),
    });

    return (
      <TouchableOpacity
        {...panResponder.panHandlers}
        onLongPress={() => handleLongPress(item)}
        onPress={() => selectedMessages.length && toggleSelect(item)}
        style={[
          styles.message,
          isMe ? styles.myMessage : styles.friendMessage,
          selected ? styles.selectedMessage : {},
        ]}
      >
        {item.replyTo && (
          <View style={styles.quoted}>
            <Text style={styles.quotedLabel}>{item.replyTo.senderName}</Text>
            <Text style={styles.quotedText} numberOfLines={1}>
              {item.replyTo.content || "📷 Photo"}
            </Text>
          </View>
        )}
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
        {item.content && (
          <Text style={{ color: isMe ? "#fff" : "#000", fontSize: 15 }}>
            {item.content} {item.edited && "(edited)"}
          </Text>
        )}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 4 }}>
          <Text style={{ fontSize: 10, color: isMe ? "#ddd" : "#666" }}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {isMe && index === 0 && (
            <Text style={{ fontSize: 10, color: "#888", marginLeft: 4 }}>
              {seenByFriend ? "Seen" : "Sent"}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const sortedMessages = [...friendMessages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0078fe" />
      </View>
    );
  }

  // ---------------- Header ----------------
  const renderHeader = () => {
    if (selectedMessages.length > 0) {
      const msg = selectedMessages[0];
      const now = new Date();
      const msgTime = new Date(msg?.timestamp);
      const diffMinutes = (now - msgTime) / 1000 / 60;
      const seenByFriend = (msg.readBy || []).includes(friendId);

      const canEdit =
        selectedMessages.length === 1 &&
        msg.sender === currentUser._id &&
        diffMinutes <= 15 &&
        !seenByFriend;

      return (
        <View style={styles.selectionHeader}>
          <TouchableOpacity onPress={() => setSelectedMessages([])}>
            <Ionicons name="arrow-back" size={28} />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
            {selectedMessages.length} selected
          </Text>
          <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
            <Ionicons name="trash-outline" size={24} />
          </TouchableOpacity>
          {canEdit && (
            <TouchableOpacity onPress={() => handleEdit(msg)}>
              <Feather name="edit-2" size={22} />
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <View>
          <Image source={{ uri: friendAvatar }} style={styles.avatar} />
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: isFriendOnline ? "green" : "red" },
            ]}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.headerTitle}>{friendName}</Text>
          <Text style={{ fontSize: 12, color: isFriendOnline ? "green" : "#888" }}>
            {typing ? "Typing…" : isFriendOnline ? "Online" : "Offline"}
          </Text>
        </View>
        <Ionicons name="call-outline" size={24} style={styles.headerIcon} />
        <Ionicons name="videocam-outline" size={24} style={styles.headerIcon} />
        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Feather name="more-vertical" size={22} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {renderHeader()}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={sortedMessages}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingTop: 50 }}
        inverted
      />

      {/* Reply Preview */}
      <ReplyPreview reply={reply} onCancel={() => setReply(null)} />

      {/* Input Section */}
      <View style={styles.inputWrapper}>
        <Ionicons name="happy-outline" size={26} color="#555" />
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image-outline" size={26} color="#555" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}>
          <Ionicons name="camera-outline" size={26} color="#555" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => {
            setInput(text);
            getSocket()?.emit("typing", { to: friendId });
          }}
          placeholder="Message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Delete Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.deleteModal}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>
            Delete Message?
          </Text>
          <TouchableOpacity
            style={styles.deleteOption}
            onPress={() => handleDelete(true)}
          >
            <Text>Delete for Everyone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteOption}
            onPress={() => handleDelete(false)}
          >
            <Text>Delete for Me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteOption}
            onPress={() => setShowDeleteModal(false)}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ChatSettings
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        friendId={friendId}
      />
    </KeyboardAvoidingView>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#fff" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  onlineDot: { width: 10, height: 10, borderRadius: 5, position: "absolute", bottom: 2, right: 2 },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  headerIcon: { marginHorizontal: 8 },
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e0e0e0",
  },
  message: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    maxWidth: "80%",
  },
  myMessage: { backgroundColor: "#0078fe", alignSelf: "flex-end" },
  friendMessage: { backgroundColor: "#e8e8e8", alignSelf: "flex-start" },
  selectedMessage: { borderWidth: 2, borderColor: "#0078fe" },
  quoted: {
    backgroundColor: "#fff",
    padding: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#0078fe",
    marginBottom: 4,
  },
  quotedLabel: { fontWeight: "bold", fontSize: 12 },
  quotedText: { fontSize: 12, color: "#555" },
  image: { width: 200, height: 200, borderRadius: 10, marginVertical: 4 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendButton: {
    backgroundColor: "#0078fe",
    borderRadius: 20,
    padding: 8,
    marginLeft: 6,
  },
  replyPreview: {
    backgroundColor: "#e8e8e8",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#0078fe",
  },
  replyLabel: { fontWeight: "bold", color: "#0078fe" },
  replyText: { color: "#555", fontSize: 13 },
  deleteModal: {
    backgroundColor: "#fff",
    margin: 50,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  deleteOption: {
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
