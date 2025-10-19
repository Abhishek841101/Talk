
// store/slices/blockSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http:/10.121.42.9/:8000/api'; // Make sure this matches your backend port

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Add token interceptor
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token from storage:', error);
  }
  return config;
});

// Async thunks with CORRECT endpoints that match your backend
export const blockUser = createAsyncThunk(
  'block/blockUser',
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      // ✅ CORRECT: POST /api/block/:id
      const response = await api.post(`/block/block/${userId}`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to block user'
      );
    }
  }
);

export const unblockUser = createAsyncThunk(
  'block/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      // ✅ CORRECT: POST /api/block/unblock/:id
      const response = await api.post(`block/unblock/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to unblock user'
      );
    }
  }
);

export const markNotInterested = createAsyncThunk(
  'block/markNotInterested',
  async (postId, { rejectWithValue }) => {
    try {
      // ✅ CORRECT: POST /api/block/not-interested/:postId
      const response = await api.post(`/block/not-interested/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to mark as not interested'
      );
    }
  }
);

export const fetchBlockedList = createAsyncThunk(
  'block/fetchBlockedList',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ CORRECT: GET /api/block/blocked-list
      const response = await api.get('/block/blocked-list');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch blocked list'
      );
    }
  }
);

export const checkBlockStatus = createAsyncThunk(
  'block/checkBlockStatus',
  async (userId, { rejectWithValue }) => {
    // ✅ Add validation to prevent undefined userId
    if (!userId) {
      return rejectWithValue('User ID is required');
    }
    
    try {
      // ✅ CORRECT: GET /api/block/check-block/:id
      const response = await api.get(`/block/check-block/${userId}`);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to check block status'
      );
    }
  }
);

const blockSlice = createSlice({
  name: 'block',
  initialState: {
    blockedUsers: [],
    loading: false,
    error: null,
    notInterestedPosts: [],
    blockStatus: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotInterestedPost: (state, action) => {
      state.notInterestedPosts.push(action.payload);
    },
    removeNotInterestedPost: (state, action) => {
      state.notInterestedPosts = state.notInterestedPosts.filter(
        id => id !== action.payload
      );
    },
    updateBlockStatus: (state, action) => {
      const { userId, isBlockedByMe, amIBlocked } = action.payload;
      state.blockStatus[userId] = { isBlockedByMe, amIBlocked };
    },
    clearBlockStatus: (state) => {
      state.blockStatus = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Block user
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedUsers.push(action.payload);
        state.blockStatus[action.payload.targetUserId] = {
          isBlockedByMe: true,
          amIBlocked: false
        };
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Unblock user
      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedUsers = state.blockedUsers.filter(
          user => user._id !== action.payload.targetUserId
        );
        state.blockStatus[action.payload.targetUserId] = {
          isBlockedByMe: false,
          amIBlocked: false
        };
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark not interested
      .addCase(markNotInterested.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotInterested.fulfilled, (state, action) => {
        state.loading = false;
        state.notInterestedPosts.push(action.payload.postId);
      })
      .addCase(markNotInterested.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch blocked list
      .addCase(fetchBlockedList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlockedList.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedUsers = action.payload;
      })
      .addCase(fetchBlockedList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check block status
      .addCase(checkBlockStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkBlockStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, isBlockedByMe, amIBlocked } = action.payload;
        state.blockStatus[userId] = { isBlockedByMe, amIBlocked };
      })
      .addCase(checkBlockStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  addNotInterestedPost, 
  removeNotInterestedPost, 
  updateBlockStatus, 
  clearBlockStatus 
} = blockSlice.actions;

// Selectors
export const selectBlockedUsers = (state) => state.block.blockedUsers;
export const selectBlockLoading = (state) => state.block.loading;
export const selectBlockError = (state) => state.block.error;
export const selectNotInterestedPosts = (state) => state.block.notInterestedPosts;
export const selectBlockStatus = (state, userId) => 
  userId ? state.block.blockStatus[userId] || { 
    isBlockedByMe: false, 
    amIBlocked: false 
  } : { isBlockedByMe: false, amIBlocked: false };
export const selectIsBlockedByMe = (state, userId) => 
  userId ? state.block.blockStatus[userId]?.isBlockedByMe || false : false;
export const selectAmIBlocked = (state, userId) => 
  userId ? state.block.blockStatus[userId]?.amIBlocked || false : false;

export default blockSlice.reducer;