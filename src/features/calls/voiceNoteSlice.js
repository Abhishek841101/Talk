import { createSlice } from '@reduxjs/toolkit';

const voiceNoteSlice = createSlice({
  name: 'voiceNote',
  initialState: {
    recording: false,
    playing: false,
    currentNote: null,
    uploadStatus: 'idle', // 'pending' | 'uploaded' | 'failed'
    recordingTime: 0,
  },
  reducers: {
    startRecording: (state) => {
      state.recording = true;
      state.recordingTime = 0;
    },
    stopRecording: (state) => {
      state.recording = false;
    },
    updateRecordingTime: (state, action) => {
      state.recordingTime = action.payload;
    },
    sendVoiceNote: (state, action) => {
      state.uploadStatus = 'pending';
      state.currentNote = action.payload;
    },
    uploadSuccess: (state) => {
      state.uploadStatus = 'uploaded';
    },
    uploadFailed: (state) => {
      state.uploadStatus = 'failed';
    },
    playVoiceNote: (state, action) => {
      state.playing = true;
    },
    pauseVoiceNote: (state) => {
      state.playing = false;
    },
  },
});

export const {
  startRecording,
  stopRecording,
  updateRecordingTime,
  sendVoiceNote,
  uploadSuccess,
  uploadFailed,
  playVoiceNote,
  pauseVoiceNote,
} = voiceNoteSlice.actions;
export default voiceNoteSlice.reducer;