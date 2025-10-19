
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  joinContestAPI,
  fetchAllUsers,
  fetchContestById,
} from "../../features/Contests/ContestsSlice";

export default function ContestDetailsScreen({ route, navigation }) {
  const { contest } = route.params || {};
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    allUsers = { users: [] },
    allUsersLoading,
    contest: currentContest,
  } = useSelector((state) => state.contests);

  const [currentTime, setCurrentTime] = useState(new Date());

  const activeContest = currentContest || contest || { participants: [], slots: 0 };

  // Refresh current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all users for group contest if admin
  useEffect(() => {
    if (
      activeContest?.contestType === "group" &&
      (activeContest?.superAdmin === user._id ||
        (activeContest?.admins || []).includes(user._id))
    ) {
      dispatch(fetchAllUsers())
        .unwrap()
        .then((res) => console.log("✅ All users fetched:", res))
        .catch((err) => console.log("❌ Failed to fetch users:", err));
    }
  }, [activeContest, user]);

  // Contest status
  const slotsUsed = (activeContest.participants || []).length;
  const slotsTotal = activeContest.slots || 0;
  const isFull = slotsUsed >= slotsTotal;
  const startDate = activeContest.startDate ? new Date(activeContest.startDate) : null;
  const endDate = activeContest.endDate ? new Date(activeContest.endDate) : null;
  const isEnded = endDate && currentTime > endDate;
  const canJoin = !isFull && !isEnded;

  const userRole =
    activeContest.superAdmin === user?._id
      ? "super_admin"
      : (activeContest.admins || []).includes(user?._id)
      ? "admin"
      : (activeContest.participants || []).includes(user?._id)
      ? "participant"
      : null;

  const handleJoin = async () => {
    if (!canJoin) return;
    try {
      await dispatch(joinContestAPI({ contestId: activeContest._id, formData: {} })).unwrap();
      Alert.alert("Success", "You joined the contest!");
      dispatch(fetchContestById(activeContest._id));
    } catch (err) {
      console.log("❌ Join error:", err);
      Alert.alert("Error", err || "Failed to join contest");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join contest: ${activeContest.title || "Untitled Contest"}`,
      });
    } catch (err) {
      console.log("❌ Share error:", err);
    }
  };

  const formatDateTime = (date) =>
    date?.toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) || "";

  // Filter users not yet joined
  const usersNotJoined = (allUsers.users || []).filter(
    (u) => !(activeContest.participants || []).includes(u._id)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.title}>{activeContest.title || "Untitled Contest"}</Text>
        <Text style={styles.contestType}>{activeContest.contestType?.toUpperCase() || "SOLO"}</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>{activeContest.description || "No description provided."}</Text>

      {/* Contest Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>
          <Text style={styles.label}>Prize:</Text> {activeContest.prize || "N/A"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Slots:</Text> {slotsUsed}/{slotsTotal}
        </Text>
        {startDate && (
          <Text style={styles.detail}>
            <Text style={styles.label}>Start:</Text> {formatDateTime(startDate)}
          </Text>
        )}
        {endDate && (
          <Text style={styles.detail}>
            <Text style={styles.label}>End:</Text> {formatDateTime(endDate)}
          </Text>
        )}
        <Text style={styles.detail}>
          <Text style={styles.label}>Status:</Text> {isEnded ? "ENDED" : "OPEN"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Role:</Text> {userRole?.replace("_", " ") || "Viewer"}
        </Text>
      </View>

      {/* Admin: Add users in Group Contest */}
      {activeContest.contestType === "group" && (userRole === "super_admin" || userRole === "admin") && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>All Users</Text>
          {allUsersLoading ? (
            <ActivityIndicator size="small" color="#0A8F08" />
          ) : usersNotJoined.length === 0 ? (
            <Text>No users to add</Text>
          ) : (
            usersNotJoined.map((u) => (
              <View key={u._id} style={styles.userRow}>
                <Text style={styles.username}>{u.username || u.name}</Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={async () => {
                    try {
                      console.log("Adding user to contest:", u._id, u.username);
                      await dispatch(
                        joinContestAPI({
                          contestId: activeContest._id,
                          formData: { userId: u._id }, // ✅ proper userId
                        })
                      ).unwrap();
                      Alert.alert("Success", `${u.username} added to contest!`);
                      dispatch(fetchContestById(activeContest._id)); // Refresh
                    } catch (err) {
                      console.log("❌ Add user error:", err);
                      Alert.alert("Error", err || "Failed to add user");
                    }
                  }}
                >
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.joinBtn, !canJoin && { backgroundColor: "#999" }]}
          onPress={handleJoin}
          disabled={!canJoin}
        >
          <Text style={styles.btnText}>{!canJoin ? (isFull ? "Full" : "Ended") : "Join"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.btnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f8f9fa" },
  title: { fontSize: 22, fontWeight: "bold", color: "#FF6B00" },
  contestType: { fontSize: 14, fontWeight: "bold", color: "#0A8F08" },
  description: { fontSize: 14, color: "#333", marginVertical: 8 },
  detailsContainer: { marginVertical: 8 },
  detail: { fontSize: 14, color: "#555", marginBottom: 4 },
  label: { fontWeight: "bold", color: "#333" },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  joinBtn: { padding: 12, backgroundColor: "#FF6B00", borderRadius: 6, flex: 1, marginRight: 6, alignItems: "center" },
  shareBtn: { padding: 12, backgroundColor: "#0A8F08", borderRadius: 6, flex: 1, marginLeft: 6, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
  userRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: "#ccc", borderRadius: 4, backgroundColor: "#fff", marginBottom: 4 },
  username: { fontSize: 14, color: "#333" },
  addBtn: { backgroundColor: "#28a745", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  addBtnText: { color: "#fff", fontSize: 12 },
});
