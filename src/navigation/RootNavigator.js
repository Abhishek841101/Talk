





// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from '../screens/auth/LoginScreen';
// import RegisterScreen from '../screens/auth/RegisterScreen';
// import AppTabs from './AppTabs'; // import tabs

// const Stack = createNativeStackNavigator();

// export default function RootNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//       <Stack.Screen name="AppTabs" component={AppTabs} />
//     </Stack.Navigator>
//   );
// }





// src/navigation/RootNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen"; 
import AppTabs from "./AppTabs";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} /> 
      <Stack.Screen name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );
}