
// src/features/profile/profileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "http://10.99.136.9:8000/api";

// ================== Helper ==================
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No token found in AsyncStorage!");
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

// ================== Thunks ==================

// ✅ Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "profile/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const headers = await getAuthHeaders();
      console.log("🔑 Headers for all-users:", headers);

      const res = await axios.get(`${API}/user/all-users`, { headers });
      console.log("🌐 API response for all users:", res.data);

      // Response is an array from backend
      const users = Array.isArray(res.data) ? res.data : res.data.users || [];
      return users;
    } catch (err) {
      console.error(
        "❌ Error fetching all users:",
        err.response?.data || err.message
      );
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ✅ Fetch profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (username, thunkAPI) => {
    if (!username) return thunkAPI.rejectWithValue("Username is required");
    try {
      const headers = await getAuthHeaders();
      const res = await axios.get(`${API}/user/profile/${username}`, {
        headers,
      });
      console.log("🌐 API response for profile:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ Error fetching profile:",
        err.response?.data || err.message
      );
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ✅ Fetch tab data (posts/reels/tagged)
// export const fetchTabData = createAsyncThunk(
//   "profile/fetchTabData",
//   async ({ tab, cursor = 0, username }, thunkAPI) => {
//     if (!username) return thunkAPI.rejectWithValue("Username is required");
//     try {
//       const headers = await getAuthHeaders();
//       url = `${API}/post/${username}/posts?cursor=${cursor}`;

//       const res = await axios.get(url, { headers });
//       console.log(`🌐 API response for ${tab}:`, res.data);

//       return {
//         tab,
//         items: res.data.items || [],
//         nextCursor: res.data.nextCursor || 0,
//         hasMore: res.data.hasMore || false,
//       };
//     } catch (err) {
//       console.error(
//         `❌ Error fetching ${tab}:`,
//         err.response?.data || err.message
//       );
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message || err.message
//       );
//     }
//   }
// );

// export const fetchTabData = createAsyncThunk(
//   "profile/fetchTabData",
//   async ({ tab, cursor = 0, username }, thunkAPI) => {
//     if (!username) return thunkAPI.rejectWithValue("Username is required");
//     try {
//       const headers = await getAuthHeaders();

//       // 1️⃣ Get userId from username
//       const userRes = await axios.get(`${API}/user/profile/${username}`, { headers });
//       const userId = userRes.data?._id || userRes.data?.user?._id;
//       if (!userId) throw new Error("User not found");

//       // 2️⃣ Fetch posts using userId
//       const url = `${API}/post/posts/user/${userId}?cursor=${cursor}`;
//       const res = await axios.get(url, { headers });

//       return {
//         tab,
//         items: res.data.items || res.data.posts || [],
//         nextCursor: res.data.nextCursor || 0,
//         hasMore: res.data.hasMore ?? false,
//       };
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message || err.message
//       );
//     }
//   }
// );
export const fetchTabData = createAsyncThunk(
  "profile/fetchTabData",
  async ({ tab, cursor = 0, userId }, thunkAPI) => {
    if (!userId) return thunkAPI.rejectWithValue("UserId is required");
    try {
      const headers = await getAuthHeaders();

      let url = "";

      switch (tab) {
        case "posts":
          url = `${API}/post/user/${userId}?cursor=${cursor}`;
          break;
        case "reels":
          url = `${API}/reels/user/${userId}?cursor=${cursor}`;
          break;
        case "saved":
          url = `${API}/saved/user/${userId}?cursor=${cursor}`;
          break;
        case "tagged":
          url = `${API}/tagged/user/${userId}?cursor=${cursor}`;
          break;
        default:
          throw new Error("Invalid tab selected");
      }

      const res = await axios.get(url, { headers });

      return {
        tab,
        items: res.data.items || [],
        nextCursor: res.data.nextCursor || 0,
        hasMore: res.data.hasMore ?? false,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);




// export const fetchTabData = createAsyncThunk(
//   "profile/fetchTabData",
//   async ({ tab, cursor = 0 }, thunkAPI) => {
//     try {
//       const headers = await getAuthHeaders();

//       // ✅ Call backend: GET my posts
//       const url = `${API}/post/posts/me?cursor=${cursor}`;
//       const res = await axios.get(url, { headers });

//       return {
//         tab,
//         items: res.data.posts || [],
//         nextCursor: res.data.nextCursor || 0,
//         hasMore: res.data.hasMore ?? false,
//       };
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message || err.message
//       );
//     }
//   }
// );



// ✅ Follow / Unfollow
export const followOrUnfollow = createAsyncThunk(
  "profile/followOrUnfollow",
  async (username, thunkAPI) => {
    if (!username) return thunkAPI.rejectWithValue("Username required");
    try {
      const headers = await getAuthHeaders();
      const state = thunkAPI.getState();
      const rel = state.profile.data?.relationship || {};

      if (rel.following || rel.requested) {
        const res = await axios.delete(
          `${API}/user/profile/${username}/follow`,
          { headers }
        );
        console.log("👋 Unfollow response:", res.data);
        return { relationship: res.data.relationship };
      } else {
        const res = await axios.post(
          `${API}/user/profile/${username}/follow`,
          {},
          { headers }
        );
        console.log("➕ Follow response:", res.data);
        return { relationship: res.data.relationship };
      }
    } catch (err) {
      console.error(
        "❌ Error in follow/unfollow:",
        err.response?.data || err.message
      );
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ================== Slice ==================
const initialTabState = {
  items: [],
  cursor: 0,
  hasMore: true,
  loading: false,
  refreshing: false,
  error: null,
};

const initialState = {
  username: "",
  data: null,
  loading: false,
  error: null,
  tabs: {
    posts: { ...initialTabState },
    reels: { ...initialTabState },
    tagged: { ...initialTabState },
  },
  followersModalOpen: false,
  followingModalOpen: false,
  postModal: { open: false, item: null },
  activeTab: "posts",
  updating: false,

  allUsers: [],
  allUsersLoading: false,
  allUsersError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    openFollowers: (state) => {
      state.followersModalOpen = true;
    },
    closeFollowers: (state) => {
      state.followersModalOpen = false;
    },
    openFollowing: (state) => {
      state.followingModalOpen = true;
    },
    closeFollowing: (state) => {
      state.followingModalOpen = false;
    },
    openPost: (state, action) => {
      state.postModal = { open: true, item: action.payload };
    },
    closePost: (state) => {
      state.postModal = { open: false, item: null };
    },
    refreshTabStart: (state, action) => {
      const tab = action.payload;
      state.tabs[tab].refreshing = true;
      state.tabs[tab].error = null;
      state.tabs[tab].cursor = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ fetchProfile
      .addCase(fetchProfile.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload;
        s.username = a.payload.username;
      })
      .addCase(fetchProfile.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Failed to load profile";
      })

      // ✅ fetchTabData
      .addCase(fetchTabData.pending, (s, a) => {
        const { tab } = a.meta.arg;
        s.tabs[tab].loading = true;
        s.tabs[tab].error = null;
      })
      .addCase(fetchTabData.fulfilled, (s, a) => {
        const { tab, items, nextCursor, hasMore } = a.payload;
        const t = s.tabs[tab];
        t.loading = false;
        t.refreshing = false;
        t.hasMore = hasMore;
        t.cursor = nextCursor;
        t.items = t.cursor === 0 ? items : [...t.items, ...items];
        console.log(`✅ Redux state for ${tab} updated:`, t.items);
      })
      .addCase(fetchTabData.rejected, (s, a) => {
        const { tab } = a.meta.arg;
        s.tabs[tab].loading = false;
        s.tabs[tab].refreshing = false;
        s.tabs[tab].error = a.payload || `Failed to load ${tab}`;
      })

      // ✅ followOrUnfollow
      .addCase(followOrUnfollow.fulfilled, (s, a) => {
        if (s.data) s.data.relationship = a.payload.relationship;
      })

      // ✅ fetchAllUsers
      .addCase(fetchAllUsers.pending, (s) => {
        s.allUsersLoading = true;
        s.allUsersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (s, a) => {
        s.allUsersLoading = false;
        s.allUsers = a.payload;
        console.log("✅ Redux allUsers updated:", s.allUsers);
      })
      .addCase(fetchAllUsers.rejected, (s, a) => {
        s.allUsersLoading = false;
        s.allUsersError = a.payload;
        console.error("❌ fetchAllUsers rejected:", a.payload);
      });
  },
});

export const {
  setActiveTab,
  openFollowers,
  closeFollowers,
  openFollowing,
  closeFollowing,
  openPost,
  closePost,
  refreshTabStart,
} = profileSlice.actions;

export default profileSlice.reducer;
