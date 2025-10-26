import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Dimensions,
  Modal,
} from "react-native";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikeOptimistic, addCommentOptimistic } from "../features/posts/postsSlice";
import { likePostSocket, commentOnPostSocket } from "../lib/socket";
import ShareButton from "../components/ShareButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PostCard({ post, onOpenDetail }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const commentInputRef = useRef(null);

  const handleLike = () => {
    console.log("Like pressed for post", post.id);
    if (isLiking) return;
    setIsLiking(true);
    dispatch(toggleLikeOptimistic(post.id));
    likePostSocket(post.id);
    setTimeout(() => setIsLiking(false), 500);
  };

  const handleComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    console.log("Comment posted:", trimmed);
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

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log(isFollowing ? "Unfollowed" : "Followed", post.user?.username);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    console.log(isBookmarked ? "Removed bookmark" : "Bookmarked", post.id);
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const openCommentInput = () => {
    setShowCommentInput(true);
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };
  const openOptions = () => setShowOptions(true);
  const closeOptions = () => setShowOptions(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const mediaUri = post.media || post.image || null;
  const mediaType = post.mediaType || (post.image ? "image" : null);
  const hasVideo = mediaType === "video";

  return (
    <View style={styles.card}>
      {/* Card Clickable Area */}
      <TouchableOpacity
        onPress={() => {
          console.log("Card pressed", post.id);
          onOpenDetail && onOpenDetail(post.id);
          
        }}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={
              typeof post.user?.avatar === "string"
                ? { uri: post.user.avatar }
                : post.user?.avatar
            }
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.username}>{post.user?.username || "Unknown"}</Text>
              {post.user?.is_verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#1DA1F2"
                  style={{ marginLeft: 4 }}
                />
              )}
              <TouchableOpacity
                onPress={toggleFollow}
                style={[styles.followButton, isFollowing && styles.followingButton]}
              >
                <Text style={[styles.followText, isFollowing && styles.followingText]}>
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.userHandle}>@{post.user?.username?.toLowerCase()}</Text>
          </View>
          {/* Header Right Three Dots */}
          <TouchableOpacity onPress={openOptions}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#8b98a5" />
          </TouchableOpacity>
        </View>

        {/* Caption */}
        {(post.caption || post.content?.text) && (
          <Text style={styles.caption}>{post.caption || post.content?.text}</Text>
        )}

        {/* Media */}
        {mediaUri && (
          <View style={styles.mediaContainer}>
            {hasVideo ? (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation(); // prevent card press when toggling mute
                  toggleMute();
                  console.log("Video mute toggled", isMuted ? "Muted" : "Unmuted");
                }}
              >
                <Video
                  source={{ uri: mediaUri }}
                  style={styles.postImage}
                  resizeMode="cover"
                  repeat
                  muted={isMuted}
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
              <Image source={{ uri: mediaUri }} style={styles.postImage} />
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Actions Row */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={openCommentInput}>
          <Ionicons name="chatbubble-outline" size={20} color="#8b98a5" />
          <Text style={styles.actionCount}>{formatNumber(post.comments?.length || 0)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="repeat-outline" size={20} color="#8b98a5" />
          <Text style={styles.actionCount}>{formatNumber(post.reposts || 0)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike} disabled={isLiking}>
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={20}
            color={post.liked ? "#e0245e" : "#8b98a5"}
          />
          <Text style={styles.actionCount}>{formatNumber(post.likes || 0)}</Text>
        </TouchableOpacity>
        <ShareButton item={post} type="posts" />
        <TouchableOpacity style={styles.actionButton} onPress={toggleBookmark}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={isBookmarked ? "#1DA1F2" : "#8b98a5"}
          />
        </TouchableOpacity>
      </View>

      {/* Comment Input */}
      {showCommentInput && (
        <View style={styles.addCommentContainer}>
          <TextInput
            ref={commentInputRef}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="#666"
            style={styles.commentInput}
            onSubmitEditing={handleComment}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleComment} disabled={!commentText.trim()}>
            <Text
              style={[styles.postButton, !commentText.trim() && styles.postButtonDisabled]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Sheet Modal */}
      <Modal visible={showOptions} transparent animationType="slide" onRequestClose={closeOptions}>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeOptions} activeOpacity={1} />
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetText}>Hide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem} onPress={closeOptions}>
            <Text style={[styles.sheetText, { color: "#e0245e" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// Styles remain same as your original code
const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: "#15202b", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#38444d", padding: 16, marginHorizontal: 16, maxWidth: 600, width: SCREEN_WIDTH - 32, alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(29, 161, 242, 0.1)" },
  userInfo: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  username: { fontWeight: "bold", color: "white", fontSize: 15 },
  userHandle: { color: "#8b98a5", fontSize: 13 },
  followButton: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: "#1DA1F2" },
  followingButton: { backgroundColor: "#1DA1F2" },
  followText: { color: "#1DA1F2", fontSize: 12, fontWeight: "600" },
  followingText: { color: "#fff" },
  caption: { color: "white", fontSize: 15, lineHeight: 20, marginBottom: 12 },
  mediaContainer: { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#38444d", marginBottom: 8 },
  postImage: { width: "100%", height: 350, backgroundColor: "#1c2938" },
  videoOverlay: { position: "absolute", bottom: 12, left: 12, backgroundColor: "rgba(0,0,0,0.6)", flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  actions: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4, marginBottom: 8 },
  actionButton: { flexDirection: "row", alignItems: "center", padding: 8 },
  actionCount: { color: "#8b98a5", fontSize: 13, marginLeft: 4 },
  addCommentContainer: { flexDirection: "row", alignItems: "center", paddingTop: 8, paddingBottom: 12 },
  commentInput: { flex: 1, color: "white", fontSize: 14, padding: 12, backgroundColor: "#1a1a1a", borderRadius: 18, marginRight: 8, borderWidth: 1, borderColor: "#38444d" },
  postButton: { color: "#1DA1F2", fontWeight: "600", fontSize: 14 },
  postButtonDisabled: { color: "#666" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  bottomSheet: { position: "absolute", bottom: 0, width: "100%", height: "50%", backgroundColor: "#15202b", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "#38444d" },
  sheetHandle: { width: 40, height: 4, backgroundColor: "#8b98a5", borderRadius: 2, alignSelf: "center", marginBottom: 12 },
  sheetItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#38444d" },
  sheetText: { color: "white", fontSize: 16 },
});
