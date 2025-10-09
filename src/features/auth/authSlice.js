



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API = "http://10.189.33.9:8000/api/user";

// // Login user
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ email, password }, thunkAPI) => {
//     try {
//       console.log("[DEBUG] loginUser payload:", { email, password });
//       const res = await axios.post(`${API}/login`, { email, password });
//       console.log("[DEBUG] loginUser response:", res.data);
//       return res.data; // { user, token }
//     } catch (err) {
//       console.error("[ERROR] loginUser:", err.response?.data || err.message);
//       return thunkAPI.rejectWithValue(err.response?.data?.msg || "Login failed");
//     }
//   }
// );

// // Register user
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async ({ username, email, password }, thunkAPI) => {
//     try {
//       console.log("[DEBUG] registerUser payload:", { username, email, password });
//       const res = await axios.post(`${API}/register`, { username, email, password });
//       console.log("[DEBUG] registerUser response:", res.data);
//       return res.data; // { user, token }
//     } catch (err) {
//       console.error("[ERROR] registerUser:", err.response?.data || err.message);
//       return thunkAPI.rejectWithValue(err.response?.data?.msg || "Registration failed");
//     }
//   }
// );

// const initialState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       console.log("[DEBUG] user logged out");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         console.log("[DEBUG] loginUser pending");
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         state.error = null;
//         console.log("[DEBUG] loginUser fulfilled:", action.payload);
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         console.log("[DEBUG] loginUser rejected:", action.payload);
//       })
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         console.log("[DEBUG] registerUser pending");
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         state.error = null;
//         console.log("[DEBUG] registerUser fulfilled:", action.payload);
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         console.log("[DEBUG] registerUser rejected:", action.payload);
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

















// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initSocket, disconnectSocket } from "../../lib/socket"; // 👈 import socket utils

const API = "http://10.150.225.9:8000/api/user";

// ✅ Helper to save auth data
const saveAuthData = async (user, token) => {
  try {
    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    }
    if (token) {
      await AsyncStorage.setItem("token", token);
    }
  } catch (err) {
    console.error("Failed to save auth data:", err);
  }
};

// ✅ Helper to clear auth data
const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  } catch (err) {
    console.error("Failed to clear auth data:", err);
  }
};

// ✅ Load user from AsyncStorage
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      if (token && user) {
        // 🔗 connect socket after restoring session
        setTimeout(() => {
          initSocket();
        }, 100);
        return { token, user: JSON.parse(user) };
      }
      return thunkAPI.rejectWithValue("No saved user found");
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load user");
    }
  }
);

// ✅ Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      const { user, token } = res.data;
      await saveAuthData(user, token);

      // 🔗 connect socket after login
      setTimeout(() => {
        initSocket();
      }, 100);

      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Login failed"
      );
    }
  }
);

// ✅ Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/register`, {
        username,
        email,
        password,
      });
      const { user, token } = res.data;
      await saveAuthData(user, token);

      // 🔗 connect socket after register
      setTimeout(() => {
        initSocket();
      }, 100);

      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Registration failed"
      );
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthData();
      disconnectSocket(); // 🔗 disconnect socket on logout
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      AsyncStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Load from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
