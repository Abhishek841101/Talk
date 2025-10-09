

// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { fetchReels, uploadReel, likeReel } from "../../api/api";

// export type Reel = {
//   _id: string;
//   videoUrl: string;
//   username: string;
//   likes: number;
//   comments?: { user: string; comment: string; createdAt: string }[];
//   createdAt?: string;
// };

// type ReelsState = { items: Reel[]; loading: boolean; error?: string | null };
// const initialState: ReelsState = { items: [], loading: false, error: null };

// export const fetchReelsThunk = createAsyncThunk("reels/fetchAll", async () => {
//   const data = await fetchReels();
//   return data as Reel[];
// });

// export const uploadReelThunk = createAsyncThunk("reels/upload", async ({ videoUri, username }: { videoUri: string; username?: string }) => {
//   const data = await uploadReel(videoUri, username);
//   return data as Reel;
// });

// export const likeReelThunk = createAsyncThunk("reels/like", async (id: string) => {
//   const data = await likeReel(id);
//   return data as { _id: string; likes: number } | null;
// });

// const reelsSlice = createSlice({
//   name: "reels",
//   initialState,
//   reducers: {
//     addOne(state, action: PayloadAction<Reel>) { state.items = [action.payload, ...state.items]; },
//     updateLikes(state, action: PayloadAction<{ id: string; likes: number }>) {
//       const idx = state.items.findIndex(r => r._id === action.payload.id);
//       if (idx >= 0) state.items[idx].likes = action.payload.likes;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchReelsThunk.pending, (s) => { s.loading = true; s.error = null; })
//       .addCase(fetchReelsThunk.fulfilled, (s, a) => { s.loading = false; s.items = a.payload || []; })
//       .addCase(fetchReelsThunk.rejected, (s, a) => { s.loading = false; s.error = a.error.message || "Failed to fetch reels"; })

//       .addCase(uploadReelThunk.fulfilled, (s, a) => { if (a.payload?._id) s.items.unshift(a.payload); })
//       .addCase(likeReelThunk.fulfilled, (s, a) => {
//         if (!a.payload) return;
//         const { _id, likes } = a.payload;
//         const idx = s.items.findIndex(r => r._id === _id);
//         if (idx >= 0) s.items[idx].likes = likes;
//       });
//   },
// });

// export const { addOne, updateLikes } = reelsSlice.actions;
// export default reelsSlice.reducer;



























import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchReels, uploadReel } from "../../api/api";
import likeReel from "../../api/api";

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

const initialState: ReelsState = { items: [], loading: false, error: null };

// ------------------- Thunks -------------------
export const fetchReelsThunk = createAsyncThunk("reels/fetchAll", async () => {
  return await fetchReels();
});

// export const uploadReelThunk = createAsyncThunk(
//   "reels/upload",
//   async ({ videoUri }: { videoUri: string }) => {
//     return await uploadReel(videoUri);
//   }
// );
export const uploadReelThunk = createAsyncThunk(
  "reels/upload",
  async ({ videoUri, username }: { videoUri: string; username: string }) => {
    return await uploadReel(videoUri, username);
  }
);


export const likeReelThunk = createAsyncThunk(
  "reels/like",
  async (id: string) => {
    return await likeReel(id);
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReelsThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReelsThunk.fulfilled, (state, action) => { state.items = action.payload; state.loading = false; })
      .addCase(fetchReelsThunk.rejected, (state, action) => { state.error = action.error.message || "Error"; state.loading = false; })
      .addCase(uploadReelThunk.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      });
  },
});

export const { addOne, updateLikes } = reelsSlice.actions;
export default reelsSlice.reducer;
