



// src/features/notification/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------- API URL --------------------
const API = "http://10.99.136.9:8000/api/notification"; // ✅ Correct base path

// -------------------- Async Thunks --------------------

// ✅ Fetch all notifications
export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("[DEBUG] Token from AsyncStorage:", token);

      const res = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("[DEBUG] Response from backend:", res.data);

      return res.data.notifications || res.data; // backend sends { notifications: [...] }
    } catch (err) {
      console.log("[ERROR] Fetch notifications failed:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// ✅ Mark single notification as read
export const markNotificationRead = createAsyncThunk(
  "notification/markNotificationRead",
  async (notificationId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API}/mark-read`,
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return notificationId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to mark notification read"
      );
    }
  }
);

// ✅ Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
  "notification/markAllNotificationsRead",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API}/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to mark all notifications read"
      );
    }
  }
);

// -------------------- Slice --------------------
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.loading = false;
      state.error = null;
    },
    resetNotificationError: (state) => {
      state.error = null;
    },
    addNotificationFromSocket: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markNotificationRead
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notifId = action.payload;
        const notif = state.notifications.find((n) => n._id === notifId);
        if (notif) notif.read = true;
      })

      // markAllNotificationsRead
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
      });
  },
});

export const { clearNotifications, resetNotificationError, addNotificationFromSocket } =
  notificationSlice.actions;

export default notificationSlice.reducer;
