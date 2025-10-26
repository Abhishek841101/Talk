
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

// Import posts actions - fixed imports
import { 
  addPostFromSocket, 
  updatePostLikes, 
  addCommentFromSocket,
  addPostOptimistic,
  toggleLikeOptimistic,
  addCommentOptimistic
} from "../features/posts/postsSlice";

let socket = null;
let initializing = false;
let markSeenThrottle = {}; // friendId/groupId => timeout

// ================= Helper Functions =================
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

function normalizeServerPost(post) {
  return {
    id: String(post._id || post.id),
    user: {
      id: String(post.user?._id || post.user?.id),
      username: post.user?.username || 'Unknown',
      avatar: post.user?.avatar || post.user?.profilePicture || 'https://i.pravatar.cc/150?img=1'
    },
    image: post.image || post.imageUrl,
    caption: post.caption || '',
    location: post.location || '',
    likes: post.likes || post.likesCount || 0,
    liked: post.liked || false,
    comments: post.comments || [],
    createdAt: post.createdAt || new Date().toISOString(),
    followingOnly: post.followingOnly || false
  };
}

function normalizeServerComment(comment) {
  return {
    id: String(comment._id || comment.id),
    user: {
      id: String(comment.user?._id || comment.user?.id),
      username: comment.user?.username || 'Unknown'
    },
    text: comment.text || comment.content || '',
    createdAt: comment.createdAt || new Date().toISOString(),
    _temp: false
  };
}

// ================= Setup Socket Listeners =================
const setupSocketListeners = () => {
  if (!socket) return;

  console.log("[socket] Setting up listeners");

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








// Listen for incoming shares
socket.on("newShare", (share) => {
  console.log("[socket] New share received:", share);
  store.dispatch(addReceivedShare(share));
});



  // ================= Posts Real-time Events =================
  socket.on('newPost', (newPost) => {
    console.log('[socket] New post received:', newPost);
    const normalizedPost = normalizeServerPost(newPost);
    store.dispatch(addPostFromSocket(normalizedPost));
  });

  socket.on('postLiked', ({ postId, likesCount, likedBy }) => {
    console.log('[socket] Post liked:', { postId, likesCount, likedBy });
    const myId = store.getState().auth.user?._id;
    const liked = likedBy?.includes(myId) || false;
    store.dispatch(updatePostLikes({ 
      postId, 
      likesCount, 
      liked 
    }));
  });

  socket.on('postCommented', ({ postId, comment }) => {
    console.log('[socket] New comment:', { postId, comment });
    const normalizedComment = normalizeServerComment(comment);
    store.dispatch(addCommentFromSocket({ postId, comment: normalizedComment }));
  });

  socket.on('postDeleted', (postId) => {
    console.log('[socket] Post deleted:', postId);
    // You can add a deletePost action in your postsSlice if needed
  });

  socket.on('commentDeleted', ({ postId, commentId }) => {
    console.log('[socket] Comment deleted:', { postId, commentId });
    // You can add a deleteComment action in your postsSlice if needed
  });
};

// ================= Init Socket =================
export const initSocket = async () => {
  console.log("[socket] initSocket called");
  
  // Return existing socket if already connected
  if (socket && socket.connected) {
    console.log("[socket] Using existing connected socket");
    return socket;
  }
  
  // Wait if already initializing
  if (initializing) {
    console.log("[socket] Already initializing, waiting...");
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (socket && socket.connected) {
          clearInterval(interval);
          resolve(socket);
        }
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(interval);
          resolve(null);
        }, 10000);
      }, 100);
    });
  }

  try {
    initializing = true;
    console.log("[socket] Starting socket initialization");
    
    const token = await AsyncStorage.getItem("token");
    const myId = store.getState().auth.user?._id;
    
    console.log("[socket] Auth check - token:", !!token, "user ID:", myId);
    
    if (!token || !myId) {
      throw new Error("No auth token or user available");
    }

    // Create new socket connection
    socket = io("http://10.99.136.9:8000", {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    console.log("[socket] Socket instance created, setting up listeners");

    // Setup all event listeners
    setupSocketListeners();

    // Wait for connection with timeout
    const connectionPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Socket connection timeout"));
      }, 10000);

      socket.once("connect", () => {
        clearTimeout(timeout);
        console.log("[socket] Successfully connected");
        resolve(socket);
      });

      socket.once("connect_error", (error) => {
        clearTimeout(timeout);
        console.error("[socket] Connection error:", error);
        reject(error);
      });
    });

    await connectionPromise;
    
    console.log("[socket] Socket initialization completed successfully");
    initializing = false;
    return socket;

  } catch (err) {
    console.error("[socket] Socket initialization failed:", err?.message || err);
    initializing = false;
    
    // Clean up on failure
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    
    return null;
  }
};

// ================= Socket Instance =================
export const getSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }
  return null;
};

// ================= Send 1-1 Message =================
export const sendMessageSocket = ({ friendId, content, replyTo = null, image = null }) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) {
    console.warn("[socket] Cannot send message - no socket or user ID");
    return null;
  }

  const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const optimisticMessage = { 
    _id: tempId, 
    sender: myId, 
    receiver: friendId, 
    content, 
    image, 
    replyTo, 
    timestamp: new Date().toISOString(), 
    readBy: [myId], 
    _temp: true 
  };

  store.dispatch(sendMessageOptimistic({ friendId, message: optimisticMessage }));
  s.emit("send-message", { receiver: friendId, content, image, replyTo, tempId });

  return tempId;
};

// ================= Send Group Message =================
export const sendGroupMessageSocket = ({ groupId, content, replyTo = null, image = null }) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) {
    console.warn("[socket] Cannot send group message - no socket or user ID");
    return null;
  }

  const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const optimisticMessage = { 
    _id: tempId, 
    sender: myId, 
    group: groupId, 
    content, 
    image, 
    replyTo, 
    timestamp: new Date().toISOString(), 
    readBy: [myId], 
    _temp: true 
  };

  store.dispatch(newGroupMessageReceived({ groupId, message: optimisticMessage }));
  s.emit("send-group-message", { groupId, content, image, replyTo, tempId });

  return tempId;
};

// ================= Post Actions =================
export const createPostSocket = (postData) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) {
    console.warn("[socket] Cannot create post - no socket or user ID");
    return null;
  }

  const tempId = `post-temp-${Date.now()}`;
  const optimisticPost = {
    id: tempId,
    ...postData,
    user: {
      id: myId,
      username: store.getState().auth.user?.username || 'You',
      avatar: store.getState().auth.user?.profilePicture || 'https://i.pravatar.cc/150?img=1'
    },
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
    comments: [],
    _temp: true
  };

  console.log('[socket] Creating post:', optimisticPost);
  store.dispatch(addPostOptimistic(optimisticPost));
  s.emit('createPost', { ...postData, tempId });
  
  return tempId;
};

export const likePostSocket = (postId) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) {
    console.warn("[socket] Cannot like post - no socket or user ID");
    return;
  }
  
  console.log('[socket] Liking post:', postId);
  
  // Optimistic update
  store.dispatch(toggleLikeOptimistic(postId));
  
  s.emit('likePost', { postId, userId: myId });
};

export const commentOnPostSocket = (postId, commentText) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) {
    console.warn("[socket] Cannot comment on post - no socket or user ID");
    return null;
  }

  const tempId = `comment-temp-${Date.now()}`;
  const optimisticComment = {
    id: tempId,
    user: {
      id: myId,
      username: store.getState().auth.user?.username || 'You'
    },
    text: commentText,
    createdAt: new Date().toISOString(),
    _temp: true
  };

  console.log('[socket] Commenting on post:', { postId, commentText });
  
  // Optimistic update
  store.dispatch(addCommentOptimistic({
    postId,
    text: commentText,
    username: store.getState().auth.user?.username || 'You'
  }));
  
  s.emit('commentOnPost', { postId, comment: commentText, tempId });
  
  return tempId;
};

export const deletePostSocket = (postId) => {
  const s = getSocket();
  if (!s) {
    console.warn("[socket] Cannot delete post - no socket");
    return;
  }
  
  console.log('[socket] Deleting post:', postId);
  s.emit('deletePost', { postId });
};

export const deleteCommentSocket = (postId, commentId) => {
  const s = getSocket();
  if (!s) {
    console.warn("[socket] Cannot delete comment - no socket");
    return;
  }
  
  console.log('[socket] Deleting comment:', { postId, commentId });
  s.emit('deleteComment', { postId, commentId });
};

// ================= Notify Messages Seen =================
export const notifyMessagesSeen = ({ friendId, groupId, messageIds }) => {
  const s = getSocket();
  const myId = store.getState().auth.user?._id;
  if (!s || !myId) {
    console.warn("[socket] Cannot mark messages seen - no socket or user ID");
    return;
  }

  if (friendId) store.dispatch(markMessagesSeenLocal({ friendId, messageIds, userId: myId }));
  if (groupId) store.dispatch(markGroupMessagesSeenLocal({ groupId, messageIds, userId: myId }));

  setTimeout(() => s.emit("mark-seen", { friendId, groupId, messageIds, userId: myId }), 100);
};

// ================= Chat/Group Wallpaper =================
export const setChatWallpaperSocket = ({ friendId, wallpaper }) => {
  const s = getSocket();
  if (!s) {
    console.warn("[socket] Cannot set chat wallpaper - no socket");
    return;
  }
  store.dispatch(setChatWallpaperLocal({ friendId, wallpaper }));
  s.emit("chat/wallpaper", { friendId, wallpaper });
};

export const setGroupWallpaperSocket = ({ groupId, wallpaper }) => {
  const s = getSocket();
  if (!s) {
    console.warn("[socket] Cannot set group wallpaper - no socket");
    return;
  }
  store.dispatch(setGroupWallpaperLocal({ groupId, wallpaper }));
  s.emit("groups/wallpaper", { groupId, wallpaper });
};

// ================= Typing Indicators =================
export const sendTypingIndicator = ({ friendId, groupId, isTyping }) => {
  const s = getSocket();
  if (!s) return;
  
  s.emit("typing", { to: friendId || groupId, isTyping, groupId: groupId || null });
};

// ================= Disconnect =================
export const disconnectSocket = () => {
  if (!socket) {
    console.log("[socket] No socket to disconnect");
    return;
  }
  
  const myId = store.getState().auth.user?._id;
  try { 
    if (myId) socket.emit("user-offline", { userId: myId }); 
  } catch (error) {
    console.warn("[socket] Error emitting user-offline:", error);
  }
  
  socket.disconnect();
  socket = null;
  console.log("[socket] Socket disconnected and cleared");
};

// ================= Check Connection Status =================
export const isSocketConnected = () => {
  return !!(socket && socket.connected);
};















