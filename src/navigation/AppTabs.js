// // src/navigation/AppTabs.js
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

// // Screens
// import HomeStack from "./HomeStack";
// import ContestsStack from "./ContestsStack";  // ✅ Updated
// import ReelsScreen from "../screens/reels/ReelsScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import UploadScreen from "../screens/reels/UploadReelScreen";

// const Tab = createBottomTabNavigator();

// export default function AppTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarActiveTintColor: "#000",
//         tabBarInactiveTintColor: "gray",
//       }}
//     >
//       {/* Home */}
//       <Tab.Screen
//         name="Home"
//         component={HomeStack}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={24} color={color} />
//           ),
//         }}
//       />

//       {/* Contests */}
//       <Tab.Screen
//         name="Contests"
//         component={ContestsStack}   // ✅ Changed
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Feather name="award" size={24} color={color} />
//           ),
//         }}
//       />

//       {/* Reels */}
//       <Tab.Screen
//         name="Reels"
//         component={ReelsScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="video-library" size={24} color={color} />
//           ),
//         }}
//       />

//       {/* Upload */}
//       <Tab.Screen
//         name="Upload"
//         component={UploadScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="cloud-upload-outline" size={26} color={color} />
//           ),
//         }}
//       />

//       {/* Profile */}
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Feather name="user" size={24} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }








// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeStack from "./HomeStack";
// import ContestsStack from "../ContestsStack";
// import ProfileStack from "../ProfileStack";
// import ReelsScreen from "../screens/ReelsScreen";
// import UploadScreen from "../screens/UploadScreen";
// import VoiceStack from "../VoiceStack";
// import VoiceMicButton from "../components/VoiceMicButton";
// import { View } from "react-native";
// import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

// const Tab = createBottomTabNavigator();

// // Global wrapper to add VoiceMicButton to every screen
// const ScreenWithMic = ({ children }) => {
//   return (
//     <View style={{ flex: 1 }}>
//       {children}
//       <VoiceMicButton /> {/* ✅ always inside navigation context */}
//     </View>
//   );
// };

// export default function AppTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarActiveTintColor: "#000",
//         tabBarInactiveTintColor: "gray",
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }}
//       >
//         {() => (
//           <ScreenWithMic>
//             <HomeStack />
//           </ScreenWithMic>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="Voice"
//         options={{ tabBarIcon: ({ color }) => <Ionicons name="mic" size={24} color={color} /> }}
//       >
//         {() => (
//           <ScreenWithMic>
//             <VoiceStack />
//           </ScreenWithMic>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="Contests"
//         options={{ tabBarIcon: ({ color }) => <Feather name="award" size={24} color={color} /> }}
//       >
//         {() => (
//           <ScreenWithMic>
//             <ContestsStack />
//           </ScreenWithMic>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="Reels"
//         options={{ tabBarIcon: ({ color }) => <MaterialIcons name="video-library" size={24} color={color} /> }}
//       >
//         {() => (
//           <ScreenWithMic>
//             <ReelsScreen />
//           </ScreenWithMic>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="Upload"
//         options={{ tabBarIcon: ({ color }) => <Ionicons name="cloud-upload-outline" size={26} color={color} /> }}
//       >
//         {() => (
//           <ScreenWithMic>
//             <UploadScreen />
//           </ScreenWithMic>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="ProfileStack"
//         options={{ tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} /> }}
//       >
//         {() => (
//           <ScreenWithMic>
//             <ProfileStack />
//           </ScreenWithMic>
//         )}
//       </Tab.Screen>
//     </Tab.Navigator>
//   );
// }




// src/navigation/AppTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Stacks
import HomeStack from "./HomeStack";

import ProfileStack from "./ProfileStack";

// import UploadStack from "./UploadStack";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

    


      {/* <Tab.Screen
        name="UploadTab"
        component={UploadStack}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="cloud-upload-outline" size={26} color={color} />,
        }}
      /> */}

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
