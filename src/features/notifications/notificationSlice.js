import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    // ✅ EXISTING CHAT NOTIFICATIONS
    chatNotifications: [],
    unreadCount: 0,
    
    // ✅ NEW: CALL NOTIFICATIONS
    callNotifications: [],
    missedCalls: [],
    incomingCall: null, // Current incoming call data
    
    // ✅ NEW: VOICE NOTE NOTIFICATIONS
    voiceNoteNotifications: [],
    
    // ✅ NOTIFICATION SETTINGS
    settings: {
      callRingtone: true,
      callVibration: true,
      pushNotifications: true,
      voiceNotePreviews: true,
      silentMode: false,
    },
    
    // ✅ PUSH NOTIFICATION TOKENS
    fcmToken: null,
    apnsToken: null,
  },
  reducers: {
    // ✅ EXISTING CHAT ACTIONS (modify if needed)
    addChatNotification: (state, action) => {
      state.chatNotifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.chatNotifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    clearAllNotifications: (state) => {
      state.chatNotifications = [];
      state.unreadCount = 0;
    },

    // ✅ NEW: CALL NOTIFICATION ACTIONS
    incomingCallNotification: (state, action) => {
      state.incomingCall = action.payload;
      
      // Add to call notifications
      state.callNotifications.unshift({
        ...action.payload,
        type: 'incoming_call',
        timestamp: Date.now(),
        read: false,
        id: `call_${Date.now()}`,
      });
    },

    missedCallNotification: (state, action) => {
      const missedCall = {
        ...action.payload,
        type: 'missed_call',
        timestamp: Date.now(),
        read: false,
        id: `missed_${Date.now()}`,
      };
      
      state.missedCalls.unshift(missedCall);
      state.callNotifications.unshift(missedCall);
      
      // Clear current incoming call
      state.incomingCall = null;
    },

    answeredCallNotification: (state, action) => {
      state.callNotifications.unshift({
        ...action.payload,
        type: 'answered_call',
        timestamp: Date.now(),
        read: true,
        id: `answered_${Date.now()}`,
      });
      
      // Clear current incoming call
      state.incomingCall = null;
    },

    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },

    // ✅ NEW: VOICE NOTE NOTIFICATION ACTIONS
    newVoiceNoteNotification: (state, action) => {
      state.voiceNoteNotifications.unshift({
        ...action.payload,
        type: 'voice_note',
        timestamp: Date.now(),
        read: false,
        id: `voice_${Date.now()}`,
      });
      
      // Also add to general chat notifications if needed
      state.chatNotifications.unshift({
        ...action.payload,
        type: 'voice_note_message',
        timestamp: Date.now(),
        read: false,
        id: `voice_msg_${Date.now()}`,
      });
      
      if (!action.payload.silent) {
        state.unreadCount += 1;
      }
    },

    voiceNotePlayed: (state, action) => {
      const voiceNoteId = action.payload;
      const note = state.voiceNoteNotifications.find(n => n.id === voiceNoteId);
      if (note) {
        note.played = true;
      }
    },

    // ✅ NOTIFICATION SETTINGS ACTIONS
    updateNotificationSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    toggleSilentMode: (state) => {
      state.settings.silentMode = !state.settings.silentMode;
    },

    // ✅ PUSH NOTIFICATION ACTIONS
    setFCMToken: (state, action) => {
      state.fcmToken = action.payload;
    },

    setAPNSToken: (state, action) => {
      state.apnsToken = action.payload;
    },

    // ✅ CLEANUP ACTIONS
    clearCallNotifications: (state) => {
      state.callNotifications = [];
    },

    clearMissedCalls: (state) => {
      state.missedCalls = [];
    },

    clearVoiceNoteNotifications: (state) => {
      state.voiceNoteNotifications = [];
    },

    // ✅ MARK ALL AS READ
    markAllAsRead: (state) => {
      state.chatNotifications.forEach(notification => {
        notification.read = true;
      });
      state.callNotifications.forEach(notification => {
        notification.read = true;
      });
      state.voiceNoteNotifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
  },
});

export const {
  // ✅ EXISTING EXPORTS
  addChatNotification,
  markAsRead,
  clearAllNotifications,
  markAllAsRead,
  
  // ✅ NEW CALL EXPORTS
  incomingCallNotification,
  missedCallNotification,
  answeredCallNotification,
  clearIncomingCall,
  clearCallNotifications,
  clearMissedCalls,
  
  // ✅ NEW VOICE NOTE EXPORTS
  newVoiceNoteNotification,
  voiceNotePlayed,
  clearVoiceNoteNotifications,
  
  // ✅ SETTINGS EXPORTS
  updateNotificationSettings,
  toggleSilentMode,
  
  // ✅ PUSH NOTIFICATION EXPORTS
  setFCMToken,
  setAPNSToken,
  
} = notificationSlice.actions;

// ✅ SELECTORS
export const selectAllNotifications = (state) => {
  const { chatNotifications, callNotifications, voiceNoteNotifications } = state.notifications;
  return [...callNotifications, ...voiceNoteNotifications, ...chatNotifications]
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectMissedCallsCount = (state) => state.notifications.missedCalls.length;
export const selectIncomingCall = (state) => state.notifications.incomingCall;
export const selectNotificationSettings = (state) => state.notifications.settings;
export const selectFCMToken = (state) => state.notifications.fcmToken;

export default notificationSlice.reducer;