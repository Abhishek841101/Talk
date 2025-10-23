
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "http://10.99.136.9:8000/api/post";

// -------------------- Async Thunks --------------------

// Upload post (with image using FormData)
export const uploadPost = createAsyncThunk(
  "posts/uploadPost",
  async (postData, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("caption", postData.caption);
      if (postData.location) formData.append("location", postData.location);

      if (postData.image) {
        formData.append("image", {
          uri: postData.image, // local file URI from picker
          name: "photo.jpg", // any filename
          type: "image/jpeg", // MIME type
        });
      }

      const res = await axios.post(`${API}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          thunkAPI.dispatch(setUploadProgress(percent));
        },
      });

      return res.data.post;
    } catch (err) {
      console.log("❌ Upload error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to upload post"
      );
    }
  }
);



// Fetch posts (paginated)
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/posts?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        posts: res.data.posts || [],
        hasMore: res.data.hasMore || false,
        page,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

// Fetch single post
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.post;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return postId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

// Like/unlike post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        postId,
        likesCount: res.data.likesCount,
        liked: res.data.liked,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to like post"
      );
    }
  }
);

// Add comment
export const addCommentToPost = createAsyncThunk(
  "posts/addCommentToPost",
  async ({ postId, commentText }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API}/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { postId, comment: res.data.comment };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

// Delete comment
export const deleteCommentFromPost = createAsyncThunk(
  "posts/deleteCommentFromPost",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API}/posts/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { postId, commentId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

// -------------------- Slice --------------------
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    uploadProgress: 0,
    currentPost: null,
  },
  reducers: {
    setPostsLoading: (state, action) => { state.loading = action.payload; },
    incrementPage: (state) => { state.page += 1; },
    addPostOptimistic: (state, action) => {
      const newPost = {
        id: `temp-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
        comments: [],
        _temp: true,
      };
      state.posts.unshift(newPost);
    },
    addPostFromSocket: (state, action) => {
      const newPost = action.payload;
      const existingIndex = state.posts.findIndex(
        (p) => p.id === newPost.id || (p._temp && p.caption === newPost.caption)
      );
      if (existingIndex !== -1)
        state.posts[existingIndex] = { ...newPost, _temp: false };
      else state.posts.unshift(newPost);
    },
    addCommentOptimistic: (state, action) => {
      const { postId, text, username } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const newComment = {
          id: `temp-${Date.now()}`,
          username,
          text,
          createdAt: new Date().toISOString(),
          _temp: true,
        };
        if (!post.comments) post.comments = [];
        post.comments.push(newComment);
      }
    },
    addCommentFromSocket: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;
      post.comments = post.comments?.filter(c => !(c._temp && c.text === comment.text)) || [];
      post.comments.push(comment);
    },
    updatePostLikes: (state, action) => {
      const { postId, likesCount, liked } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;
      post.likes = likesCount;
      post.liked = liked;
    },
    toggleLikeOptimistic: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
      }
    },
    setUploadProgress: (state, action) => { state.uploadProgress = action.payload; },
    setCurrentPost: (state, action) => { state.currentPost = action.payload; },
    clearPosts: (state) => {
      state.posts = [];
      state.loading = false;
      state.error = null;
      state.hasMore = true;
      state.page = 1;
      state.uploadProgress = 0;
      state.currentPost = null;
    },
    resetError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Upload post
      .addCase(uploadPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadPost.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        const newPost = action.payload;
        const existingIndex = state.posts.findIndex((p) => p._temp);
        if (existingIndex !== -1) state.posts[existingIndex] = newPost;
        else state.posts.unshift(newPost);
      })
      .addCase(uploadPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })

      // Fetch posts
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, hasMore, page } = action.payload;
        if (page === 1) state.posts = posts;
        else state.posts.push(...posts);
        state.hasMore = hasMore;
        state.page = page;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPostsLoading,
  incrementPage,
  addPostOptimistic,
  addPostFromSocket,
  toggleLikeOptimistic,
  addCommentOptimistic,
  setUploadProgress,
  setCurrentPost,
  updatePostLikes,
  addCommentFromSocket,
  clearPosts,
  resetError,
} = postsSlice.actions;

export default postsSlice.reducer;
