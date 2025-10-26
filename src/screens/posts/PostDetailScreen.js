import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Keyboard,
  Dimensions,
  Modal,
  Share,
} from "react-native";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { toggleLikeOptimistic, addCommentOptimistic } from "../../features/posts/postsSlice";
import { likePostSocket, commentOnPostSocket } from "../../lib/socket";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PostDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts.posts.find((p) => p.id === postId));
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const commentInputRef = useRef(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  if (!post) return <Text style={{ color: "#fff", marginTop: 20 }}>Post not found</Text>;

  const handleLike = () => {
    if (isLiking) return;
    setIsLiking(true);
    dispatch(toggleLikeOptimistic(post.id));
    likePostSocket(post.id);
    setTimeout(() => setIsLiking(false), 500);
  };

  const handleComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    dispatch(
      addCommentOptimistic({
        postId: post.id,
        text: trimmed,
        username: user?.username || "You",
      })
    );
    commentOnPostSocket(post.id, trimmed);
    setCommentText("");
    setShowCommentInput(false);
    Keyboard.dismiss();
  };

  const toggleFollow = () => setIsFollowing(!isFollowing);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);
  const toggleOptions = () => setShowOptions(!showOptions);

  const handleShare = async () => {
    try {
      await Share.share({
        message: post.caption || post.content?.text || "",
        url: post.media || post.image || "",
      });
    } catch (error) {
      console.log("Share error", error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const mediaUri = post.media || post.image || null;
  const mediaType = post.mediaType || (post.image ? "image" : null);
  const hasVideo = mediaType === "video";

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#9bd8e7ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PostDetails</Text>
        <TouchableOpacity onPress={toggleOptions}>
          <Ionicons name="ellipsis-horizontal" size={28} color="#49cee6ff" />
        </TouchableOpacity>
      </View>

      {/* Options Modal */}
      <Modal visible={showOptions} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleOptions} />
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetText}>Hide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem} onPress={handleShare}>
            <Text style={styles.sheetText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem} onPress={toggleOptions}>
            <Text style={[styles.sheetText, { color: "#e0245e" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Post + Comments */}
      <FlatList
        data={post.comments || []}
        keyExtractor={(item, index) => item.id || index.toString()}
        ListHeaderComponent={
          <>
            {/* Post Card Like UI */}
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Image source={{ uri: post.user?.avatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.username}>{post.user?.username}</Text>
                    {post.user?.is_verified && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#1DA1F2"
                        style={{ marginLeft: 4 }}
                      />
                    )}
                    <TouchableOpacity
                      style={[styles.followButton, isFollowing && styles.followingButton]}
                      onPress={toggleFollow}
                    >
                      <Text style={[styles.followText, isFollowing && styles.followingText]}>
                        {isFollowing ? "Following" : "Follow"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {post.caption && <Text style={styles.caption}>{post.caption}</Text>}
                </View>
              </View>

              {/* Media */}
              {mediaUri && (
                <View style={styles.mediaContainer}>
                  {hasVideo ? (
                    <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
                      <Video
                        source={{ uri: mediaUri }}
                        style={styles.media}
                        repeat
                        muted={isMuted}
                        resizeMode="cover"
                      />
                      <View style={styles.videoOverlay}>
                        <Ionicons
                          name={isMuted ? "volume-mute" : "volume-medium"}
                          size={20}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Image source={{ uri: mediaUri }} style={styles.media} />
                  )}
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={handleLike} style={styles.actionBtn} disabled={isLiking}>
                  <Ionicons
                    name={post.liked ? "heart" : "heart-outline"}
                    size={28}
                    color={post.liked ? "#e0245e" : "#fff"}
                  />
                  <Text style={styles.actionText}>{formatNumber(post.likes)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowCommentInput(true)} style={styles.actionBtn}>
                  <Ionicons name="chatbubble-outline" size={28} color="#fff" />
                  <Text style={styles.actionText}>{formatNumber(post.comments?.length || 0)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                  <Ionicons name="share-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={toggleBookmark}>
                  <Ionicons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={28}
                    color={isBookmarked ? "#1DA1F2" : "#fff"}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.commentsTitle}>Comments</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Text style={{ color: "#fff" }}>
              <Text style={{ fontWeight: "bold" }}>{item.username} </Text>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Add Comment */}
      {showCommentInput && (
        <View style={styles.commentInputRow}>
          <TextInput
            ref={commentInputRef}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="#888"
            style={styles.commentInput}
            onSubmitEditing={handleComment}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleComment} disabled={!commentText.trim()}>
            <Text style={[styles.postBtn, !commentText.trim() && { color: "#666" }]}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Styles (reuse from PostCard + minor tweaks)
const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", padding: 16, justifyContent: "space-between", borderBottomWidth: 1, borderColor: "#333" },
  headerTitle: { color: "#eceef3ff", fontSize: 18, fontWeight: "bold",marginTop:25 },
  card: { backgroundColor: "#15202b", marginBottom: 12, borderRadius: 16, overflow: "hidden" },
  cardHeader: { flexDirection: "row", padding: 16, alignItems: "flex-start" },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  username: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  followButton: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: "#1DA1F2" },
  followingButton: { backgroundColor: "#1DA1F2" },
  followText: { color: "#1DA1F2", fontSize: 12, fontWeight: "600" },
  followingText: { color: "#fff" },
  caption: { color: "#fff", marginTop: 4 },
  mediaContainer: { borderRadius: 16, overflow: "hidden" },
  media: { width: SCREEN_WIDTH, height: 300, backgroundColor: "#111" },
  videoOverlay: { position: "absolute", bottom: 12, left: 12, backgroundColor: "rgba(0,0,0,0.6)", flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  actionRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, justifyContent: "space-between" },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionText: { color: "#fff", fontWeight: "bold" },
  commentsTitle: { color: "#fff", fontWeight: "bold", paddingHorizontal: 16 },
  commentRow: { paddingHorizontal: 16, paddingVertical: 8 },
  commentInputRow: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", backgroundColor: "#111", padding: 8, borderTopWidth: 1, borderColor: "#333" },
  commentInput: { flex: 1, color: "#fff", backgroundColor: "#222", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  postBtn: { color: "#1DA1F2", fontWeight: "bold", alignSelf: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  bottomSheet: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "#15202b", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  sheetHandle: { width: 40, height: 4, backgroundColor: "#8b98a5", borderRadius: 2, alignSelf: "center", marginBottom: 12 },
  sheetItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#38444d" },
  sheetText: { color: "#fff", fontSize: 16 },
});
