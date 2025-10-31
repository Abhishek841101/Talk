import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Modal,
  FlatList,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { likeReelThunk, unlikeReelThunk, commentReelThunk } from "../../features/reels/reelsSlice";

interface Comment {
  id: string;
  username: string;
  comment: string;
}

interface ReelItemProps {
  id: string;
  video: string;
  username: string;
  likes: number;
  comments?: Comment[];
  containerHeight: number;
  isPlaying: boolean;
}

export default function ReelItem({
  id,
  video,
  username,
  likes,
  comments: initialComments = [],
  containerHeight,
  isPlaying,
}: ReelItemProps) {
  const dispatch = useDispatch();
  const videoRef = useRef<Video | null>(null);
  const lastTap = useRef(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const [paused, setPaused] = useState(!isPlaying);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);

  useEffect(() => setPaused(!isPlaying), [isPlaying]);

  // Double tap detection & play/pause
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleLikePress();
    } else {
      setPaused((p) => !p);
    }
    lastTap.current = now;
  };

  const handleLikePress = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));

    // Optimistic UI update; dispatch thunk to persist
    if (next) dispatch(likeReelThunk(id));
    else dispatch(unlikeReelThunk(id));

    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleSendComment = () => {
    const text = newComment.trim();
    if (!text) return;
    // optimistic UI push (local id); server will return updated reel
    const temp = { id: Date.now().toString(), username: username || "You", comment: text };
    setComments((c) => [...c, temp]);
    setNewComment("");
    dispatch(commentReelThunk({ id, comment: text }));
  };

  const onShare = async () => {
    try {
      await Share.share({ message: `Watch this reel by @${username}`, url: video });
    } catch (err) {
      console.warn("Share error:", err);
    }
  };

  // Video load -> get natural size to compute aspect ratio (video-native)
  const onLoad = (meta: any) => {
    setLoadingVideo(false);
    try {
      const { naturalSize } = meta;
      if (naturalSize?.width && naturalSize?.height) {
        setVideoAspectRatio(naturalSize.width / naturalSize.height);
      } else {
        setVideoAspectRatio(null);
      }
    } catch (e) {
      setVideoAspectRatio(null);
    }
  };

  // style helpers to ensure small video centered and not showing next reel
  const videoStyle = (() => {
    if (!videoAspectRatio) {
      // fallback full width, clipped
      return { width: "100%", height: containerHeight };
    }
    const screenW = "100%";
    // Using aspectRatio via style requires numeric width/height or aspectRatio property
    return { width: "100%", aspectRatio: videoAspectRatio };
  })();

  return (
    <>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={[styles.container, { height: containerHeight }]}>
          {loadingVideo && <ActivityIndicator size="large" color="white" style={StyleSheet.absoluteFill} />}

          <Video
            ref={(r) => (videoRef.current = r)}
            source={{ uri: video }}
            style={[videoStyle, { alignSelf: "center" }]}
            resizeMode="contain" // contain ensures smaller videos are centered and not stretched
            repeat
            paused={paused}
            onLoad={onLoad}
          />

          {/* Heart anim */}
          <Animated.View style={[styles.heartAnim, { transform: [{ scale: scaleAnim }], opacity: scaleAnim }]}>
            <Ionicons name="heart" size={100} color="white" />
          </Animated.View>

          {/* Right icons */}
          <View style={styles.rightIcons}>
            <TouchableOpacity style={{ marginBottom: 20, alignItems: "center" }} onPress={handleLikePress}>
              <Ionicons name={liked ? "heart" : "heart-outline"} size={32} color={liked ? "red" : "white"} />
              <Text style={{ color: "white", textAlign: "center" }}>{likeCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => setCommentsVisible(true)}>
              <Ionicons name="chatbubble-outline" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 20 }} onPress={onShare}>
              <Ionicons name="share-social-outline" size={32} color="white" />
            </TouchableOpacity>

            <Ionicons name="musical-notes" size={32} color="white" />
          </View>

          {/* bottom-left info */}
          <View style={styles.bottomLeft}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>@{username}</Text>
            <Text style={{ color: "white", fontSize: 12 }}>🎵 Original Sound - {username}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Comments modal */}
      <Modal visible={commentsVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setCommentsVisible(false)}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={comments}
                    keyExtractor={(it) => it.id}
                    renderItem={({ item }) => (
                      <Text style={{ padding: 8 }}>
                        <Text style={{ fontWeight: "bold" }}>@{item.username}: </Text>
                        {item.comment}
                      </Text>
                    )}
                    style={{ maxHeight: 300 }}
                    keyboardShouldPersistTaps="handled"
                  />

                  <View style={styles.commentRow}>
                    <TextInput
                      placeholder="Add a comment..."
                      value={newComment}
                      onChangeText={setNewComment}
                      style={styles.commentInput}
                      onSubmitEditing={handleSendComment}
                      returnKeyType="send"
                    />
                    <TouchableOpacity onPress={handleSendComment}>
                      <Text style={{ marginLeft: 8, color: "blue", fontWeight: "bold" }}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "black", justifyContent: "center", overflow: "hidden" },
  heartAnim: { position: "absolute", top: "40%", alignSelf: "center" },
  rightIcons: { position: "absolute", right: 10, bottom: 80, alignItems: "center" },
  bottomLeft: { position: "absolute", left: 10, bottom: 20 },
  modalOverlay: { flex: 1, backgroundColor: "#00000088", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  commentRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#ccc", padding: 8 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 10, height: 40 },
});
