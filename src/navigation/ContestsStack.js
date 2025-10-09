

// // src/navigation/ContestsStack.js
// import React from "react";
// import { TouchableOpacity } from "react-native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";

// import ContestsScreen from "../screens/contests/ContestsScreen";
// import CreateContestScreen from "../screens/contests/CreateContestScreen";
// import ContestDetailsScreen from "../screens/contests/ContestDetailsScreen";
// import JoinedContestsScreen from "../screens/contests/JoinedContestsScreen";

// const Stack = createNativeStackNavigator();

// export default function ContestsStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerBackTitleVisible: false,
//         headerTintColor: "#FF6B00",
//         contentStyle: { backgroundColor: "#f8f9fa" },
//       }}
//     >
//       <Stack.Screen
//         name="ContestsHome"
//         component={ContestsScreen}
//         options={({ navigation }) => ({
//           title: "Contests",
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => navigation.navigate("CreateContest")}
//               style={{ marginRight: 15 }}
//             >
//               <Ionicons name="add-circle-outline" size={28} color="#FF6B00" />
//             </TouchableOpacity>
//           ),
//         })}
//       />

//       <Stack.Screen
//         name="CreateContest"
//         component={CreateContestScreen}
//         options={{
//           title: "Create Contest",
//           presentation: "modal", // opens as modal
//         }}
//       />

//       <Stack.Screen
//         name="ContestDetails"
//         component={ContestDetailsScreen}
//         options={{ title: "Contest Details" }}
//       />

//       <Stack.Screen
//         name="JoinedContests"
//         component={JoinedContestsScreen}
//         options={{ title: "Joined Contests" }}
//       />
//     </Stack.Navigator>
//   );
// }




// // src/navigation/ContestsStack.js
// import React from "react";
// import { TouchableOpacity } from "react-native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";

// import ContestsScreen from "../screens/contests/ContestsScreen";
// import CreateContestScreen from "../screens/contests/CreateContestScreen";
// import ContestDetailsScreen from "../screens/contests/ContestDetailsScreen";
// import JoinedContestsScreen from "../screens/contests/JoinedContestsScreen";
// import CreateContestEntryScreen from "../screens/contests/CreateContestEntryScreen";

// const Stack = createNativeStackNavigator();

// export default function ContestsStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerBackTitleVisible: false,
//         headerTintColor: "#FF6B00",
//         contentStyle: { backgroundColor: "#f8f9fa" },
//       }}
//     >
//       {/* Contests Home with Add button */}
//       <Stack.Screen
//         name="ContestsHome"
//         component={ContestsScreen}
//         options={({ navigation }) => ({
//           title: "Contests",
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => navigation.navigate("CreateContest")}
//               style={{ marginRight: 15 }}
//             >
//               <Ionicons name="add-circle-outline" size={28} color="#FF6B00" />
//             </TouchableOpacity>
//           ),
//         })}
//       />

//       {/* Create Contest Screen as modal */}
//       <Stack.Screen
//         name="CreateContest"
//         component={CreateContestScreen}
//         options={{
//           title: "Create Contest",
//           presentation: "modal", // opens as modal
//         }}
//       />

//       {/* Contest Details */}
//       <Stack.Screen
//         name="ContestDetails"
//         component={ContestDetailsScreen}
//         options={{ title: "Contest Details" }}
//       />

//       {/* Joined Contests */}
//       <Stack.Screen
//         name="JoinedContests"
//         component={JoinedContestsScreen}
//         options={{ title: "Joined Contests" }}
//       />


//       {/* Create Contest Entry Screen */}
      
// <Stack.Screen
//   name="CreateContestEntryScreen"
//   component={CreateContestEntryScreen}
//   options={{
//     title: "Submit Entry",
//     presentation: "modal",
//   }}
// />
//     </Stack.Navigator>
//   );
// }







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
