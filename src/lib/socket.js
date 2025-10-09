


// src/lib/socket.js
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../app/store";
import {
  newMessageReceived,
  sendMessageOptimistic,
  markMessagesSeenLocal,
  updateUserStatus,
  setChatList,
  updateChatListOnMessage,
  newGroupMessageReceived,
  markGroupMessagesSeenLocal,
  setGroupWallpaperLocal,
  setChatWallpaperLocal,
  editMessageReceived,
  editGroupMessageReceived,
} from "../features/chat/chatSlice";

let socket = null;
let initializing = false;
let markSeenThrottle = {}; // friendId/groupId => timeout

// ================= Init Socket =================
export const initSocket = async () => {
  console.log("[socket] initSocket called");
  if (socket && socket.connected) return socket;
  if (initializing) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (socket && socket.connected) {
          clearInterval(interval);
          resolve(socket);
        }
      }, 50);
    });
  }

  try {
    initializing = true;
    const token = await AsyncStorage.getItem("token");
    const myId = store.getState().auth.user?._id;
    if (!token || !myId) throw new Error("No auth token or user available");

    socket = io("http://10.150.225.9:8000", {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    // ===== Connection Events =====
    socket.on("connect", () => {
      console.log("[socket] connected", socket.id);
      socket.emit("fetch-chatlist");
    });

    socket.on("reconnect", (attempt) => {
      console.log("[socket] reconnected attempt:", attempt, socket.id);
      socket.emit("fetch-chatlist");
    });

    socket.on("disconnect", (reason) => console.log("[socket] disconnected", reason));
    socket.on("connect_error", (err) => console.warn("[socket] connect_error", err?.message || err));

    // ===== Chatlist =====
    socket.on("initial-chatlist", (chatlist) => {
      if (!chatlist) return;
      try {
        store.dispatch(setChatList(chatlist));
      } catch {
        chatlist.forEach((entry) => {
          if (entry.lastMessage) {
            store.dispatch(
              newMessageReceived({ friendId: entry.friendId, message: normalizeServerMsg(entry.lastMessage) })
            );
          }
        });
      }
    });

    // ===== 1-1 Message =====
    socket.on("new-message", (payload) => {
      const myId = store.getState().auth.user?._id;
      if (!payload || !myId) return;

      const msg = payload.message || payload;
      const tempId = payload.tempId || msg._tempId || null;
      const messageObj = normalizeServerMsg(msg);

      if (messageObj.sender === myId && tempId) {
        store.dispatch(newMessageReceived({ friendId: messageObj.receiver, message: messageObj, replaceTempId: tempId }));
        return;
      }

      store.dispatch(newMessageReceived({ friendId: messageObj.sender, message: messageObj }));
      try {
        store.dispatch(updateChatListOnMessage({ friendId: messageObj.sender, message: messageObj }));
      } catch {}

      const currentChatFriendId = store.getState().chat.currentChatFriendId;
      if (String(messageObj.sender) === String(currentChatFriendId)) {
        const messageIds = [messageObj._id];
        store.dispatch(markMessagesSeenLocal({ friendId: currentChatFriendId, messageIds, userId: myId }));
        if (markSeenThrottle[currentChatFriendId]) clearTimeout(markSeenThrottle[currentChatFriendId]);
        markSeenThrottle[currentChatFriendId] = setTimeout(() => {
          socket.emit("mark-seen", { friendId: currentChatFriendId, messageIds, userId: myId });
          delete markSeenThrottle[currentChatFriendId];
        }, 150);
      }
    });

    // ===== Group Message =====
    socket.on("new-group-message", ({ groupId, message, tempId }) => {
      const myId = store.getState().auth.user?._id;
      if (!message || !groupId || !myId) return;

      const messageObj = normalizeServerMsg(message);
      if (messageObj.sender === myId && tempId) {
        store.dispatch(newGroupMessageReceived({ groupId, message: messageObj, replaceTempId: tempId }));
      } else {
        store.dispatch(newGroupMessageReceived({ groupId, message: messageObj }));
      }

      const currentGroupId = store.getState().chat.currentGroupId;
      if (groupId === currentGroupId) {
        const messageIds = [messageObj._id];
        store.dispatch(markGroupMessagesSeenLocal({ groupId, messageIds, userId: myId }));
        if (markSeenThrottle[groupId]) clearTimeout(markSeenThrottle[groupId]);
        markSeenThrottle[groupId] = setTimeout(() => {
          socket.emit("mark-seen", { groupId, messageIds, userId: myId });
          delete markSeenThrottle[groupId];
        }, 150);
      }
    });

    // ===== 1-1 Message Edited =====
    socket.on("message-edited", ({ message }) => {
      const myId = store.getState().auth.user?._id;
      if (!message || !myId) return;
      const friendId = message.sender === myId ? message.receiver : message.sender;
      store.dispatch(editMessageReceived({ friendId, messageId: message._id, newContent: message.content }));
    });

    // ===== Group Message Edited =====
    socket.on("group-message-edited", ({ groupId, message }) => {
      if (!message || !groupId) return;
      store.dispatch(editGroupMessageReceived({ groupId, messageId: message._id, newContent: message.content }));
    });

    // ===== Typing 1-1 / Group =====
    socket.on("typing", ({ from, groupId }) => {
      const state = store.getState();
      const currentChatFriendId = state.chat.currentChatFriendId;
      const currentGroupId = state.chat.currentGroupId;

      if (groupId && groupId === currentGroupId) {
        store.dispatch(updateUserStatus({ userId: from, isTyping: true, groupId }));
        setTimeout(() => store.dispatch(updateUserStatus({ userId: from, isTyping: false, groupId })), 2000);
      } else if (from && String(from) === String(currentChatFriendId)) {
        store.dispatch(updateUserStatus({ userId: from, isTyping: true }));
        setTimeout(() => store.dispatch(updateUserStatus({ userId: from, isTyping: false })), 2000);
      }
    });

    // ===== User status =====
    socket.on("user-status", ({ userId, isOnline }) => {
      if (!userId) return;
      store.dispatch(updateUserStatus({ userId: String(userId), isOnline: !!isOnline }));
    });

    // ===== Messages Seen =====
    socket.on("messages-seen", ({ friendId, groupId, messageIds }) => {
      const myId = store.getState().auth.user?._id;
      if (friendId) store.dispatch(markMessagesSeenLocal({ friendId, messageIds, userId: myId }));
      if (groupId) store.dispatch(markGroupMessagesSeenLocal({ groupId, messageIds, userId: myId }));
    });

    // ===== Chat / Group Wallpaper =====
    socket.on("chat-wallpaper", ({ friendId, wallpaper }) => {
      if (!friendId) return;
      store.dispatch(setChatWallpaperLocal({ friendId, wallpaper }));
    });
    socket.on("group-wallpaper", ({ groupId, wallpaper }) => {
      if (!groupId) return;
      store.dispatch(setGroupWallpaperLocal({ groupId, wallpaper }));
    });

    initializing = false;
    return socket;
  } catch (err) {
    initializing = false;
    socket = null;
    console.error("[socket] init error:", err?.message || err);
    return null;
  }
};

// ================= Socket Instance =================
export const getSocket = () => (socket && socket.connected ? socket : null);

// ================= Send 1-1 Message =================
export const sendMessageSocket = ({ friendId, content, replyTo = null, image = null }) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) return null;

  const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const optimisticMessage = { _id: tempId, sender: myId, receiver: friendId, content, image, replyTo, timestamp: new Date().toISOString(), readBy: [myId], _temp: true };

  store.dispatch(sendMessageOptimistic({ friendId, message: optimisticMessage }));
  s.emit("send-message", { receiver: friendId, content, image, replyTo, tempId });

  return tempId;
};

// ================= Send Group Message =================
export const sendGroupMessageSocket = ({ groupId, content, replyTo = null, image = null }) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) return null;

  const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const optimisticMessage = { _id: tempId, sender: myId, group: groupId, content, image, replyTo, timestamp: new Date().toISOString(), readBy: [myId], _temp: true };

  store.dispatch(newGroupMessageReceived({ groupId, message: optimisticMessage }));
  s.emit("send-group-message", { groupId, content, image, replyTo, tempId });

  return tempId;
};

// ================= Notify Messages Seen =================
export const notifyMessagesSeen = ({ friendId, groupId, messageIds }) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) return;

  if (friendId) store.dispatch(markMessagesSeenLocal({ friendId, messageIds, userId: myId }));
  if (groupId) store.dispatch(markGroupMessagesSeenLocal({ groupId, messageIds, userId: myId }));

  setTimeout(() => s.emit("mark-seen", { friendId, groupId, messageIds, userId: myId }), 100);
};

// ================= Chat/Group Wallpaper =================
export const setChatWallpaperSocket = ({ friendId, wallpaper }) => {
  const s = getSocket();
  if (!s) return;
  store.dispatch(setChatWallpaperLocal({ friendId, wallpaper }));
  s.emit("chat/wallpaper", { friendId, wallpaper });
};

export const setGroupWallpaperSocket = ({ groupId, wallpaper }) => {
  const s = getSocket();
  if (!s) return;
  store.dispatch(setGroupWallpaperLocal({ groupId, wallpaper }));
  s.emit("groups/wallpaper", { groupId, wallpaper });
};

// ================= Disconnect =================
export const disconnectSocket = () => {
  if (!socket) return;
  const myId = store.getState().auth.user?._id;
  try { if (myId) socket.emit("user-offline", { userId: myId }); } catch {}
  socket.disconnect();
  socket = null;
};

// ================= Helper =================
function normalizeServerMsg(msg) {
  return {
    _id: String(msg._id),
    sender: String(msg.sender),
    receiver: msg.receiver ? String(msg.receiver) : null,
    group: msg.group || null,
    content: msg.content || "",
    image: msg.image || null,
    timestamp: msg.createdAt || new Date().toISOString(),
    readBy: (msg.readBy || []).map(String),
    senderUsername: msg.sender?.username || msg.senderUsername || null,
  };
}
