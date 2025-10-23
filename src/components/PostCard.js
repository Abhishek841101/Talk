import React, { useState, useRef } from "react";
import { 
  View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, Dimensions 
} from "react-native";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikeOptimistic, addCommentOptimistic } from "../features/posts/postsSlice";
import { likePostSocket, commentOnPostSocket } from "../lib/socket";
import ShareButton from "../components/ShareButton";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // default muted

  const commentInputRef = useRef(null);

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

    dispatch(addCommentOptimistic({
      postId: post.id,
      text: trimmed,
      username: user?.username || 'You'
    }));
    commentOnPostSocket(post.id, trimmed);
    setCommentText('');
    if (!showComments) setShowComments(true);
    setShowCommentInput(false);
    Keyboard.dismiss();
  };

  const toggleComments = () => setShowComments(!showComments);
  const toggleFollow = () => setIsFollowing(!isFollowing);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);
  const toggleMute = () => setIsMuted(!isMuted);

  const openCommentInput = () => {
    setShowCommentInput(true);
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h`;
    return `${Math.floor(diff/86400000)}d`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getEngagement = () => ({
    views: formatNumber(post.views || 0),
    comments: formatNumber(post.comments?.length || 0),
    reposts: formatNumber(post.reposts || 0),
    likes: formatNumber(post.likes || 0),
  });

  const engagement = getEngagement();

  // Media handling
  const mediaUri = post.media || post.image || null;
  const mediaType = post.mediaType || (post.image ? 'image' : null);
  const hasVideo = mediaType === 'video';
  const hasImage = mediaType === 'image';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={typeof post.user?.avatar === 'string' ? { uri: post.user.avatar } : post.user?.avatar} 
          style={styles.avatar} 
        />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.username}>{post.user?.username || 'Unknown User'}</Text>
            {post.user?.is_verified && (
              <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" style={styles.verifiedBadge} />
            )}
            <TouchableOpacity onPress={toggleFollow} style={[styles.followButton, isFollowing && styles.followingButton]}>
              <Text style={[styles.followText, isFollowing && styles.followingText]}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userHandle}>@{post.user?.username?.toLowerCase() || 'user'}</Text>
        </View>
        <Text style={styles.time}>{formatTime(post.createdAt)}{post._temp && ' ⏳'}</Text>
      </View>

      {/* Caption */}
      {(post.caption || post.content?.text) && (
        <Text style={styles.caption}>{post.caption || post.content?.text}</Text>
      )}

      {/* Media */}
      {mediaUri && (
        <View style={styles.mediaContainer}>
          {hasVideo ? (
            <TouchableOpacity onPress={toggleMute}>
              <Video
                source={{ uri: mediaUri }}
                style={styles.postImage}
                resizeMode="cover"
                repeat
                muted={isMuted}
                paused={false}
              />
              <View style={styles.videoOverlay}>
                <Ionicons name={isMuted ? "volume-mute" : "volume-medium"} size={24} color="white" />
                <Text style={styles.videoDuration}>{post.media?.duration || '0:01'}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Image source={{ uri: mediaUri }} style={styles.postImage} />
          )}
        </View>
      )}

      {/* Engagement Metrics */}
      <View style={styles.engagementMetrics}>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.views}</Text> Views</Text>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.comments}</Text> Comments</Text>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.reposts}</Text> Reposts</Text>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.likes}</Text> Likes</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={openCommentInput}>
          <Ionicons name="chatbubble-outline" size={20} color="#8b98a5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="repeat-outline" size={20} color="#8b98a5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike} disabled={isLiking}>
          <Ionicons name={post.liked ? "heart" : "heart-outline"} size={20} color={post.liked ? "#e0245e" : "#8b98a5"} />
        </TouchableOpacity>
        <ShareButton item={post} type="posts" />
        <TouchableOpacity style={styles.actionButton} onPress={toggleBookmark}>
          <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={20} color={isBookmarked ? "#1DA1F2" : "#8b98a5"} />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={styles.likes}>{engagement.likes} likes</Text>

      {/* Comments */}
      {post.comments?.length > 0 && (
        <View style={styles.commentsSection}>
          <TouchableOpacity onPress={toggleComments}>
            <Text style={styles.viewComments}>
              {showComments ? 'Hide comments' : `View${post.comments.length > 1 ? ` all ${post.comments.length}` : ''} comment${post.comments.length > 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>
          {(showComments ? post.comments : post.comments.slice(0, 2)).map((comment, i) => (
            <Text key={comment.id || i} style={styles.commentPreview}>
              <Text style={styles.commentUser}>{comment.username} </Text>{comment.text}{comment._temp && ' ⏳'}
            </Text>
          ))}
        </View>
      )}

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
            <Text style={[styles.postButton, !commentText.trim() && styles.postButtonDisabled]}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TEMP Badge */}
      {post._temp && (
        <View style={styles.debugBadge}>
          <Text style={styles.debugBadgeText}>TEMP</Text>
        </View>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: "#15202b", borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: "#38444d", padding: 16, marginHorizontal: 16, maxWidth: 600, width: SCREEN_WIDTH - 32, alignSelf: 'center' },
  header: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(29, 161, 242, 0.1)" },
  userInfo: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  username: { fontWeight: "bold", color: "white", fontSize: 15 },
  verifiedBadge: { marginLeft: 4 },
  userHandle: { color: "#8b98a5", fontSize: 15 },
  followButton: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: "#1DA1F2" },
  followingButton: { backgroundColor: "#1DA1F2" },
  followText: { color: "#1DA1F2", fontSize: 12, fontWeight: "600" },
  followingText: { color: "#fff" },
  time: { color: "#8b98a5", fontSize: 15 },
  caption: { color: "white", fontSize: 15, lineHeight: 20, marginBottom: 12 },
  mediaContainer: { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#38444d", marginBottom: 8 },
  postImage: { width: "100%", height: 350, backgroundColor: '#1c2938' },
  videoOverlay: { position: "absolute", bottom: 12, left: 12, backgroundColor: "rgba(0,0,0,0.6)", flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  videoDuration: { color: "white", fontSize: 13, marginLeft: 4 },
  engagementMetrics: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#38444d", marginBottom: 12 },
  metric: { color: "#8b98a5", fontSize: 14 },
  metricNumber: { color: "white", fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8, marginBottom: 8 },
  actionButton: { padding: 8, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  likes: { fontWeight: "bold", color: "white", marginBottom: 8, fontSize: 14 },
  commentsSection: { marginBottom: 8 },
  viewComments: { color: "#8b98a5", fontSize: 14, marginBottom: 6 },
  commentPreview: { color: "white", fontSize: 14, lineHeight: 18, marginBottom: 4 },
  commentUser: { fontWeight: "bold" },
  addCommentContainer: { flexDirection: "row", alignItems: "center", paddingTop: 8, paddingBottom: 12 },
  commentInput: { flex: 1, color: "white", fontSize: 14, padding: 12, backgroundColor: '#1a1a1a', borderRadius: 18, marginRight: 8, borderWidth: 1, borderColor: "#38444d" },
  postButton: { color: "#1DA1F2", fontWeight: "600", fontSize: 14 },
  postButtonDisabled: { color: "#666" },
  debugBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: 'orange', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  debugBadgeText: { color: '#000', fontSize: 8, fontWeight: 'bold' },
});
