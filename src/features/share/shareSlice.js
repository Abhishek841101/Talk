// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Base URL for your backend
// const BASE_URL = "http://localhost:5000"; // change to your backend URL

// // ----------------------
// // Async Thunks
// // ----------------------

// // Send a post share
// export const sendShare = createAsyncThunk(
//   "share/sendShare",
//   async ({ senderId, receiverId, postId, message }, thunkAPI) => {
//     try {
//       const res = await fetch(`${BASE_URL}/share`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ senderId, receiverId, postId, message }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send share");
//       return data.share;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );

// // Fetch received shares for a user
// export const fetchReceivedShares = createAsyncThunk(
//   "share/fetchReceivedShares",
//   async (userId, thunkAPI) => {
//     try {
//       const res = await fetch(`${BASE_URL}/shares/${userId}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch shares");
//       return data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );

// // ----------------------
// // Slice
// // ----------------------
// const shareSlice = createSlice({
//   name: "share",
//   initialState: {
//     received: [],
//     sent: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Send share
//       .addCase(sendShare.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sendShare.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sent.push(action.payload);
//       })
//       .addCase(sendShare.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch received shares
//       .addCase(fetchReceivedShares.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchReceivedShares.fulfilled, (state, action) => {
//         state.loading = false;
//         state.received = action.payload;
//       })
//       .addCase(fetchReceivedShares.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default shareSlice.reducer;










// // src/features/share/shareSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Replace with your backend URL (must be public for mobile)
// const BASE_URL = "https://10.99.136.9:8000/api/share";

// // ----------------------
// // Async Thunks
// // ----------------------

// // Send a post share
// export const sendShare = createAsyncThunk(
//   "share/sendShare",
//   async ({ senderId, receiverId, postId, message }, thunkAPI) => {
//     try {
//       const res = await fetch(`${BASE_URL}/share`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ senderId, receiverId, postId, message }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send share");
//       return data.share;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );

// // Fetch received shares for current user
// export const fetchReceivedShares = createAsyncThunk(
//   "share/fetchReceivedShares",
//   async (userId, thunkAPI) => {
//     try {
//       const res = await fetch(`${BASE_URL}/shares/${userId}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch shares");
//       return data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );

// // ----------------------
// // Slice
// // ----------------------
// const shareSlice = createSlice({
//   name: "share",
//   initialState: {
//     received: [],
//     sent: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     addReceivedShare: (state, action) => {
//       state.received.unshift(action.payload);
//     },
//     addSentShare: (state, action) => {
//       state.sent.unshift(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(sendShare.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sendShare.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sent.unshift(action.payload);
//       })
//       .addCase(sendShare.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchReceivedShares.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchReceivedShares.fulfilled, (state, action) => {
//         state.loading = false;
//         state.received = action.payload;
//       })
//       .addCase(fetchReceivedShares.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { addReceivedShare, addSentShare } = shareSlice.actions;
// export default shareSlice.reducer;




// src/features/share/shareSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Replace with your backend URL (must be public for mobile)
const BASE_URL = "https://10.99.136.9:8000/api";

// ----------------------
// Async Thunks
// ----------------------

// Send a post share
export const sendShare = createAsyncThunk(
  "share/sendShare",
  async ({ senderId, receiverId, postId, message }, thunkAPI) => {
    try {
      // ✅ Log request before sending
      console.log("[sendShare] Sending data to backend:", {
        senderId,
        receiverId,
        postId,
        message,
      });

      const res = await fetch(`${BASE_URL}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId, postId, message }),
      });

      // ✅ Log response status
      console.log("[sendShare] Response status:", res.status);

      const data = await res.json();

      // ✅ Log response data
      console.log("[sendShare] Response data:", data);

      if (!res.ok) throw new Error(data.message || "Failed to send share");
      return data.share;
    } catch (err) {
      console.error("[sendShare] Error:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch received shares for current user
export const fetchReceivedShares = createAsyncThunk(
  "share/fetchReceivedShares",
  async (userId, thunkAPI) => {
    try {
      console.log("[fetchReceivedShares] Fetching shares for user:", userId);

      const res = await fetch(`${BASE_URL}/shares/${userId}`);

      console.log("[fetchReceivedShares] Response status:", res.status);

      const data = await res.json();

      console.log("[fetchReceivedShares] Response data:", data);

      if (!res.ok) throw new Error(data.message || "Failed to fetch shares");
      return data;
    } catch (err) {
      console.error("[fetchReceivedShares] Error:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ----------------------
// Slice
// ----------------------
const shareSlice = createSlice({
  name: "share",
  initialState: {
    received: [],
    sent: [],
    loading: false,
    error: null,
  },
  reducers: {
    addReceivedShare: (state, action) => {
      state.received.unshift(action.payload);
    },
    addSentShare: (state, action) => {
      state.sent.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendShare.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("[shareSlice] sendShare pending...");
      })
      .addCase(sendShare.fulfilled, (state, action) => {
        state.loading = false;
        state.sent.unshift(action.payload);
        console.log("[shareSlice] sendShare fulfilled:", action.payload);
      })
      .addCase(sendShare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("[shareSlice] sendShare rejected:", action.payload);
      })
      .addCase(fetchReceivedShares.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("[shareSlice] fetchReceivedShares pending...");
      })
      .addCase(fetchReceivedShares.fulfilled, (state, action) => {
        state.loading = false;
        state.received = action.payload;
        console.log("[shareSlice] fetchReceivedShares fulfilled:", action.payload);
      })
      .addCase(fetchReceivedShares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("[shareSlice] fetchReceivedShares rejected:", action.payload);
      });
  },
});

export const { addReceivedShare, addSentShare } = shareSlice.actions;
export default shareSlice.reducer;
