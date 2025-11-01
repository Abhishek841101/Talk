
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ✅ BASE URL

const BASE_URL = "http://10.99.136.9:8000/api";

const authHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("🔹 TOKEN SENT → ", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// ✅ Convert DB path → Full valid URL

const toUrl = (path) =>
  path?.startsWith("http")
    ? path
    : `${BASE_URL.replace("/api", "")}/${path}`;
// ✅ Upload Media → POST /media/upload
export const uploadMedia = createAsyncThunk(
  "media/uploadMedia",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("📦 UPLOAD FORM DATA =", formData);

      let headers = await authHeader();
      delete headers["Content-Type"]; // ❌ Don't set manually (RN handles)

      const url = `${BASE_URL}/media/media/upload`;
      console.log("📡 API URL →", url);

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();
      console.log("📥 SERVER RESPONSE =", data);

      if (!res.ok) {
        return rejectWithValue(data?.message || "Upload failed");
      }

      return data.media;
    } catch (err) {
      console.log("❌ UPLOAD ERROR =", err);
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Get All Media → GET /media
export const fetchAllMedia = createAsyncThunk(
  "media/fetchAllMedia",
  async (_, { rejectWithValue }) => {
    try {
      const headers = await authHeader();

      const res = await fetch(`${BASE_URL}/media/media`, { headers });
      const data = await res.json();

      if (!res.ok) return rejectWithValue(data.message);

      return data.items.map((item) => ({
        ...item,
        thumbnail: toUrl(item.thumbnail),
        fileUrl: toUrl(item.fileUrl),
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Get My Media → GET /media/me

export const fetchMyMedia = createAsyncThunk(
  "media/fetchMyMedia",
  async (_, { rejectWithValue }) => {
    try {
      const headers = await authHeader();

      const res = await fetch(`${BASE_URL}/media/media/me`, { headers });
      const data = await res.json();

      if (!res.ok) return rejectWithValue(data.message);

      return data.data.map((item) => ({
        ...item,
        thumbnail: toUrl(item.thumbnail),
        fileUrl: toUrl(item.fileUrl),
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


//////////////////////////////////////////////////////
// ✅ Like Media → POST /media/:id/like
//////////////////////////////////////////////////////
export const likeMedia = createAsyncThunk(
  "media/likeMedia",
  async (mediaId, { rejectWithValue }) => {
    try {
      const headers = await authHeader();

      const res = await fetch(`${BASE_URL}/media/media/${mediaId}/like`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return { mediaId, likesCount: data.likesCount };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


//////////////////////////////////////////////////////
// ✅ Comment → POST /media/:id/comment
//////////////////////////////////////////////////////
export const commentMedia = createAsyncThunk(
  "media/commentMedia",
  async ({ mediaId, text }, { rejectWithValue }) => {
    try {
      const headers = await authHeader();

      const res = await fetch(`${BASE_URL}/media/media/${mediaId}/comment`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return {
        mediaId,
        media: data.media,
        commentsCount: data.commentsCount,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


//////////////////////////////////////////////////////
// ✅ Slice
//////////////////////////////////////////////////////
const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaList: [],
    myMedia: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      //////////////////////////////////////////////////////
      // ✅ Upload Media
      //////////////////////////////////////////////////////
      .addCase(uploadMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.loading = false;

        const media = action.payload;

        const normalized = {
          ...media,
          fileUrl: toUrl(media.fileUrl),
          thumbnail: toUrl(media.thumbnail),
        };

        state.mediaList.unshift(normalized);
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //////////////////////////////////////////////////////
      // ✅ Fetch All
      //////////////////////////////////////////////////////
      .addCase(fetchAllMedia.fulfilled, (state, action) => {
        state.mediaList = action.payload;
      })

      //////////////////////////////////////////////////////
      // ✅ Fetch My
      //////////////////////////////////////////////////////
      .addCase(fetchMyMedia.fulfilled, (state, action) => {
        state.myMedia = action.payload;
      })

      //////////////////////////////////////////////////////
      // ✅ Like
      //////////////////////////////////////////////////////
      .addCase(likeMedia.fulfilled, (state, action) => {
        const { mediaId, likesCount } = action.payload;
        let item = state.mediaList.find((m) => m._id === mediaId);
        if (item) item.likesCount = likesCount;
      })

      //////////////////////////////////////////////////////
      // ✅ Comment
      //////////////////////////////////////////////////////
      .addCase(commentMedia.fulfilled, (state, action) => {
        const { mediaId, media } = action.payload;
        let item = state.mediaList.find((m) => m._id === mediaId);
        if (item) item.comments = media.comments;
      });
  },
});

export default mediaSlice.reducer;
