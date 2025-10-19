




import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ContestCard({ contest, onPress }) {
  // Dates from backend
  const startDate = contest.startDate
    ? new Date(contest.startDate).toLocaleString()
    : "N/A";
  const endDate = contest.endDate
    ? new Date(contest.endDate).toLocaleString()
    : "N/A";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log("✅ ContestCard pressed:", contest?._id || contest?.title);
        if (onPress) onPress();
      }}
    >
      {contest.image && (
        <Image
          source={{ uri: contest.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.infoContainer}>
        <View style={styles.infoLeft}>
          <Text style={styles.title} numberOfLines={1}>
            {contest.title}
          </Text>

          {/* Contest Type */}
          <Text style={styles.type}>
            {contest.contestType
              ? contest.contestType.charAt(0).toUpperCase() +
                contest.contestType.slice(1)
              : "Solo"}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {contest.description}
          </Text>
          <Text style={styles.prize}>Prize: {contest.prize || "N/A"}</Text>
          <Text style={styles.participants}>
            {contest.participants?.length || 0} participants
          </Text>
        </View>

        <View style={styles.infoRight}>
          <Text style={styles.dates}>Start: {startDate}</Text>
          <Text style={styles.dates}>End: {endDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 8,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  infoLeft: { flex: 2 },
  infoRight: { flex: 1, alignItems: "flex-end", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "bold", color: "#FF6B00" },
  type: { fontSize: 12, fontWeight: "bold", color: "#FF4500", marginVertical: 2 },
  description: { fontSize: 12, color: "#555", marginVertical: 4 },
  prize: { fontWeight: "bold", color: "#0A8F08", marginTop: 2 },
  participants: { fontSize: 12, color: "#555", marginTop: 4 },
  dates: { fontSize: 12, color: "#333", marginBottom: 2, textAlign: "right" },
});
