import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContestLeaderboard,
  likeContestEntry,
  fetchUserJoinedContests,
} from "../../features/Contests/ContestsSlice";

export default function ContestScreen({ route }) {
  const { contestId } = route.params;
  const dispatch = useDispatch();

  const { leaderboard, leaderboardLoading, userJoinedContests } = useSelector(
    (state) => state.contests
  );

  const [activeTab, setActiveTab] = useState("leaderboard"); // "leaderboard" or "participation"

  useEffect(() => {
    if (contestId) {
      dispatch(fetchContestLeaderboard(contestId));
      dispatch(fetchUserJoinedContests(contestId));
    }
  }, [contestId]);

  const handleLike = (entryId) => {
    dispatch(likeContestEntry(entryId));
  };

  // 🔹 Calculate ranks on frontend
  const rankedLeaderboard = leaderboard
    ?.slice()
    .sort((a, b) => b.likes - a.likes)
    .map((entry, index, arr) => {
      let rank = index + 1;
      if (index > 0 && entry.likes === arr[index - 1].likes) {
        rank = arr[index - 1].rank; // same rank if tie
      }
      return { ...entry, rank };
    });

  const renderItem = ({ item }) => {
    if (activeTab === "leaderboard") {
      return (
        <View style={styles.entryRow}>
          <Text style={styles.rank}>{item.rank}</Text>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.likes}>{item.likes || 0} ❤️</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.entryRow}>
          <Text style={styles.username}>{item.username}</Text>
          <TouchableOpacity
            style={styles.likeBtn}
            onPress={() => handleLike(item._id)}
          >
            <Text style={styles.likeText}>❤️ Like</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (leaderboardLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab("leaderboard")}
          style={[styles.tabBtn, activeTab === "leaderboard" && styles.activeTab]}
        >
          <Text style={styles.tabText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("participation")}
          style={[styles.tabBtn, activeTab === "participation" && styles.activeTab]}
        >
          <Text style={styles.tabText}>Participation</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={activeTab === "leaderboard" ? rankedLeaderboard : userJoinedContests}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabs: { flexDirection: "row", marginBottom: 12 },
  tabBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: { backgroundColor: "#FF6B00" },
  tabText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  rank: { fontSize: 16, fontWeight: "bold", width: 30 },
  username: { fontSize: 16, flex: 1 },
  likes: { fontSize: 16, marginRight: 6 },
  likeBtn: { padding: 6, backgroundColor: "#FF6B00", borderRadius: 4 },
  likeText: { fontSize: 14, color: "#fff" },
});
