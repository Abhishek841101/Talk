// import { createSlice, nanoid } from '@reduxjs/toolkit';

// const postsSlice = createSlice({
//   name: 'posts',
//   initialState: {
//     posts: [],
//   },
//   reducers: {
//     addPost: (state, action) => {
//       state.posts.unshift({
//         id: nanoid(),
//         ...action.payload,
//         createdAt: new Date().toISOString(),
//         likes: 0,
//         liked: false,
//         comments: [],
//          user: {
//         username: 'john',
//         avatar: 'https://i.pravatar.cc/150?img=1',
//       },
//       });
//     },
//     toggleLike: (state, action) => {
//       const post = state.posts.find((p) => p.id === action.payload);
//       if (post) {
//         post.liked = !post.liked;
//         post.likes += post.liked ? 1 : -1;
//       }
//     },
//       addComment: (state, action) => {
//       const { postId, text, username } = action.payload;
//       const post = state.posts.find((p) => p.id === postId);
//       if (post) {
//         post.comments.push({
//           id: nanoid(),
//           text,
//           username,
//           createdAt: new Date().toISOString(),
//         });
//       }
//     },
//   },
// });

// export const { addPost, toggleLike, addComment } = postsSlice.actions;
// export default postsSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch posts from backend
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token; // get user token if required
      const res = await axios.get("http://10.189.33.9:8000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // should be array of posts
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching posts");
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],       // real posts from backend
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: you can still add actions for local updates
    addPostLocal: (state, action) => {
      state.posts.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addPostLocal } = postsSlice.actions;
export default postsSlice.reducer;
 