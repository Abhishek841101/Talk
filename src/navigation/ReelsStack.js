// src/navigation/ReelsStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReelsScreen from "../screens/reels/ReelsScreen";
import UploadReelScreen from "../screens/reels/UploadReelScreen";
// import { Ionicons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
const Stack = createNativeStackNavigator();

export default function ReelsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "white",
        headerTitleStyle: { color: "white" },
      }}
    >
      <Stack.Screen
        name="ReelsHome"
        component={ReelsScreen}
        options={({ navigation }) => ({
          title: "Reels",
          headerRight: () => (
            <Ionicons
              name="cloud-upload-outline"
              size={28}
              color="white"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("UploadReel")}
            />
          ),
        })}
      />
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
