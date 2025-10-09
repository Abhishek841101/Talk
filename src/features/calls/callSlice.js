import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inCall: false,
  callType: null, // 'voice' | 'video'
  caller: null,
  callee: null,
  callStatus: 'idle', // 'idle' | 'ringing' | 'accepted' | 'ended'
  callDuration: 0,
  localStreamId: null, // store only stream id
  remoteStreamId: null,
  callLogs: [], // array of past calls
  callId: null, // unique call identifier
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startCall: (state, action) => {
      const { callType, caller, callee, callId } = action.payload;
      state.callType = callType;
      state.caller = caller;
      state.callee = callee;
      state.callStatus = 'ringing';
      state.inCall = false;
      state.callDuration = 0;
      state.callId = callId;
    },
    incomingCall: (state, action) => {
      const { callType, caller, callee, callId } = action.payload;
      state.callType = callType;
      state.caller = caller;
      state.callee = callee;
      state.callStatus = 'ringing';
      state.inCall = false;
      state.callDuration = 0;
      state.callId = callId;
    },
    acceptCall: (state) => {
      state.callStatus = 'accepted';
      state.inCall = true;
      state.callDuration = 0;
    },
    rejectCall: (state) => {
      // Save missed call log
      state.callLogs.push({
        type: 'missed',
        caller: state.caller,
        callee: state.callee,
        callType: state.callType,
        timestamp: Date.now(),
        duration: 0,
      });

      state.callStatus = 'ended';
      state.inCall = false;
      state.callType = null;
      state.caller = null;
      state.callee = null;
      state.callDuration = 0;
      state.localStreamId = null;
      state.remoteStreamId = null;
      state.callId = null;
    },
    endCall: (state, action) => {
      const duration = action.payload?.duration || state.callDuration;

      if (state.callStatus === 'accepted') {
        state.callLogs.push({
          type: 'outgoing',
          caller: state.caller,
          callee: state.callee,
          callType: state.callType,
          timestamp: Date.now(),
          duration,
        });
      } else if (state.callStatus === 'ringing') {
        state.callLogs.push({
          type: 'missed',
          caller: state.caller,
          callee: state.callee,
          callType: state.callType,
          timestamp: Date.now(),
          duration: 0,
        });
      }

      state.callStatus = 'ended';
      state.inCall = false;
      state.callType = null;
      state.caller = null;
      state.callee = null;
      state.callDuration = 0;
      state.localStreamId = null;
      state.remoteStreamId = null;
      state.callId = null;
    },
    updateCallDuration: (state, action) => {
      state.callDuration = action.payload;
    },
    setLocalStreamId: (state, action) => {
      state.localStreamId = action.payload;
    },
    setRemoteStreamId: (state, action) => {
      state.remoteStreamId = action.payload;
    },
    resetCall: (state) => {
      state.inCall = false;
      state.callType = null;
      state.caller = null;
      state.callee = null;
      state.callStatus = 'idle';
      state.callDuration = 0;
      state.localStreamId = null;
      state.remoteStreamId = null;
      state.callId = null;
    },
  },
});

export const {
  startCall,
  incomingCall,
  acceptCall,
  rejectCall,
  endCall,
  updateCallDuration,
  setLocalStreamId,
  setRemoteStreamId,
  resetCall,
} = callSlice.actions;

export default callSlice.reducer;
