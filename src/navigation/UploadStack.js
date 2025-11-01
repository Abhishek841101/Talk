
// ✅ src/navigation/UploadStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UploadScreen from "../screens/posts/UploadScreen";
import PostCreateScreen from "../screens/posts/PostCreateScreen";
import UploadReelScreen from "../screens/reels/UploadReelScreen";

// ✅ Add this
import MediaCreateScreen from "../screens/media/MediaCreateScreen";

const Stack = createNativeStackNavigator();

export default function UploadStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UploadScreen" component={UploadScreen} />

      {/* Post */}
      <Stack.Screen name="PostCreateScreen" component={PostCreateScreen} />

      {/* Reel */}
      <Stack.Screen
        name="UploadReel"
        component={UploadReelScreen}
        options={{ title: "Upload Reel" }}
      />

      {/* ✅ Media */}
      <Stack.Screen
        name="MediaCreateScreen"
        component={MediaCreateScreen}
        options={{ title: "Upload Media" }}
      />

    </Stack.Navigator>
  );
}
