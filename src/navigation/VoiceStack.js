// src/navigation/VoiceStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Voice-related screens/components
import VoiceController from "../components/VoiceController";
import VoiceMicButton from "../components/VoiceMicButton";
import VoiceTranscript from "../components/VoiceTranscript";

const Stack = createNativeStackNavigator();

export default function VoiceStack() {
  return (
    <Stack.Navigator
      initialRouteName="VoiceController"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="VoiceController" component={VoiceController} />
      <Stack.Screen name="VoiceMicButton" component={VoiceMicButton} />
      <Stack.Screen name="VoiceTranscript" component={VoiceTranscript} />
    </Stack.Navigator>
  );
}
