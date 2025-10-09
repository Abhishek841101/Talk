// src/navigation/ProfileStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import FollowersModal from "../screens/profile/FollowesModal";
// import FollowersScreen from "../screens/FollowersScreen";
// import FollowingScreen from "../screens/FollowingScreen";
// import FollowersModal from "../screens/FollowesModal";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false, // agar chahiye toh false rakho
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      {/* <Stack.Screen name="Followers" component={FollowersScreen} /> */}
      {/* <Stack.Screen name="Following" component={FollowingScreen} /> */}
      <Stack.Screen name='FollowersModal' component={FollowersModal}/>
    </Stack.Navigator>
  );
}
