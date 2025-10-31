// src/navigation/LiveStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LiveFeedScreen from "../screens/live/LiveFeedScreen";
import LiveDetailScreen from "../screens/live/LiveDetailScreen";
// import StartLiveScreen from "../screens/live/StartLiveScreen";
// import JoinLiveScreen from "../screens/live/JoinLiveScreen";

const Stack = createNativeStackNavigator();

const LiveStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LiveFeedScreen"
      screenOptions={{
        headerShown: false, // hides the default header for a clean look
        animation: "slide_from_right",
      }}
    >
      {/* Feed showing all live and upcoming streams */}
      <Stack.Screen
        name="LiveFeedScreen"
        component={LiveFeedScreen}
        options={{ title: "Live Feed" }}
      />

      {/* Live Detail: plays selected live stream */}
      <Stack.Screen
        name="LiveDetailScreen"
        component={LiveDetailScreen}
        options={{ title: "Live Stream" }}
      />

      {/* Screen to start your own live session */}
      {/* <Stack.Screen
        name="StartLiveScreen"
        component={StartLiveScreen}
        options={{ title: "Start Live" }}
      /> */}

      {/* Screen to join someone’s live session */}
      {/* <Stack.Screen
        name="JoinLiveScreen"
        component={JoinLiveScreen}
        options={{ title: "Join Live" }}
      /> */}
    </Stack.Navigator>
  );
};

export default LiveStack;
