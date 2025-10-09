// src/navigation/types.js

// Main navigation routes
export const MAIN_ROUTES = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  CHAT: 'Chat',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

// Chat navigation routes
export const CHAT_ROUTES = {
  CHAT_LIST: 'ChatList',
  CHAT_SCREEN: 'ChatScreen',
  NEW_CHAT: 'NewChat',
};

// Call navigation routes
export const CALL_ROUTES = {
  CALL_SCREEN: 'CallScreen',
  CALLING_SCREEN: 'CallingScreen',
  INCOMING_CALL: 'IncomingCall',
};

// Tab navigation
export const TAB_ROUTES = {
  HOME_TAB: 'HomeTab',
  CHAT_TAB: 'ChatTab',
  PROFILE_TAB: 'ProfileTab',
};

// Root navigation stack
export const ROOT_STACK = {
  AUTH: 'AuthStack',
  MAIN: 'MainStack',
  CALL: 'CallStack',
};

// Safe navigation helper function
export const safeNavigate = (navigation, route, params = {}) => {
  if (navigation && typeof navigation.navigate === 'function') {
    navigation.navigate(route, params);
  } else {
    console.warn('Navigation not available');
  }
};

// Safe navigation with reset (for post-login, etc.)
export const safeReset = (navigation, routes) => {
  if (navigation && typeof navigation.reset === 'function') {
    navigation.reset({
      index: 0,
      routes: routes,
    });
  } else {
    console.warn('Navigation reset not available');
  }
};

// Safe go back
export const safeGoBack = (navigation) => {
  if (navigation && typeof navigation.goBack === 'function') {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If can't go back, navigate to a safe screen
      navigation.navigate(MAIN_ROUTES.HOME);
    }
  }
};

// Navigation prop type for component prop validation
export const navigationPropTypes = {
  navigate: () => {},
  goBack: () => {},
  reset: () => {},
  dispatch: () => {},
  setOptions: () => {},
  addListener: () => {},
  removeListener: () => {},
  isFocused: () => false,
  canGoBack: () => false,
};

export default {
  MAIN_ROUTES,
  CHAT_ROUTES,
  CALL_ROUTES,
  TAB_ROUTES,
  ROOT_STACK,
  safeNavigate,
  safeReset,
  safeGoBack,
  navigationPropTypes,
};