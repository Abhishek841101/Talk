
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserJoinedContests } from "../../features/Contests/ContestsSlice";

export default function MyContestsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { userJoinedContests, listLoading, error } = useSelector((state) => state.contests);
  const [refreshing, setRefreshing] = useState(false);

  const loadContests = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchUserJoinedContests()).unwrap();
    } catch (err) {
      console.error("Failed to fetch joined contests:", err);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadContests();
  }, [dispatch]);

  if (listLoading && !refreshing)
    return (
      <ActivityIndicator
        size="large"
        color="#FF6B00"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  return (
    <View style={styles.container}>
      <Button title="Refresh" onPress={loadContests} />
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}

      <FlatList
        data={userJoinedContests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("LeaderboardScreen", { contestId: item._id })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>Participants: {item.participants?.length || 0}</Text>
            <Text>Prize: {item.prize || "N/A"}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ marginTop: 20 }}>
            <Text>No contests joined yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f8f9fa" },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#FF6B00" },
});



