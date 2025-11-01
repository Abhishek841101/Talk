

// src/navigation/AppTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Stacks
import HomeStack from "./HomeStack";
import ReelsStack from "./ReelsStack";
import ProfileStack from "./ProfileStack";

import UploadStack from "./UploadStack";
import MediaStack from "./MediaStack"; 
// import ContestsStack from "./ContestsStack";
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
 {/* Contests
      // <Tab.Screen
      //   name="Contests"
      //   component={ContestsStack}
      //   options={{
      //     tabBarIcon: ({ color }) => (
      //       <Feather name="award" size={24} color={color} />
      //     ),
      //   }}
      // /> */}
    
      <Tab.Screen
        name="ReelsTab"
        component={ReelsStack}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="video-library" size={24} color={color} />,
        }}
      />

{/* ✅ NEW MEDIA SECTION */}
      <Tab.Screen
        name="MediaTab"
        component={MediaStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="podcasts" size={26} color={color} />
          ),
        }}
      />
     

      <Tab.Screen
        name="UploadTab"
        component={UploadStack}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="cloud-upload-outline" size={26} color={color} />,
        }}
      />

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
