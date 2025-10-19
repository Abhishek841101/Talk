// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useDispatch } from 'react-redux';
// import { toggleLike } from '../features/posts/postsSlice';

// export default function PostCard({ post }) {
//   const dispatch = useDispatch();

//   return (
//     <View style={styles.card}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
//         <Text style={styles.username}>{post.user.username}</Text>
//       </View>

//       {/* Post Image */}
//       <Image source={{ uri: post.image }} style={styles.postImage} />

//       {/* Actions */}
//       <View style={styles.actions}>
//         <TouchableOpacity onPress={() => dispatch(toggleLike(post.id))}>
//           <Ionicons name={post.liked ? "heart" : "heart-outline"} size={24} color={post.liked ? "red" : "black"} />
//         </TouchableOpacity>
//         <Ionicons name="chatbubble-outline" size={24} style={styles.icon} />
//         <Ionicons name="paper-plane-outline" size={24} />
//       </View>

//       {/* Likes */}
//       <Text style={styles.likes}>{post.likes} likes</Text>

//       {/* Caption */}
//       <Text style={styles.caption}><Text style={styles.username}>{post.user.username}</Text> {post.caption}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: { marginBottom: 20 },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
//   avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
//   username: { fontWeight: 'bold' },
//   postImage: { width: '100%', height: 400 },
//   actions: { flexDirection: 'row', padding: 10 },
//   icon: { marginHorizontal: 10 },
//   likes: { paddingHorizontal: 10, fontWeight: 'bold' },
//   caption: { paddingHorizontal: 10 },
// });




import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Keyboard,
  Dimensions 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
// import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikeOptimistic, addCommentOptimistic } from "../features/posts/postsSlice";
import { likePostSocket, commentOnPostSocket } from "../lib/socket";
import ShareButton from "../components/ShareButton";
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleFollow = () => setIsFollowing(!isFollowing);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);
  const toggleMute = () => setIsMuted(!isMuted);

  const openCommentInput = () => {
    setShowCommentInput(true);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
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
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Get engagement metrics
  const getEngagementMetrics = () => {
    if (post.engagement) {
      return post.engagement;
    }
    
    return {
      views: formatNumber(post.views || 0),
      comments: formatNumber(post.comments?.length || 0),
      reposts: formatNumber(post.reposts || 0),
      likes: formatNumber(post.likes || 0)
    };
  };

  const engagement = getEngagementMetrics();

  // Check if post has video
  const hasVideo = post.media?.type === 'video' || post.content?.media?.type === 'video';
  const hasImage = post.image || post.media?.type === 'image' || post.content?.media?.type === 'image';

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

      {/* Post Content */}
      <View style={styles.content}>
        {/* Text/Caption */}
        {(post.caption || post.content?.text) && (
          <Text style={styles.caption}>
            {post.caption || post.content?.text}
          </Text>
        )}

        {/* Media - Image or Video */}
        {(hasImage || hasVideo) && (
          <View style={styles.mediaContainer}>
            {hasVideo ? (
              // Video Post
              <View style={styles.videoPreview}>
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="play-circle" size={48} color="#8b98a5" />
                </View>
                <View style={styles.videoOverlay}>
                  <Ionicons name="play" size={12} color="white" />
                  <Text style={styles.videoDuration}>
                    {post.media?.duration || post.content?.media?.duration || '0:01'}
                  </Text>
                </View>
              </View>
            ) : (
              // Image Post
              <Image 
                source={typeof post.image === 'string' ? { uri: post.image } : post.image} 
                style={styles.postImage} 
              />
            )}
          </View>
        )}
      </View>

      {/* Engagement Metrics - Twitter Style */}
      <View style={styles.engagementMetrics}>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.views}</Text> Views</Text>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.comments}</Text> Comments</Text>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.reposts}</Text> Reposts</Text>
        <Text style={styles.metric}><Text style={styles.metricNumber}>{engagement.likes}</Text> Likes</Text>
      </View>

      {/* Action Buttons - Twitter Style */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.commentButton]} 
          onPress={openCommentInput}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#8b98a5" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.repostButton]}>
          <Ionicons name="repeat-outline" size={20} color="#8b98a5" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]} 
          onPress={handleLike}
          disabled={isLiking}
        >
          <Ionicons 
            name={post.liked ? "heart" : "heart-outline"} 
            size={20} 
            color={post.liked ? "#e0245e" : "#8b98a5"} 
          />
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.actionButton, styles.shareButton]}>
          <Ionicons name="paper-plane-outline" size={20} color="#8b98a5" />
        </TouchableOpacity> */}
<ShareButton item={post} type="posts" />
        <TouchableOpacity 
          style={[styles.actionButton, styles.bookmarkButton]} 
          onPress={toggleBookmark}
        >
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={isBookmarked ? "#1DA1F2" : "#8b98a5"} 
          />
        </TouchableOpacity>

        {/* Show mute button only for videos */}
        {hasVideo && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.muteButton]} 
            onPress={toggleMute}
          >
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-medium"} 
              size={20} 
              color={isMuted ? "#ffad1f" : "#8b98a5"} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Likes Count */}
      <Text style={styles.likes}>{engagement.likes} likes</Text>

      {/* Comments Section */}
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
            enablesReturnKeyAutomatically
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

const styles = StyleSheet.create({
  card: { 
    marginBottom: 12, 
    backgroundColor: "#15202b", 
    position: 'relative', 
    borderRadius: 16, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#38444d",
    padding: 16,
    marginHorizontal: 16,
    maxWidth: 600,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
  },
  header: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    marginBottom: 12 
  },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24,
    backgroundColor: "rgba(29, 161, 242, 0.1)",
  },
  userInfo: { 
    flex: 1, 
    marginLeft: 12 
  },
  nameRow: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 2,
  },
  username: { 
    fontWeight: "bold", 
    color: "white", 
    fontSize: 15 
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  userHandle: { 
    color: "#8b98a5", 
    fontSize: 15 
  },
  followButton: { 
    marginLeft: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: "#1DA1F2" 
  },
  followingButton: { 
    backgroundColor: "#1DA1F2" 
  },
  followText: { 
    color: "#1DA1F2", 
    fontSize: 12, 
    fontWeight: "600" 
  },
  followingText: { 
    color: "#fff" 
  },
  time: { 
    color: "#8b98a5", 
    fontSize: 15 
  },

  content: {
    marginBottom: 12,
  },
  caption: { 
    color: "white", 
    fontSize: 15, 
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // Media styles
  mediaContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#38444d",
    marginBottom: 8,
  },
  postImage: { 
    width: "100%", 
    height: 350, 
    backgroundColor: '#1c2938'
  },
  videoPreview: {
    position: "relative",
  },
  videoPlaceholder: {
    height: 300,
    backgroundColor: "#1c2938",
    justifyContent: "center",
    alignItems: "center",
  },
  videoOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDuration: {
    color: "white",
    fontSize: 13,
    marginLeft: 4,
  },

  // Engagement metrics
  engagementMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#38444d",
    marginBottom: 12,
  },
  metric: {
    color: "#8b98a5",
    fontSize: 14,
  },
  metricNumber: {
    color: "white",
    fontWeight: "bold",
  },

  // Actions
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Comments and other elements
  likes: { 
    fontWeight: "bold", 
    color: "white", 
    marginBottom: 8, 
    fontSize: 14 
  },
  commentsSection: { 
    marginBottom: 8 
  },
  viewComments: { 
    color: "#8b98a5", 
    fontSize: 14, 
    marginBottom: 6 
  },
  commentPreview: { 
    color: "white", 
    fontSize: 14, 
    lineHeight: 18,
    marginBottom: 4,
  },
  commentUser: { 
    fontWeight: "bold" 
  },
  addCommentContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingTop: 8, 
    paddingBottom: 12 
  },
  commentInput: { 
    flex: 1, 
    color: "white", 
    fontSize: 14, 
    padding: 12, 
    backgroundColor: '#1a1a1a', 
    borderRadius: 18, 
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#38444d",
  },
  postButton: { 
    color: "#1DA1F2", 
    fontWeight: "600", 
    fontSize: 14 
  },
  postButtonDisabled: { 
    color: "#666" 
  },
  debugBadge: { 
    position: 'absolute', 
    top: 5, 
    right: 5, 
    backgroundColor: 'orange', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  debugBadgeText: { 
    color: '#000', 
    fontSize: 8, 
    fontWeight: 'bold' 
  },
});