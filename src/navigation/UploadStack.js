// src/navigation/UploadStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UploadScreen from "../screens/posts/UploadScreen";
import PostCreateScreen from "../screens/posts/PostCreateScreen";
import UploadReelScreen from "../screens/reels/UploadReelScreen";

const Stack = createNativeStackNavigator();

export default function UploadStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UploadScreen" component={UploadScreen} />
      <Stack.Screen name="PostCreateScreen" component={PostCreateScreen} />
      <Stack.Screen
        name="UploadReel"
        component={UploadReelScreen}
        options={{
          title: "Upload Reel",
        }}
      />
    </Stack.Navigator>
  );
}
