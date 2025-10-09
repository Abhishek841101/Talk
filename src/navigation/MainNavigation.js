
// import React from "react";
// import { useSelector } from "react-redux";
// import RootNavigator from "./RootNavigator";
// import AppTabs from "./AppTabs";

// const MainNavigator = () => {
//   const { token } = useSelector((state) => state.auth);
//   return token ? <AppTabs /> : <RootNavigator />;
// };

// export default MainNavigator;







// src/navigation/MainNavigator.js
import React from "react";
import { useSelector } from "react-redux";
import RootNavigator from "./RootNavigator";
import AppTabs from "./AppTabs";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <RootNavigator />;
  }

  // ✅ User logged in → Show Onboarding first, then AppTabs
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
