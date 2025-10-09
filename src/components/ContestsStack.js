

import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import ContestsScreen from "../screens/contests/ContestsScreen";
import ContestDetailsScreen from "../screens/contests/ContestDetailsScreen";
import MyContestsScreen from "../screens/contests/MyContestsScreen";
import LeaderboardScreen from "../screens/contests/LeaderboardScreen";

const Stack = createNativeStackNavigator();

export default function ContestsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "#FF6B00",
        contentStyle: { backgroundColor: "#f8f9fa" },
      }}
    >
      {/* Contests Home */}
      <Stack.Screen
        name="ContestsHome"
        component={ContestsScreen}
        options={({ navigation }) => ({
          title: "Contests",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("MyContests")}
              style={{ marginRight: 12 }}
            >
              <Text style={{ color: "#FF6B00", fontWeight: "bold" }}>My Contests</Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* Contest Details */}
      <Stack.Screen
        name="ContestDetails"
        component={ContestDetailsScreen}
        options={{ title: "Contest Details" }}
      />

      {/* Create Contest Entry + Leaderboard (optional modal) */}
      
      <Stack.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{
          title: "Leaderboard",
          presentation: "modal",
        }}
      />
     

      {/* My Contests Screen */}
      <Stack.Screen
        name="MyContests"
        component={MyContestsScreen} // fixed: no inline function
        options={{ title: "My Contests" }}
      />


      
    </Stack.Navigator>
  );
}
