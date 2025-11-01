// ✅ src/navigation/MediaStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MediaFeedScreen from "../screens/media/MediaFeedScreen";
import MediaPlayerScreen from "../screens/media/MediaPlayerScreen";
// import MediaCreateScreen from "../screens/media/MediaCreateScreen";

const Stack = createNativeStackNavigator();

export default function MediaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Media Home Feed */}
      <Stack.Screen name="MediaFeed" component={MediaFeedScreen} />

      {/* Single Player Screen */}
      <Stack.Screen name="MediaPlayer" component={MediaPlayerScreen} />

      {/* Create / Upload Media */}
      {/* <Stack.Screen name="MediaCreateScreen" component={MediaCreateScreen} /> */}
    </Stack.Navigator>
  );
}
