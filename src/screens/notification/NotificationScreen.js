// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import {
//   fetchNotifications,
//   markNotificationRead,
//   markAllNotificationsRead,
// } from "../../features/notifications/notificationSlice";
// import { initSocket } from "../../lib/socket";
// import { useNavigation } from "@react-navigation/native";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";

// dayjs.extend(relativeTime);

// export default function NotificationScreen() {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   // ✅ Use correct store key
//   const { notifications, loading, error } = useSelector(
//     (state) => state.notification
//   );

//   const [socketConnected, setSocketConnected] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // ------------------- Initialize socket -------------------
//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const socket = await initSocket();
//         if (socket) {
//           setSocketConnected(true);

//           // Listen for new notifications
//           socket.on("newNotification", (notif) => {
//             dispatch({ type: "notification/addNotificationFromSocket", payload: notif });
//           });

//           // Handle notification read updates from other devices
//           socket.on("notificationRead", ({ notificationId }) => {
//             dispatch(markNotificationRead.fulfilled(notificationId));
//           });
//         }
//       } catch (err) {
//         console.log("Socket error:", err);
//         setSocketConnected(false);
//       }
//     };
//     initialize();

//     // Fetch initial notifications
//     dispatch(fetchNotifications());
//   }, []);

//   // ------------------- Pull to refresh -------------------
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await dispatch(fetchNotifications());
//     setRefreshing(false);
//   };

//   // ------------------- Handle single read -------------------
//   const handleMarkRead = (id) => {
//     dispatch(markNotificationRead(id));
//   };

//   // ------------------- Handle mark all read -------------------
//   const handleMarkAllRead = () => {
//     dispatch(markAllNotificationsRead());
//   };

//   // ------------------- Render notification item -------------------
//   const renderItem = ({ item }) => {
//   const handleUserPress = () => {
//   navigation.navigate("ProfileTab", {
//     screen: "Profile",
//     params: { userId: item.sender._id },
//   });
// };
//     const handlePostPress = () => {
//       if (item.post) navigation.navigate("PostDetailScreen", { postId: item.post });
//     };

//     return (
//       <TouchableOpacity
//         style={[styles.notifItem, !item.read && styles.unreadNotif]}
//         onPress={() => {
//           handleMarkRead(item._id);
//           if (item.post) handlePostPress();
//         }}
//       >
//         <Ionicons
//           name={item.read ? "notifications-outline" : "notifications"}
//           size={24}
//           color={item.read ? "gray" : "#1DA1F2"}
//           style={{ marginRight: 10 }}
//         />
//         <View style={{ flex: 1 }}>
//           <Text style={[styles.notifText, !item.read && styles.unreadText]}>
//             <Text style={{ fontWeight: "bold" }} onPress={handleUserPress}>
//               {item.sender.username}
//             </Text>{" "}
//             {item.type === "COMMENT_POST" && "commented: "}
//             {item.type === "LIKE_POST" && "liked your post"}
//             {item.type === "FOLLOW_USER" && "started following you"}
//             {item.type === "COMMENT_POST" && (
//               <Text style={{ fontWeight: "normal" }}>
//                 {item.text.split(":")[1]}
//               </Text>
//             )}
//           </Text>
//           <Text style={styles.timeText}>{dayjs(item.createdAt).fromNow()}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading && notifications.length === 0) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#1DA1F2" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Notifications</Text>
//         {notifications.length > 0 && (
//           <TouchableOpacity onPress={handleMarkAllRead}>
//             <Text style={styles.markAll}>Mark all read</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Connection Status */}
//       {!socketConnected && (
//         <View style={styles.connectionBanner}>
//           <Text style={styles.connectionText}>
//             🔄 Connecting to real-time updates...
//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={["#1DA1F2"]}
//             tintColor="#1DA1F2"
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No notifications yet</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// // ------------------- Styles -------------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderColor: "#1a1a1a",
//     marginTop: 30,
//   },
//   title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
//   markAll: { color: "#1DA1F2", fontSize: 14, fontWeight: "600" },
//   connectionBanner: { backgroundColor: "#FFA500", padding: 8, alignItems: "center" },
//   connectionText: { color: "#000", fontSize: 12, fontWeight: "600" },
//   notifItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderColor: "#1a1a1a",
//   },
//   unreadNotif: { backgroundColor: "#1a1a1a" },
//   notifText: { color: "#fff", fontSize: 16 },
//   unreadText: { fontWeight: "bold", color: "#1DA1F2" },
//   timeText: { color: "gray", fontSize: 12, marginTop: 3 },
//   emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
//   emptyText: { color: "gray", fontSize: 16 },
//   loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
// });






import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../features/notifications/notificationSlice";
import { initSocket } from "../../lib/socket";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigation } from "@react-navigation/native";

dayjs.extend(relativeTime);

export default function NotificationScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { notifications, loading } = useSelector(
    (state) => state.notification
  );

  const [socketConnected, setSocketConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Socket + Initial fetch
  useEffect(() => {
    const setupSocket = async () => {
      try {
        const socket = await initSocket();
        if (socket) {
          setSocketConnected(true);

          socket.on("newNotification", (notif) => {
            dispatch({
              type: "notification/addNotificationFromSocket",
              payload: notif,
            });
          });
        }
      } catch (err) {
        console.log("Socket error:", err);
      }
    };

    setupSocket();
    dispatch(fetchNotifications());
  }, []);

  // ✅ Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  };

  // ✅ Tap → mark read + handle navigation
  const handlePress = (item) => {
    dispatch(markNotificationRead(item._id));

    // Open profile
    if (item.sender?._id) {
      navigation.navigate("ProfileTab", {
        screen: "Profile",
        params: { userId: item.sender._id },
      });
    }

    // Open post
    if (item.post) {
      navigation.navigate("PostDetailScreen", {
        postId: item.post,
      });
    }
  };

  // ✅ Single notification UI
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.row, !item.read && styles.unreadRow]}
        onPress={() => handlePress(item)}
      >
        {/* Avatar */}
        <Image
          source={{
            uri: item?.sender?.avatar
              ? item.sender.avatar
              : "https://i.stack.imgur.com/l60Hf.png",
          }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          {/* Text */}
          <Text style={[styles.msg, !item.read && styles.unreadText]}>
            <Text style={styles.boldUser}>
              @{item?.sender?.username || "user"}
            </Text>{" "}
            {item.type === "LIKE_POST" && "liked your post"}
            {item.type === "COMMENT_POST" && "commented on your post"}
            {item.type === "FOLLOW_USER" && "started following you"}
          </Text>

          {/* Time */}
          <Text style={styles.time}>
            {dayjs(item.createdAt).fromNow()}
          </Text>
        </View>

        {/* Icon */}
        <Ionicons
          name={item.read ? "notifications-outline" : "notifications"}
          size={20}
          color={item.read ? "gray" : "#1DA1F2"}
        />
      </TouchableOpacity>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(markAllNotificationsRead())}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Offline Socket */}
      {!socketConnected && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Connecting…
          </Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1DA1F2"]}
            tintColor="#1DA1F2"
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.empty}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 35,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  markAll: { color: "#1DA1F2", fontWeight: "600", fontSize: 14 },

  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomColor: "#111",
    borderBottomWidth: 1,
  },
  unreadRow: {
    backgroundColor: "#111",
  },

  avatar: { width: 45, height: 45, borderRadius: 25, marginRight: 12 },

  msg: { color: "#ddd", fontSize: 15 },
  unreadText: { color: "#1DA1F2", fontWeight: "600" },
  boldUser: { fontWeight: "bold", color: "#fff" },

  time: { color: "gray", fontSize: 12, marginTop: 3 },

  empty: { color: "gray", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  badge: { backgroundColor: "#FFA500", padding: 8, alignItems: "center" },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#000" },
});
