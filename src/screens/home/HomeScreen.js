

// import React from 'react';
// import { View, FlatList, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../../components/common/Header';
// // import Stories from '../components/Stories';
// // import PostCard from '../components/common/PostCard';

// export default function HomeScreen() {
//   const posts = useSelector((state) => state.posts.posts);
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       {/* Header with Chat Icon */}
//       <Header navigation={navigation} />

//       {/* Stories + Posts */}
//       {/* <FlatList
//         data={posts}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={<Stories />}
//         renderItem={({ item }) => <PostCard post={item} />}
//       /> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
// });



// import React from 'react';
// import { View, FlatList, StyleSheet, Text } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../../components/common/Header';
// import PostCard from '../../components/common/PostCard'; // uncomment if exists
// import Stories from '../../components/common/Stories'; // uncomment if exists

// export default function HomeScreen() {
//   const posts = useSelector((state) => state.posts?.posts || []); // <-- safe fallback
//   const navigation = useNavigation();

//   const renderItem = ({ item }) => <PostCard post={item} />;

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Header navigation={navigation} />

//       {/* FlatList with Stories + Posts */}
//       {posts.length > 0 ? (
//         <FlatList
//           data={posts}
//           keyExtractor={(item) => item.id}
//           showsVerticalScrollIndicator={false}
//           ListHeaderComponent={<Stories />}
//           renderItem={renderItem}
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text>No posts yet. Start posting!</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });





// import React, { useState } from "react";
// import {
//   View,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import PostCard from "../../components/PostCard";
// import profilePic from "../../assets/profile.jpg";

// // Dummy posts
// const posts = [
//   {
//     id: "1",
//     user: { username: "john_doe", avatar: "https://i.pravatar.cc/150?img=1" },
//     image: "https://picsum.photos/800/400?random=1",
//     likes: 120,
//     liked: false,
//     caption: "Nature at its best!",
//     followingOnly: false,
//   },
//   {
//     id: "2",
//     user: { username: "jane_smith", avatar: "https://i.pravatar.cc/150?img=2" },
//     image: "https://picsum.photos/800/400?random=2",
//     likes: 300,
//     liked: true,
//     caption: "Amazing sunset!",
//     followingOnly: true,
//   },
//   {
//     id: "3",
//     user: { username: "alex_90", avatar: "https://i.pravatar.cc/150?img=3" },
//     image: "https://picsum.photos/800/400?random=3",
//     likes: 75,
//     liked: false,
//     caption: "Adventure time!",
//     followingOnly: false,
//   },
// ];

// export default function HomeScreen() {
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState("For You");

//   // Filter posts based on active tab
//   const filteredPosts =
//     activeTab === "For You"
//       ? posts.filter((p) => !p.followingOnly)
//       : posts.filter((p) => p.followingOnly);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         {/* Profile icon */}
//         <TouchableOpacity onPress={() => navigation.navigate("ProfileStack")}>
//           <Image source={profilePic} style={styles.profilePic} />
//         </TouchableOpacity>

//         {/* App name */}
//         <Text style={styles.logo}>GTalk</Text>

//         {/* Chat icon */}
//         <TouchableOpacity onPress={() => navigation.navigate("ChatListScreen")}>
//           <Ionicons name="chatbubble-outline" size={28} color="#1DA1F2" />
//         </TouchableOpacity>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabRow}>
//         {["For You", "Following"].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(tab)}
//             style={styles.tabBtn}
//           >
//             <Text
//               style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
//             >
//               {tab}
//             </Text>
//             {activeTab === tab && <View style={styles.tabUnderline} />}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Posts feed */}
//       <FlatList
//         data={filteredPosts}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => <PostCard post={item} />}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     backgroundColor: "#000",
//     borderBottomWidth: 1,
//     borderColor: "#1a1a1a",
//   },
//   profilePic: { width: 36, height: 36, borderRadius: 18 },
//   logo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
//   tabRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     borderBottomWidth: 1,
//     borderColor: "#1a1a1a",
//   },
//   tabBtn: { alignItems: "center", paddingVertical: 10 },
//   tabText: { color: "gray", fontSize: 15, fontWeight: "600" },
//   tabTextActive: { color: "#1DA1F2" },
//   tabUnderline: {
//     marginTop: 5,
//     height: 3,
//     width: 40,
//     backgroundColor: "#1DA1F2",
//     borderRadius: 2,
//   },
// });




import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../../components/PostCard";
import { initSocket, getSocket } from "../../lib/socket";
import {
  fetchPosts,
  addPostFromSocket,
  toggleLikeOptimistic,
  incrementPage,
  setPostsLoading,
  resetPage,
  setHasMore,
} from "../../features/posts/postsSlice";

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { posts, loading, hasMore, page } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("For You");
  const [refreshing, setRefreshing] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // ------------------- Initialize socket -------------------
  useEffect(() => {
    const initialize = async () => {
      try {
        const socket = await initSocket();
        if (socket) {
          setSocketConnected(true);

          // Listen for new posts
          socket.on("newPost", (post) => {
            dispatch(addPostFromSocket(post));
          });

          // Listen for likes from others
          socket.on("postLiked", ({ postId, likesCount, liked }) => {
            dispatch(toggleLikeOptimistic({ postId, likesCount, liked }));
          });
        }
      } catch (error) {
        console.error("[HomeScreen] Socket error:", error);
        setSocketConnected(false);
      }
    };

    initialize();
    fetchPostsFromRedux(1, true); // Fetch first page
  }, []);

  // ------------------- Fetch posts via Redux thunk -------------------
  const fetchPostsFromRedux = async (pageNum = 1, isInitial = false) => {
    if (isInitial) dispatch(setPostsLoading(true));

    try {
      await dispatch(fetchPosts({ page: pageNum, limit: 5 })).unwrap();
    } catch (error) {
      console.error("[HomeScreen] Fetch posts error:", error);
      Alert.alert("Error", "Failed to load posts");
    } finally {
      dispatch(setPostsLoading(false));
      setRefreshing(false);
    }
  };

  // ------------------- Pull to refresh -------------------
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(resetPage());
    fetchPostsFromRedux(1, true);
  }, []);

  // ------------------- Load more posts -------------------
  const loadMore = () => {
    if (!loading && hasMore && !refreshing) {
      const nextPage = page + 1;
      dispatch(incrementPage());
      fetchPostsFromRedux(nextPage, false);
    }
  };

  // ------------------- Handle like -------------------
  const handleLike = (postId) => {
    dispatch(toggleLikeOptimistic({ postId })); // Optimistic update

    // Emit socket like event
    const socket = getSocket();
    if (socket) {
      socket.emit("likePost", { postId, userId: user?._id });
    }
  };

  // ------------------- Filter posts by tab -------------------
  const filteredPosts =
    activeTab === "For You"
      ? posts.filter((p) => !p.followingOnly)
      : posts.filter((p) => p.followingOnly);

  // ------------------- List Footer -------------------
  const renderFooter = () =>
    loading ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#1DA1F2" />
        <Text style={styles.loadingText}>Loading more posts...</Text>
      </View>
    ) : null;

  // ------------------- Empty List -------------------
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>
          {socketConnected
            ? "Posts will appear here in real-time"
            : "Connect to see posts"}
        </Text>
        {!socketConnected && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={async () => {
              const socket = await initSocket();
              if (socket) setSocketConnected(true);
            }}
          >
            <Text style={styles.retryButtonText}>Reconnect</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={
              user?.profilePicture
                ? { uri: user.profilePicture }
                : require("../../assets/profile.jpg")
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>

        <Text style={styles.logo}>GTalk</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("ChatListScreen")}>
            <Ionicons name="chatbubble-outline" size={28} color="#1DA1F2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Connection Status */}
      {!socketConnected && (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionText}>
            🔄 Connecting to real-time updates...
          </Text>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["For You", "Following"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabBtn}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Posts feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => handleLike(item.id)}
            onComment={(postId) =>
              navigation.navigate("Comments", { postId })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1DA1F2"]}
            tintColor="#1DA1F2"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredPosts.length === 0 ? styles.emptyList : null}
      />

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Posts: {filteredPosts.length} | Socket:{" "}
          {socketConnected ? "✅" : "❌"} | Tab: {activeTab} | Page: {page}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
    paddingTop: 30,
  },
  profilePic: { width: 36, height: 36, borderRadius: 18 },
  logo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  connectionBanner: { backgroundColor: "#FFA500", padding: 8, alignItems: "center" },
  connectionText: { color: "#000", fontSize: 12, fontWeight: "600" },
  tabRow: { flexDirection: "row", justifyContent: "space-around", borderBottomWidth: 1, borderColor: "#1a1a1a" },
  tabBtn: { alignItems: "center", paddingVertical: 10 },
  tabText: { color: "gray", fontSize: 15, fontWeight: "600" },
  tabTextActive: { color: "#1DA1F2" },
  tabUnderline: { marginTop: 5, height: 3, width: 40, backgroundColor: "#1DA1F2", borderRadius: 2 },
  footerLoader: { padding: 20, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  loadingText: { color: "#1DA1F2", marginLeft: 10, fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  emptySubtext: { color: "gray", textAlign: "center", fontSize: 14, marginBottom: 20 },
  retryButton: { backgroundColor: "#1DA1F2", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: "#fff", fontWeight: "600" },
  emptyList: { flexGrow: 1 },
  debugInfo: { padding: 5, backgroundColor: "#1a1a1a" },
  debugText: { color: "#666", fontSize: 10, textAlign: "center" },
});
