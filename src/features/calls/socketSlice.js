import { createSlice } from '@reduxjs/toolkit';

const MAX_EVENTS = 50; // store only last 50 socket events

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    connected: false,
    events: [],
  },
  reducers: {
    socketConnected: (state) => {
      state.connected = true;
    },
    socketDisconnected: (state) => {
      state.connected = false;
    },
    socketEventReceived: (state, action) => {
      const eventWithTimestamp = {
        ...action.payload,
        receivedAt: Date.now(),
      };

      state.events.push(eventWithTimestamp);

      // Keep only last MAX_EVENTS
      if (state.events.length > MAX_EVENTS) {
        state.events = state.events.slice(state.events.length - MAX_EVENTS);
      }
    },
    clearSocketEvents: (state) => {
      state.events = [];
    },
  },
});

export const { socketConnected, socketDisconnected, socketEventReceived, clearSocketEvents } =
  socketSlice.actions;

export default socketSlice.reducer;
