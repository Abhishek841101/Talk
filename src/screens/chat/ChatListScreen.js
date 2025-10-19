

// // import React, { useEffect, useState, useLayoutEffect } from "react";
// // import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Modal, ActivityIndicator } from "react-native";
// // import { useNavigation } from "@react-navigation/native";
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchAllUsers } from "../../features/chat/chatSlice";

// // export default function ChatListScreen() {
// //   const navigation = useNavigation();
// //   const dispatch = useDispatch();
// //   const { allUsers, loading, error } = useSelector((state) => state.chat);
// //   const currentUser = useSelector((state) => state.auth.user);

// //   const [searchText, setSearchText] = useState("");
// //   const [modalVisible, setModalVisible] = useState(false);

// //   useLayoutEffect(() => {
// //     navigation.setOptions({
// //       headerShown: true,
// //       title: "All Users",
// //       headerLeft: () => (
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
// //           <Ionicons name="arrow-back" size={24} color="black" />
// //         </TouchableOpacity>
// //       ),
// //     });
// //   }, [navigation]);

// //   useEffect(() => { dispatch(fetchAllUsers()); }, [dispatch]);
// //   useEffect(() => { if (modalVisible) dispatch(fetchAllUsers()); }, [modalVisible]);

// //   const filteredUsers = (allUsers || []).filter(
// //     (user) =>
// //       user._id !== currentUser?._id &&
// //       user.username?.toLowerCase().includes(searchText.toLowerCase())
// //   );

// //   const getLastActiveText = (lastActive) => {
// //     if (!lastActive) return "";
// //     const now = new Date();
// //     const last = new Date(lastActive);
// //     const diff = Math.floor((now - last) / 60000);
// //     if (diff < 1) return "Online";
// //     if (diff < 60) return `${diff} min ago`;
// //     if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;
// //     return `${Math.floor(diff / 1440)} days ago`;
// //   };

// //   const renderUserItem = (item) => {
// //     const isOnline = item.lastActive && new Date() - new Date(item.lastActive) < 5 * 60 * 1000;
// //     return (
// //       <TouchableOpacity
// //         style={styles.userItem}
// //         onPress={() => navigation.navigate("Chat", { friendId: item._id })}
// //       >
// //         <View>
// //           <Image source={{ uri: item.avatar || "https://i.pravatar.cc/150?img=1" }} style={styles.avatar} />
// //           {isOnline && <View style={styles.onlineDot} />}
// //         </View>
// //         <View style={{ flex: 1 }}>
// //           <Text style={styles.username}>{item.username}</Text>
// //           {item.lastMessage && (
// //             <Text style={styles.lastActive}>
// //               {item.lastMessage.length > 30 ? item.lastMessage.slice(0, 30) + "..." : item.lastMessage} • {getLastActiveText(item.lastMessageTime)}
// //             </Text>
// //           )}
// //         </View>
// //         {item.unreadCount > 0 && (
// //           <View style={styles.unreadBadge}>
// //             <Text style={{ color: "#fff", fontSize: 12 }}>{item.unreadCount}</Text>
// //           </View>
// //         )}
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.searchContainer}>
// //         <Ionicons name="search-outline" size={20} color="#888" />
// //         <TextInput style={styles.searchInput} placeholder="Search users..." value={searchText} onChangeText={setSearchText} />
// //       </View>

// //       {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}
// //       {loading ? <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} /> :
// //         <FlatList
// //           data={filteredUsers}
// //           keyExtractor={(item) => item._id}
// //           renderItem={({ item }) => renderUserItem(item)}
// //         />}
// //     </View>
// //   );
// // }


// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#fff" },
// //   searchContainer: { flexDirection: "row", alignItems: "center", margin: 12, paddingHorizontal: 12, backgroundColor: "#f0f0f0", borderRadius: 20, height: 40 },
// //   searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
// //   userItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
// //   avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
// //   onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "green", position: "absolute", bottom: 0, right: 0, borderWidth: 2, borderColor: "#fff" },
// //   username: { fontSize: 16, fontWeight: "bold" },
// //   lastActive: { color: "#888", fontSize: 12 },
// //   unreadBadge: { backgroundColor: "red", borderRadius: 12, minWidth: 24, height: 24, justifyContent: "center", alignItems: "center", paddingHorizontal: 6, position: "absolute", right: 16, top: 12 },
// // });





// // import React, { useEffect, useState, useLayoutEffect } from "react";
// // import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Modal, ActivityIndicator } from "react-native";
// // import { useNavigation } from "@react-navigation/native";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchAllUsers } from "../../features/chat/chatSlice";


// // src/screens/chat/ChatListScreen.js
// import React, { useEffect, useLayoutEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// // import { Ionicons } from "@expo/vector-icons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllUsers,
//   fetchMessages,
//   markMessagesAsRead,
//   setCurrentChatFriendId,
// } from "../../features/chat/chatSlice";
// import { initSocket } from "../../lib/socket";

// // ------------------ Helper ------------------
// const formatRelativeTime = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffMs = now - date;
//   const diffMins = Math.floor(diffMs / (1000 * 60));
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//   if (diffMins < 1) return "just now";
//   if (diffMins < 60) return `${diffMins}m ago`;
//   if (diffHours < 24) return `${diffHours}h ago`;
//   if (diffDays === 1) return "Yesterday";
//   if (diffDays < 7) return `${diffDays}d ago`;
//   return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
// };

// // ------------------ Component ------------------
// export default function ChatListScreen() {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const { allUsers, loading, error, authUserId } = useSelector((s) => s.chat);
//   const [searchText, setSearchText] = useState("");

//   // Header
//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerShown: true,
//       title: "Messages",
//       headerLeft: () => (
//         <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 12 }}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);

//   // Fetch users + init socket
//   useEffect(() => {
//     dispatch(fetchAllUsers());
//     initSocket();
//   }, [dispatch]);

//   useFocusEffect(
//     React.useCallback(() => {
//       dispatch(fetchAllUsers());
//     }, [dispatch])
//   );

//   // Open chat
//   const openChat = async (friend) => {
//     const fid = friend._id;
//     dispatch(setCurrentChatFriendId(fid));
//     const messagesAction = await dispatch(fetchMessages(fid));

//     // mark unread messages for receiver
//     const unreadMessageIds = (messagesAction.payload || [])
//       .filter((m) => !m.readBy.includes(authUserId))
//       .map((m) => m._id);

//     if (unreadMessageIds.length > 0) {
//       dispatch(markMessagesAsRead({ friendId: fid, messageIds: unreadMessageIds }));
//     }

//     navigation.navigate("ChatScreen", {
//       friendId: fid,
//       friendName: friend.username,
//       friendAvatar: friend.avatar || null,
//     });
//   };

//   // Filter users
//   const filteredUsers = (allUsers || []).filter((u) =>
//     u.username?.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fff" }}>
//       <View style={styles.searchContainer}>
//         <Ionicons name="search-outline" size={20} color="#888" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search users..."
//           value={searchText}
//           onChangeText={setSearchText}
//         />
//       </View>

//       {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}

//       {loading ? (
//         <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={filteredUsers.sort((a, b) => {
//             const aT = a.lastMessage?.timestamp || 0;
//             const bT = b.lastMessage?.timestamp || 0;
//             return new Date(bT) - new Date(aT);
//           })}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => {
//             const unreadCount = item.unreadCount || 0;
//             const lastMsg = item.lastMessage || null;
//             const isOnline = !!item.isOnline;
//             return (
//               <TouchableOpacity style={styles.userItem} onPress={() => openChat(item)}>
//                 <View>
//                   {item.avatar ? (
//                     <Image source={{ uri: item.avatar }} style={styles.avatar} />
//                   ) : (
//                     <View
//                       style={[
//                         styles.avatar,
//                         { backgroundColor: "#ddd", justifyContent: "center", alignItems: "center" },
//                       ]}
//                     >
//                       <Ionicons name="person" size={24} color="#666" />
//                     </View>
//                   )}
//                   {isOnline && <View style={styles.onlineDot} />}
//                 </View>

//                 <View style={{ flex: 1, marginLeft: 8 }}>
//                   <Text style={[styles.username, unreadCount > 0 && { fontWeight: "bold" }]}>
//                     {item.username}
//                   </Text>
//                   {lastMsg && (
//                     <Text
//                       style={[
//                         styles.lastMessage,
//                         unreadCount > 0 && { fontWeight: "bold", color: "#000" },
//                       ]}
//                       numberOfLines={1}
//                     >
//                       {lastMsg.image
//   ? "📷 Photo"
//   : lastMsg.content
//   ? lastMsg.content
//   : "[Unsupported]"} • {formatRelativeTime(lastMsg.timestamp)}

//                       {/* {lastMsg.content || "[Text]"} • {formatRelativeTime(lastMsg.timestamp)} */}
//                     </Text>
//                   )}
//                 </View>

//                 {unreadCount > 0 && (
//                   <View style={styles.unreadBadge}>
//                     <Text style={{ color: "#fff", fontSize: 12 }}>{unreadCount}</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             );
//           }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     margin: 12,
//     paddingHorizontal: 12,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 20,
//     height: 40,
//   },
//   searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
//   userItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   avatar: { width: 50, height: 50, borderRadius: 25 },
//   onlineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "green",
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   username: { fontSize: 16 },
//   lastMessage: { color: "#555", fontSize: 13, marginTop: 2 },
//   unreadBadge: {
//     backgroundColor: "red",
//     borderRadius: 12,
//     minWidth: 24,
//     height: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 6,
//     position: "absolute",
//     right: 16,
//     top: 16,
//   },
// });







import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  fetchMessages,
  markMessagesAsRead,
  setCurrentChatFriendId,
  updateUserStatus,
  newMessageReceived,
} from "../../features/chat/chatSlice";
import { initSocket, getSocket } from "../../lib/socket";
import Stories from "../../components/Stories"; // import your Stories component

// Format last message timestamp (like WhatsApp)
const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function ChatListScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { allUsers, groups, loading, error, authUserId } = useSelector(
    (state) => state.chat
  );

  const [searchText, setSearchText] = useState("");

  // Header setup
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Messages",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 12 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("UserListScreen")}
          style={{
            marginRight: 12,
            padding: 6,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Ionicons name="pencil-outline" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Fetch users & groups + socket events
  useEffect(() => {
    dispatch(fetchAllUsers());

    initSocket().then((socket) => {
      if (!socket) return;

      // User online/offline
      socket.on("user-status", ({ userId, isOnline }) => {
        dispatch(updateUserStatus({ userId, isOnline }));
      });

      // New message
      socket.on("new-message", ({ message }) => {
        const friendId =
          message.sender._id === authUserId
            ? message.receiver._id
            : message.sender._id;

        dispatch(
          newMessageReceived({
            friendId,
            message: {
              _id: String(message._id),
              sender: String(message.sender._id || message.sender),
              receiver: String(message.receiver._id || message.receiver),
              content: message.content || "",
              image: message.image || null,
              timestamp: message.timestamp || message.createdAt || new Date().toISOString(),
              readBy: message.readBy?.map(String) || [],
              senderUsername: message.sender?.username || "Unknown",
            },
          })
        );
      });
    });
  }, [dispatch, authUserId]);

  // Refetch on screen focus
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchAllUsers());
    }, [dispatch])
  );

  // Reconnect socket on app resume
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        const socket = await initSocket();
        if (socket && !socket.connected) socket.connect();
      }
    });
    return () => subscription.remove();
  }, []);

  const openChat = async (item, isGroup = false) => {
    if (isGroup) {
      navigation.navigate("GroupChatScreen", { groupId: item._id, groupName: item.name });
      return;
    }

    const fid = item._id;
    dispatch(setCurrentChatFriendId(fid));

    const messagesAction = await dispatch(fetchMessages(fid));
    const unreadMessageIds = (messagesAction.payload || [])
      .filter((m) => !(m.readBy || []).map(String).includes(String(authUserId)))
      .map((m) => m._id);

    if (unreadMessageIds.length > 0) {
      dispatch(markMessagesAsRead({ friendId: fid, messageIds: unreadMessageIds }));
      getSocket()?.emit("mark-seen", {
        friendId: fid,
        messageIds: unreadMessageIds,
        userId: authUserId,
      });
    }

    navigation.navigate("ChatScreen", {
      friendId: fid,
      friendName: item.username,
      friendAvatar: item.avatar || null,
    });
  };

  // Combine users + groups for unified list
  const combinedList = [
    ...allUsers.map((u) => ({ ...u, isGroup: false })),
    ...groups.map((g) => ({ ...g, isGroup: true })),
  ];

  const filteredList = combinedList.filter((item) =>
    (item.username || item.name)?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users or groups..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredList.sort((a, b) => {
            const getTime = (msg) => msg?.lastMessage?.timestamp || msg?.lastMessage?.createdAt || 0;
            return new Date(getTime(b)) - new Date(getTime(a));
          })}
          keyExtractor={(item) => item._id}
          // ListHeaderComponent={<Stories />} // <-- Added Stories here
           ListHeaderComponent={<Stories navigation={navigation} />}
          renderItem={({ item }) => {
            const unreadCount = item.unreadCount || 0;
            const lastMsg = item.lastMessage || null;
            const isOnline = !!item.isOnline;
            const displayName = item.isGroup ? item.name : item.username;

            return (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => openChat(item, item.isGroup)}
              >
                <View>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  ) : (
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: "#130303ff", justifyContent: "center", alignItems: "center" },
                      ]}
                    >
                      <Ionicons name={item.isGroup ? "people" : "person"} size={24} color="#666" />
                    </View>
                  )}
                  {!item.isGroup && isOnline && <View style={styles.onlineDot} />}
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.username, unreadCount > 0 && { fontWeight: "bold" }]}>
                    {displayName}
                  </Text>
                  {lastMsg && (
                    <Text
                      style={[styles.lastMessage, unreadCount > 0 && { fontWeight: "bold", color: "#000" }]}
                      numberOfLines={1}
                    >
                      {lastMsg.image
                        ? "📷 Photo"
                        : lastMsg.content
                        ? lastMsg.content
                        : "[Unsupported]"}{" "}
                      • {formatRelativeTime(lastMsg.timestamp || lastMsg.createdAt)}
                    </Text>
                  )}
                </View>

                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={{ color: "#fff", fontSize: 12 }}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    paddingHorizontal: 12,
    backgroundColor: "#881e1eff",
    borderRadius: 20,
    height: 40,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e7cfcfff",
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green",
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "#b4a8a8ff",
  },
  username: { fontSize: 16 },
  lastMessage: { color: "#ce0a0aff", fontSize: 13, marginTop: 2 },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    position: "absolute",
    right: 16,
    top: 16,
  },
});
