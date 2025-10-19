
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "http://10.99.136.9:8000/api";

// -------------------- Async Thunks --------------------

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "chat/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/user/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Array.isArray(res.data) ? res.data : res.data.users || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Fetch 1-1 messages
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (friendId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/chat/messages/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return (res.data || []).map((msg) => ({
        _id: String(msg._id),
        sender: String(msg.sender),
        receiver: String(msg.receiver),
        content: msg.content || msg.text || "",
        image: msg.image || null,
        timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
        readBy: (msg.readBy || []).map(String),
        senderUsername: msg.senderUsername || msg.sender?.username || null,
        receiverUsername: msg.receiverUsername || msg.receiver?.username || null,
        edited: msg.edited || false,
        reactions: msg.reactions || [],
      }));
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

// Fetch group messages
export const fetchGroupMessages = createAsyncThunk(
  "chat/fetchGroupMessages",
  async (groupId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/chat/group/messages/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { groupId, messages: res.data || [] };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch group messages"
      );
    }
  }
);

// Delete 1-1 message
export const deleteMessageAPI = createAsyncThunk(
  "chat/deleteMessageAPI",
  async ({ messageId, deleteForEveryone }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = deleteForEveryone
        ? `${API}/chat/delete/everyone/${messageId}`
        : `${API}/chat/delete/me/${messageId}`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      const friendId = thunkAPI.getState().chat.currentChatFriendId;
      return { messageId, deleteForEveryone, friendId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

// Delete group message
export const deleteGroupMessageAPI = createAsyncThunk(
  "chat/deleteGroupMessageAPI",
  async ({ groupId, messageId }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = `${API}/groups/${groupId}/message/${messageId}`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      return { groupId, messageId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete group message"
      );
    }
  }
);

// Set chat wallpaper
export const setChatWallpaperAPI = createAsyncThunk(
  "chat/setChatWallpaperAPI",
  async ({ friendId, wallpaperUrl }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API}/user/chat/wallpaper/${friendId}`,
        { wallpaperUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { friendId, wallpaperUrl: res.data.wallpaperUrl };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to set chat wallpaper"
      );
    }
  }
);

// Set group wallpaper
export const setGroupWallpaperAPI = createAsyncThunk(
  "chat/setGroupWallpaperAPI",
  async ({ groupId, wallpaperUrl }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API}/groups/${groupId}/wallpaper`,
        { wallpaperUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { groupId, wallpaperUrl: res.data.wallpaperUrl };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to set group wallpaper"
      );
    }
  }
);

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async ({ friendId, messageIds }, thunkAPI) => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.post(
      `${API}/user/chat/mark-seen/${friendId}`,
      { messageIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { friendId, messageIds, result: res.data };
  }
);

// -------------------- Slice --------------------
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    allUsers: [],
    groups: [],
    unreadSummary: [],
    messages: {},
    loading: false,
    error: null,
    authUserId: null,
    currentChatFriendId: null,
    currentGroupId: null,
    chatWallpapers: {}, // friendId -> wallpaperUrl
    groupWallpapers: {}, // groupId -> wallpaperUrl
  },
  reducers: {
    setAuthUserId: (state, action) => {
      state.authUserId = action.payload;
    },
    setCurrentChatFriendId: (state, action) => {
      state.currentChatFriendId = action.payload;
      state.currentGroupId = null;
    },
    setCurrentGroupId: (state, action) => {
      state.currentGroupId = action.payload;
      state.currentChatFriendId = null;
    },

    // ===== Local Wallpaper Updates =====
    setChatWallpaperLocal: (state, action) => {
      const { friendId, wallpaper } = action.payload;
      state.chatWallpapers[String(friendId)] = wallpaper;
    },
    setGroupWallpaperLocal: (state, action) => {
      const { groupId, wallpaper } = action.payload;
      state.groupWallpapers[String(groupId)] = wallpaper;
    },

    // ===== Message Handling =====
    sendMessageOptimistic: (state, action) => {
      const { friendId, message } = action.payload;
      const fid = String(friendId);
      if (!state.messages[fid]) state.messages[fid] = [];
      state.messages[fid].push({ ...message, _temp: true });
    },
    newMessageReceived: (state, action) => {
      const { friendId, message, replaceTempId } = action.payload;
      const fid = String(friendId);
      if (!state.messages[fid]) state.messages[fid] = [];
      if (replaceTempId) {
        const idx = state.messages[fid].findIndex(m => m._id === replaceTempId);
        if (idx !== -1) state.messages[fid][idx] = message;
        else state.messages[fid].push(message);
      } else if (!state.messages[fid].some(m => m._id === message._id)) {
        state.messages[fid].push(message);
      }
    },

    // ===== Edit & Seen =====
    editMessageLocal: (state, action) => {
      const { friendId, messageId, newContent } = action.payload;
      const fid = String(friendId);
      const msg = state.messages[fid]?.find(m => m._id === messageId);
      if (msg) {
        msg.content = newContent;
        msg.edited = true;
      }
    },
    markMessagesSeenLocal: (state, action) => {
      const { friendId, messageIds, userId } = action.payload;
      const fid = String(friendId);
      if (state.messages[fid]) {
        state.messages[fid] = state.messages[fid].map(m =>
          messageIds.includes(m._id)
            ? { ...m, readBy: [...new Set([...(m.readBy || []), String(userId)])] }
            : m
        );
      }
    },

    clearMessages: (state) => {
      Object.assign(state, chatSlice.getInitialState());
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload.map(u => ({
          _id: String(u._id),
          username: u.username,
          avatar: u.avatar || null,
          isOnline: !!u.isOnline,
          lastMessage: u.lastMessage || null,
          unreadCount: Number(u.unreadCount || 0),
        }));
      })
      // Fetch messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const friendId = String(action.meta.arg);
        state.messages[friendId] = action.payload;
      })
      // Group messages
      .addCase(fetchGroupMessages.fulfilled, (state, action) => {
        const { groupId, messages } = action.payload;
        state.messages[String(groupId)] = messages;
      })
      // Delete message
      .addCase(deleteMessageAPI.fulfilled, (state, action) => {
        const { messageId, friendId } = action.payload;
        if (state.messages[friendId]) {
          state.messages[friendId] = state.messages[friendId].filter(m => m._id !== messageId);
        }
      })
      // Wallpapers
      .addCase(setChatWallpaperAPI.fulfilled, (state, action) => {
        const { friendId, wallpaperUrl } = action.payload;
        state.chatWallpapers[String(friendId)] = wallpaperUrl;
      })
      .addCase(setGroupWallpaperAPI.fulfilled, (state, action) => {
        const { groupId, wallpaperUrl } = action.payload;
        state.groupWallpapers[String(groupId)] = wallpaperUrl;
      });
  },
});

export const {
  setAuthUserId,
  setCurrentChatFriendId,
  setCurrentGroupId,
  sendMessageOptimistic,
  newMessageReceived,
  markMessagesSeenLocal,
  editMessageLocal,
  setChatWallpaperLocal,
  setGroupWallpaperLocal,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
