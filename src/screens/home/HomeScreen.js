
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
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
} from "../../features/posts/postsSlice";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { posts, loading, hasMore, page } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(0); // 0 = For You, 1 = Following
  const [refreshing, setRefreshing] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const horizontalRef = useRef(null);

  // ------------------- Initialize socket -------------------
  useEffect(() => {
    const initialize = async () => {
      try {
        const socket = await initSocket();
        if (socket) {
          setSocketConnected(true);

          socket.on("newPost", (post) => {
            dispatch(addPostFromSocket(post));
          });

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
    dispatch(toggleLikeOptimistic({ postId }));
    const socket = getSocket();
    if (socket) socket.emit("likePost", { postId, userId: user?._id });
  };

  // ------------------- Filter posts by tab -------------------
  const filteredPosts = [
    posts.filter((p) => !p.followingOnly), // For You
    posts.filter((p) => p.followingOnly),  // Following
  ];

  // ------------------- Horizontal scroll -------------------
  const handleHorizontalScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newIndex !== activeTab) setActiveTab(newIndex);
  };

  // ------------------- List Footer -------------------
  const renderFooter = () =>
    loading ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#1DA1F2" />
        <Text style={styles.loadingText}>Loading more posts...</Text>
      </View>
    ) : null;

  // ------------------- Empty List -------------------
  const renderEmpty = (socketConnected) => (
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
        <Text style={styles.logo}>VTalK</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("ChatListScreen")}>
            <Ionicons name="chatbubble-outline" size={28} color="#1DA1F2" />
          </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}
  style={{ marginLeft: 6 }}>
      <Ionicons name="notifications-outline" size={28} color="#1DA1F2" />
      
    </TouchableOpacity>

        </View>
      </View>

      {/* Connection Status */}
      {!socketConnected && (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionText}>🔄 Connecting to real-time updates...</Text>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["For You", "Following"].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() =>
              horizontalRef.current.scrollToOffset({ offset: index * SCREEN_WIDTH, animated: true })
            }
            style={styles.tabBtn}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === index && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Horizontal Scrollable Feed */}
      <FlatList
        ref={horizontalRef}
        data={[0, 1]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleHorizontalScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item: tabIndex }) => (
          <FlatList
            data={filteredPosts[tabIndex]}
            keyExtractor={(post) => post.id}
            showsVerticalScrollIndicator={false}
            style={{ width: SCREEN_WIDTH }}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                fullScreen={true} // make PostCard occupy full screen
                onLike={() => handleLike(item.id)}
                onComment={(postId) => navigation.navigate("Comments", { postId })}
                  onOpenDetail={(postId) => navigation.navigate("PostDetailScreen", { postId })}
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
            ListEmptyComponent={renderEmpty(socketConnected)}
            contentContainerStyle={filteredPosts[tabIndex].length === 0 ? styles.emptyList : null}
          />
        )}
      />

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
    paddingTop: 40,
  },
  profilePic: { width: 36, height: 36, borderRadius: 18 },
  logo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  connectionBanner: { backgroundColor: "#FFA500", padding: 8, alignItems: "center" },
  connectionText: { color: "#000", fontSize: 12, fontWeight: "600" },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
    backgroundColor: "#000",
    paddingVertical: 10,
  },
  tabBtn: { alignItems: "center" },
  tabText: { color: "gray", fontSize: 16, fontWeight: "600" },
  tabTextActive: { color: "#1DA1F2", fontWeight: "bold" },
  tabUnderline: { marginTop: 5, height: 3, width: 40, backgroundColor: "#1DA1F2", borderRadius: 2 },
  footerLoader: { padding: 20, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  loadingText: { color: "#1DA1F2", marginLeft: 10, fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  emptySubtext: { color: "gray", textAlign: "center", fontSize: 14, marginBottom: 20 },
  retryButton: { backgroundColor: "#1DA1F2", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: "#fff", fontWeight: "600" },
  emptyList: { flexGrow: 1 },
});
