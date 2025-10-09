// src/screens/FollowersFollowingScreen.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, FlatList, SafeAreaView } from "react-native";

const Tab = createMaterialTopTabNavigator();

function FollowersTab() {
  const data = Array.from({ length: 20 }).map((_, i) => ({
    id: `f-${i}`,
    name: `Follower ${i + 1}`,
    username: `follower${i + 1}`,
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#666" }}>@{item.username}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function FollowingTab() {
  const data = Array.from({ length: 15 }).map((_, i) => ({
    id: `g-${i}`,
    name: `Following ${i + 1}`,
    username: `following${i + 1}`,
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#666" }}>@{item.username}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default function FollowersFollowingScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarIndicatorStyle: { backgroundColor: "black" },
        tabBarLabelStyle: { fontWeight: "600" },
      }}
    >
      <Tab.Screen name="Followers" component={FollowersTab} />
      <Tab.Screen name="Following" component={FollowingTab} />
    </Tab.Navigator>
  );
}
