// import { configureStore } from "@reduxjs/toolkit";
// import reelsReducer from "../features/reels/reelsSlice";

// export const store = configureStore({
//   reducer: { reels: reelsReducer },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;




// import { configureStore } from "@reduxjs/toolkit";

// // Slices
// import authReducer from "../features/auth/authSlice";
// import chatReducer from "../features/chat/chatSlice";
// import reelsReducer from "../features/reels/reelsSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     chat: chatReducer,
//     reels: reelsReducer,
//   },
// });






import { configureStore, combineReducers } from "@reduxjs/toolkit";

// slices
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import reelsReducer from "../features/reels/reelsSlice";
import contestsReducer from "../features/Contests/ContestsSlice";
import postsReducer from "../features/posts/postsSlice";
import profileReducer from "../features/profile/profileSlice";
import notificationReducer from '../features/notifications/notificationSlice';
import callReducer from '../features/calls/callSlice';
import voiceNoteReducer from '../features/calls/voiceNoteSlice';
import socketReducer from '../features/calls/socketSlice';



const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  reels: reelsReducer,
  contests: contestsReducer,
  profile: profileReducer,
  post:postsReducer,
  notifications: notificationReducer,
    // ✅ ADD NEW REDUCERS
    call: callReducer,
    voiceNote: voiceNoteReducer,
    socket: socketReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
