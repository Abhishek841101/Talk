
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../screens/HomeScreen';
// import ChatListScreen from '../screens/chat/ChatListScreen';
// import ChatScreen from '../screens/chat/ChatScreen';
// import VoiceCallScreen from '../screens/call/VoiceCallScreen';
// import VideoCallScreen from '../screens/call/VideoCallScreen';

// const Stack = createNativeStackNavigator();

// export default function HomeStack() {
//   return (
    // <Stack.Navigator screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="Home" component={HomeScreen} />
    //   <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
    //   <Stack.Screen name="ChatScreen" component={ChatScreen} />
    //   <Stack.Screen name="VoiceCallScreen" component={VoiceCallScreen} />
    //   <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
//     </Stack.Navigator>
//   );
// }







// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../screens/home/HomeScreen';
// import ChatListScreen from '../screens/chat/ChatListScreen';
// import ChatScreen from '../screens/chat/ChatScreen';
// import VoiceCallScreen from '../screens/call/VoiceCallScreen';
// import VideoCallScreen from '../screens/call/VideoCallScreen';
// import IncomingCallModal from '../screens/call/IncomingCallModal';
// import OutgoingCallModal from '../screens/call/OutgoingCallModal';

// const Stack = createNativeStackNavigator();

// export default function HomeStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="HomeScreen" component={HomeScreen} />
//       <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
//       <Stack.Screen name="ChatScreen" component={ChatScreen} />
//       <Stack.Screen name="VoiceCallScreen" component={VoiceCallScreen} />
//       <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
//       <Stack.Screen name="IncomingCallModal" component={IncomingCallModal} />
//       <Stack.Screen name="OutgoingCallModal"component={OutgoingCallModal} />
//     </Stack.Navigator>
//   );
// }






import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
// import VoiceCallScreen from '../screens/call/VoiceCallScreen';
// import VideoCallScreen from '../screens/call/VideoCallScreen';
import UserListScreen from '../screens/chat/UserListScreen';
import CreateGroupScreen from '../screens/chat/CreateGroupScreen';
// import StoryViewerScreen from '../screens/StoryViewerScreen';
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      {/* <Stack.Screen name="VoiceCallScreen" component={VoiceCallScreen} /> */}
      {/* <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} /> */}
      <Stack.Screen name="UserListScreen" component={UserListScreen} />
<Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} />
     {/* <Stack.Screen name="StoryViewer" component={StoryViewerScreen} /> */}
    </Stack.Navigator>
  );
}
