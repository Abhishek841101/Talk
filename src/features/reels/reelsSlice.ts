
// src/features/reels/reelsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ==========================================================
   ✅ TYPES
   ========================================================== */
export interface Comment {
  _id?: string;
  userId: string;
  username: string;
  comment: string;
  createdAt?: string;
}

export interface Reel {
  _id: string;
  videoUrl: string;
  username: string;
  userId?: string;
  likes: number;
  liked?: boolean; // whether current user liked it (backend returns liked on like toggle)
  likedBy?: string[]; // optional if backend returns
  comments?: Comment[];
  commentCount?: number;
  shares?: number;
  saved?: boolean; // whether current user saved it
  createdAt?: string;
}

/* ==========================================================
   STATE
   ========================================================== */
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

// base URL
const API = "http://10.99.136.9:8000/api";

/* ==========================================================
   AUTH HEADER
   ========================================================== */
const authHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ==========================================================
   THUNKS
   ========================================================== */

// FETCH ALL REELS
export const fetchReelsThunk = createAsyncThunk<Reel[], void>(
  "reels/fetchAll",
  async (_, thunkAPI) => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/reel/reels`, { headers });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Fetch reels failed");
      }
      const data = (await res.json()) as Reel[];

      // Normalize: ensure liked/saved exist (backend may not set them on fetch)
      const normalized = data.map((r) => ({
        ...r,
        liked: (r as any).liked ?? false,
        saved: (r as any).saved ?? false,
        commentCount: (r as any).commentCount ?? (r.comments ? r.comments.length : 0),
        shares: (r as any).shares ?? 0,
      }));

      return normalized;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Fetch failed");
    }
  }
);

// UPLOAD REEL
export const uploadReelThunk = createAsyncThunk<Reel, { videoUri: string }>(
  "reels/upload",
  async ({ videoUri }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("AUTH REQUIRED");

      const formData = new FormData();
      formData.append(
        "video",
        {
          uri: videoUri,
          type: "video/mp4",
          name: `reel_${Date.now()}.mp4`,
        } as any
      );

      const res = await fetch(`${API}/reel/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type — let fetch set multipart boundary
        },
        body: formData,
      });

      const text = await res.text();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(`Upload failed: ${res.status} - ${text}`);
      }

      const data = JSON.parse(text) as Reel;

      // normalize fields
      const normalized: Reel = {
        ...data,
        liked: (data as any).liked ?? false,
        saved: (data as any).saved ?? false,
        commentCount: (data as any).commentCount ?? (data.comments ? data.comments.length : 0),
        shares: (data as any).shares ?? 0,
      };

      return normalized;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Upload failed");
    }
  }
);

// LIKE (toggle) — backend returns { id, likes, liked }
export const likeReelThunk = createAsyncThunk<
  { id: string; likes: number; liked: boolean },
  string
>("reels/like", async (id, thunkAPI) => {
  try {
    const headers = await authHeader();
    const res = await fetch(`${API}/reel/reels/${id}/like`, {
      method: "POST",
      headers,
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    // expected shape: { id, likes, liked }
    return data as { id: string; likes: number; liked: boolean };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Like failed");
  }
});

// UNLIKE (if you also have a direct unlike endpoint)
export const unlikeReelThunk = createAsyncThunk<
  { id: string; likes: number; liked?: boolean },
  string
>("reels/unlike", async (id, thunkAPI) => {
  try {
    const headers = await authHeader();
    const res = await fetch(`${API}/reel/reels/${id}/unlike`, {
      method: "POST",
      headers,
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    // expected: { id, likes } or { id, likes, liked }
    return data as { id: string; likes: number; liked?: boolean };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Unlike failed");
  }
});

// COMMENT — backend returns FULL updated Reel
export const commentReelThunk = createAsyncThunk<Reel, { id: string; comment: string }>(
  "reels/comment",
  async ({ id, comment }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(await authHeader()),
      };

      const res = await fetch(`${API}/reel/reels/${id}/comment`, {
        method: "POST",
        headers,
        body: JSON.stringify({ comment }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Reel;

      // normalize returned reel
      const normalized: Reel = {
        ...data,
        liked: (data as any).liked ?? false,
        saved: (data as any).saved ?? false,
        commentCount: (data as any).commentCount ?? (data.comments ? data.comments.length : 0),
        shares: (data as any).shares ?? 0,
      };

      return normalized;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Comment failed");
    }
  }
);

// DELETE
export const deleteReelThunk = createAsyncThunk<string, string>(
  "reels/delete",
  async (id, thunkAPI) => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/reel/reels/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error(await res.text());
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Delete failed");
    }
  }
);

// MY REELS
export const getMyReelsThunk = createAsyncThunk<Reel[], void>(
  "reels/my",
  async (_, thunkAPI) => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/reel/reels/myReels`, { headers });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Reel[];
      const normalized = data.map((d) => ({
        ...d,
        liked: (d as any).liked ?? false,
        saved: (d as any).saved ?? false,
        commentCount: (d as any).commentCount ?? (d.comments ? d.comments.length : 0),
        shares: (d as any).shares ?? 0,
      }));
      return normalized;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Fetch my reels failed");
    }
  }
);

// SAVE REEL
export const saveReelThunk = createAsyncThunk<string, string>(
  "reels/save",
  async (id, thunkAPI) => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/reel/${id}/save`, { method: "POST", headers });
      if (!res.ok) throw new Error(await res.text());
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Save failed");
    }
  }
);

// UNSAVE REEL
export const unsaveReelThunk = createAsyncThunk<string, string>(
  "reels/unsave",
  async (id, thunkAPI) => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/reel/${id}/unsave`, { method: "POST", headers });
      if (!res.ok) throw new Error(await res.text());
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Unsave failed");
    }
  }
);

/* ==========================================================
   SLICE
   ========================================================== */
const reelsSlice = createSlice({
  name: "reels",
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<Reel>) => {
      state.items.unshift(action.payload);
    },
    // optional local helpers:
    setReels: (state, action: PayloadAction<Reel[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchReelsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReelsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchReelsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // upload
    builder.addCase(uploadReelThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.items.unshift(action.payload);
      }
    });
    builder.addCase(uploadReelThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // like toggle
    builder.addCase(likeReelThunk.fulfilled, (state, action) => {
      const payload = action.payload;
      const reel = state.items.find((r) => r._id === payload.id);
      if (reel) {
        reel.likes = payload.likes;
        reel.liked = payload.liked;
      }
    });
    builder.addCase(likeReelThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // unlike
    builder.addCase(unlikeReelThunk.fulfilled, (state, action) => {
      const payload = action.payload;
      const reel = state.items.find((r) => r._id === payload.id);
      if (reel) {
        reel.likes = payload.likes;
        // if backend returns liked flag, use it; otherwise set false
        reel.liked = (payload as any).liked ?? false;
      }
    });
    builder.addCase(unlikeReelThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // comment (backend returns full reel)
    builder.addCase(commentReelThunk.fulfilled, (state, action) => {
      const updated = action.payload;
      const idx = state.items.findIndex((r) => r._id === updated._id);
      if (idx !== -1) {
        state.items[idx] = {
          ...updated,
          liked: (updated as any).liked ?? state.items[idx].liked ?? false,
          saved: (updated as any).saved ?? state.items[idx].saved ?? false,
          commentCount: (updated as any).commentCount ?? (updated.comments ? updated.comments.length : 0),
        };
      } else {
        // if not found, prepend
        state.items.unshift({
          ...updated,
          liked: (updated as any).liked ?? false,
          saved: (updated as any).saved ?? false,
          commentCount: (updated as any).commentCount ?? (updated.comments ? updated.comments.length : 0),
        });
      }
    });
    builder.addCase(commentReelThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // delete
    builder.addCase(deleteReelThunk.fulfilled, (state, action) => {
      state.items = state.items.filter((r) => r._id !== action.payload);
    });
    builder.addCase(deleteReelThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // my reels
    builder.addCase(getMyReelsThunk.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(getMyReelsThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // save / unsave
    builder.addCase(saveReelThunk.fulfilled, (state, action) => {
      const id = action.payload;
      const reel = state.items.find((r) => r._id === id);
      if (reel) reel.saved = true;
    });
    builder.addCase(saveReelThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(unsaveReelThunk.fulfilled, (state, action) => {
      const id = action.payload;
      const reel = state.items.find((r) => r._id === id);
      if (reel) reel.saved = false;
    });
    builder.addCase(unsaveReelThunk.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { addOne, setReels } = reelsSlice.actions;
export default reelsSlice.reducer;
