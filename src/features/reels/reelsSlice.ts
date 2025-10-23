

// src/features/reels/reelsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Reel {
  _id: string;
  videoUrl: string;
  username: string;
  likes: number;
}

interface ReelsState {
  items: Reel[];
  loading: boolean;
  error: string | null;
}

const initialState: ReelsState = {
  items: [],
  loading: false,
  error: null,
};

// 🔹 Backend base URL
const API_BASE = "http://10.99.136.9:8000/api";

// ------------------- Thunks -------------------

// Fetch all reels
export const fetchReelsThunk = createAsyncThunk<Reel[], void>(
  "reels/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Adjusted URL to match backend
      // Example: backend exposes GET /api/reel instead of /api/reels
      const res = await fetch(`${API_BASE}/reel/reels`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server Error: ${res.status} - ${text}`);
      }

      const data = await res.json();

      // Adjust according to backend response
      // Some backends return data directly as array, some as { reels: [...] }
      if (Array.isArray(data)) return data as Reel[];
      if (data.reels && Array.isArray(data.reels)) return data.reels as Reel[];

      return [];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch reels");
    }
  }
);

// Upload a new reel
export const uploadReelThunk = createAsyncThunk<
  Reel,
  { videoUri: string; username: string }
>("reels/upload", async ({ videoUri, username }, thunkAPI) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("video", {
      uri: videoUri,
      type: "video/mp4",
      name: `reel_${Date.now()}.mp4`,
    } as any);
    formData.append("username", username);

    const res = await fetch(`${API_BASE}/reel/upload`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed: ${res.status} - ${text}`);
    }

    const data = await res.json();
    // backend may return { reel: {...} } or the reel object directly
    return data.reel ?? data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to upload reel");
  }
});

// Like a reel
export const likeReelThunk = createAsyncThunk<
  { id: string; likes: number },
  string
>("reels/like", async (id, thunkAPI) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_BASE}/reel/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Like failed: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return { id, likes: data.likesCount ?? data.likes ?? 0 };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to like reel");
  }
});

// ------------------- Slice -------------------
const reelsSlice = createSlice({
  name: "reels",
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<Reel>) => {
      state.items.unshift(action.payload);
    },
    updateLikes: (state, action: PayloadAction<{ id: string; likes: number }>) => {
      const reel = state.items.find((r) => r._id === action.payload.id);
      if (reel) reel.likes = action.payload.likes;
    },
    clearReels: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReelsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReelsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchReelsThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(uploadReelThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadReelThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(uploadReelThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(likeReelThunk.fulfilled, (state, action) => {
        const reel = state.items.find((r) => r._id === action.payload.id);
        if (reel) reel.likes = action.payload.likes;
      });
  },
});

export const { addOne, updateLikes, clearReels, resetError } = reelsSlice.actions;
export default reelsSlice.reducer;
