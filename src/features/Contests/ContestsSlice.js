




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// const API = "http://10.121.42.9:8000/api";

// // Fetch all contests
// export const fetchContests = createAsyncThunk(
//   "contests/fetchContests",
//   async (_, thunkAPI) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(`${API}/user/contests`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return Array.isArray(res.data) ? res.data : res.data.contests || [];
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch contests");
//     }
//   }
// );

// // Fetch single contest
// export const fetchContestById = createAsyncThunk(
//   "contests/fetchContestById",
//   async (id, thunkAPI) => {
//     if (!id) return thunkAPI.rejectWithValue("Contest ID is required");
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(`${API}/user/contests/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch contest");
//     }
//   }
// );

// // Create contest
// export const createContestAPI = createAsyncThunk(
//   "contests/createContest",
//   async (contestData, thunkAPI) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.post(`${API}/user/contests/create`, contestData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create contest");
//     }
//   }
// );

// // Join contest
// export const joinContestAPI = createAsyncThunk(
//   "contests/joinContest",
//   async (contestId, thunkAPI) => {
//     if (!contestId) return thunkAPI.rejectWithValue("Contest ID is required");
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.post(`${API}/user/contests/join/${contestId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data.contest._id;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to join contest");
//     }
//   }
// );

// // Fetch participants
// export const fetchParticipants = createAsyncThunk(
//   "contests/fetchParticipants",
//   async (contestId, thunkAPI) => {
//     if (!contestId) return thunkAPI.rejectWithValue("Contest ID is required");
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(`${API}/user/contests/${contestId}/participants`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data.participants || [];
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch participants");
//     }
//   }
// );

// // Slice
// const contestsSlice = createSlice({
//   name: "contests",
//   initialState: {
//     contests: [],
//     contest: null,
//     listLoading: false,
//     detailLoading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchContests.pending, (state) => { state.listLoading = true; state.error = null; })
//       .addCase(fetchContests.fulfilled, (state, action) => { state.listLoading = false; state.contests = action.payload; })
//       .addCase(fetchContests.rejected, (state, action) => { state.listLoading = false; state.error = action.payload; })

//       .addCase(fetchContestById.pending, (state) => { state.detailLoading = true; state.error = null; })
//       .addCase(fetchContestById.fulfilled, (state, action) => { state.detailLoading = false; state.contest = action.payload; })
//       .addCase(fetchContestById.rejected, (state, action) => { state.detailLoading = false; state.error = action.payload; })

//       .addCase(createContestAPI.pending, (state) => { state.listLoading = true; state.error = null; })
//       .addCase(createContestAPI.fulfilled, (state, action) => { state.listLoading = false; state.contests.unshift(action.payload); })
//       .addCase(createContestAPI.rejected, (state, action) => { state.listLoading = false; state.error = action.payload; })

//       .addCase(joinContestAPI.fulfilled, (state, action) => {
//         const contest = state.contests.find((c) => c._id === action.payload);
//         if (contest) {
//           if (!Array.isArray(contest.participants)) contest.participants = [];
//           contest.participants.push("joined"); // replace with userId later
//         }
//       })
//       .addCase(joinContestAPI.rejected, (state, action) => { state.error = action.payload; })

//       .addCase(fetchParticipants.fulfilled, (state, action) => {
//         if (state.contest) state.contest.participantsList = action.payload;
//       })
//       .addCase(fetchParticipants.rejected, (state, action) => { state.error = action.payload; });
//   },
// });

// // ✅ Export only default reducer (thunks are already named exports above)
// export default contestsSlice.reducer;







import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "http://10.121.42.9:8000/api";

// ================== Fetch all contests ==================
export const fetchContests = createAsyncThunk(
  "contests/fetchContests",
  async (_, thunkAPI) => {
    try {
      console.log("🔥 API /user/contests response:", res.data);

      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/user/contests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Array.isArray(res.data) ? res.data : res.data.contests || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch contests"
      );
    }
  }
);

// ================== Fetch single contest ==================
export const fetchContestById = createAsyncThunk(
  "contests/fetchContestById",
  async (id, thunkAPI) => {
    if (!id) return thunkAPI.rejectWithValue("Contest ID is required");
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/user/contests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch contest"
      );
    }
  }
);

// ================== Fetch all users ==================
export const fetchAllUsers = createAsyncThunk(
  "contests/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API}/user/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // returns array of users
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ================== Create contest ==================
export const createContestAPI = createAsyncThunk(
  "contests/createContest",
  async (contestData, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(`${API}/user/contests/create`, contestData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create contest"
      );
    }
  }
);

// ================== Join contest (user self) ==================
export const joinContestAPI = createAsyncThunk(
  "contests/joinContest",
  async ({ contestId, formData }, thunkAPI) => {
    if (!contestId) return thunkAPI.rejectWithValue("Contest ID is required");
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(`${API}/user/contests/join/${contestId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to join contest"
      );
    }
  }
);

// ================== Add participant (admin only) ==================
export const addParticipantAPI = createAsyncThunk(
  "contests/addParticipant",
  async ({ contestId, userId }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API}/user/contests/${contestId}/add-participant`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // updated contest
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add participant"
      );
    }
  }
);

// ================== Promote participant to admin (admin only) ==================
export const promoteAdminAPI = createAsyncThunk(
  "contests/promoteAdmin",
  async ({ contestId, userId }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API}/user/contests/${contestId}/promote-admin`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // updated contest
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to promote admin"
      );
    }
  }
);

// ================== Fetch user joined contests ==================
export const fetchUserJoinedContests = createAsyncThunk(
  "contests/fetchUserJoinedContests",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const res = await axios.get(`${API}/user/contests/my`, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ================== Leaderboard ==================
export const fetchContestLeaderboard = createAsyncThunk(
  "contests/fetchContestLeaderboard",
  async (contestId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const res = await axios.get(
        `${API}/user/contests/entry/leaderboard/${contestId}`,
        { headers: { Authorization: `Bearer ${state.auth.token}` } }
      );

      const sorted = res.data.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      let rank = 1;
      const leaderboard = sorted.map((entry, i) => {
        const prevLikes = i > 0 ? sorted[i - 1].likes : null;
        const entryRank = i > 0 && entry.likes === prevLikes ? sorted[i - 1].rank : rank;
        rank++;
        return { ...entry, rank: entryRank };
      });

      return leaderboard;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch leaderboard"
      );
    }
  }
);

// ================== Like contest entry ==================
export const likeContestEntry = createAsyncThunk(
  "contests/likeContestEntry",
  async (entryId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const res = await axios.post(
        `${API}/user/contests/entry/${entryId}/like`,
        {},
        { headers: { Authorization: `Bearer ${state.auth.token}` } }
      );
      return { entryId, likes: res.data.likes };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to like entry"
      );
    }
  }
);

// ================== Contests slice ==================
const contestsSlice = createSlice({
  name: "contests",
  initialState: {
    contests: [],
    contest: null,
    listLoading: false,
    detailLoading: false,
    error: null,
    userJoinedContests: [],
    leaderboard: [],
    leaderboardLoading: false,
    allUsers: [],
    allUsersLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch contests
      .addCase(fetchContests.pending, (state) => { state.listLoading = true; state.error = null; })
      .addCase(fetchContests.fulfilled, (state, action) => { state.listLoading = false; state.contests = action.payload; })
      .addCase(fetchContests.rejected, (state, action) => { state.listLoading = false; state.error = action.payload; })

      // Fetch single contest
      .addCase(fetchContestById.pending, (state) => { state.detailLoading = true; state.error = null; })
      .addCase(fetchContestById.fulfilled, (state, action) => { state.detailLoading = false; state.contest = action.payload; })
      .addCase(fetchContestById.rejected, (state, action) => { state.detailLoading = false; state.error = action.payload; })

      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => { state.allUsersLoading = true; state.error = null; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.allUsersLoading = false; state.allUsers = action.payload || []; })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.allUsersLoading = false; state.error = action.payload; })

      // Create contest
      .addCase(createContestAPI.pending, (state) => { state.listLoading = true; state.error = null; })
      .addCase(createContestAPI.fulfilled, (state, action) => { state.listLoading = false; if(action.payload) state.contests.unshift(action.payload); })
      .addCase(createContestAPI.rejected, (state, action) => { state.listLoading = false; state.error = action.payload; })

      // Join contest
      .addCase(joinContestAPI.fulfilled, (state, action) => {
        const contestId = action.payload?.entry?.contest;
        const userId = action.payload?.entry?.user;
        const contestType = action.payload?.contestType;
        const isAdmin = action.payload?.isAdmin;

        if (contestId && userId) {
          const contest = state.contests.find(c => c._id === contestId);
          if (contest) {
            if (!Array.isArray(contest.participants)) contest.participants = [];
            if (!contest.participants.includes(userId)) contest.participants.push(userId);

            if (contestType === "group" && isAdmin) {
              if (!Array.isArray(contest.admins)) contest.admins = [];
              if (!contest.admins.includes(userId)) contest.admins.push(userId);
            }
          }
        }
      })

      // Add participant (admin only)
      .addCase(addParticipantAPI.fulfilled, (state, action) => {
        const updatedContest = action.payload;
        const idx = state.contests.findIndex(c => c._id === updatedContest._id);
        if (idx >= 0) state.contests[idx] = updatedContest;
        if (state.contest && state.contest._id === updatedContest._id) state.contest = updatedContest;
      })

      // Promote admin
      .addCase(promoteAdminAPI.fulfilled, (state, action) => {
        const updatedContest = action.payload;
        const idx = state.contests.findIndex(c => c._id === updatedContest._id);
        if (idx >= 0) state.contests[idx] = updatedContest;
        if (state.contest && state.contest._id === updatedContest._id) state.contest = updatedContest;
      })

      // Fetch user joined contests
      .addCase(fetchUserJoinedContests.fulfilled, (state, action) => { state.userJoinedContests = action.payload; })

      // Leaderboard
      .addCase(fetchContestLeaderboard.pending, (state) => { state.leaderboardLoading = true; state.error = null; })
      .addCase(fetchContestLeaderboard.fulfilled, (state, action) => { state.leaderboardLoading = false; state.leaderboard = action.payload; })
      .addCase(fetchContestLeaderboard.rejected, (state, action) => { state.leaderboardLoading = false; state.error = action.payload; })

      // Like contest entry
      .addCase(likeContestEntry.fulfilled, (state, action) => {
        const { entryId, likes } = action.payload;
        state.leaderboard = state.leaderboard.map(entry => entry._id === entryId ? { ...entry, likes } : entry);
        const sorted = [...state.leaderboard].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        let rank = 1;
        state.leaderboard = sorted.map((entry, i) => {
          const prevLikes = i > 0 ? sorted[i - 1].likes : null;
          const entryRank = i > 0 && entry.likes === prevLikes ? sorted[i - 1].rank : rank;
          rank++;
          return { ...entry, rank: entryRank };
        });
      });
  },
});

export default contestsSlice.reducer;
