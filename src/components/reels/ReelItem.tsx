
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
} from "react-native";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";

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
  containerHeight: number;
  isPlaying: boolean;
}

export default function ReelItem({
  id,
  video,
  username,
  likes,
  containerHeight,
  isPlaying,
}: ReelItemProps) {
  const videoRef = useRef<typeof Video>(null);
  const lastTap = useRef(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const [paused, setPaused] = useState(!isPlaying);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setPaused(!isPlaying);
  }, [isPlaying]);

  // Single tap → play/pause, double tap → like
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleLike();
    } else {
      setPaused((prev) => !prev);
    }
    lastTap.current = now;
  };

  const handleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => prev + (nextLiked ? 1 : -1));

    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), username, comment: newComment },
    ]);
    setNewComment("");
  };

  const onShare = async () => {
    try {
      await Share.share({ message: `Watch this reel by @${username}`, url: video });
    } catch (err) {
      console.log("Share error:", err);
    }
  };

  return (
    <>
      {/* Video Player */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={{ height: containerHeight, backgroundColor: "black" }}>
          <Video
            ref={videoRef}
            source={{ uri: video }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            repeat
            paused={paused}
          />

          {/* Heart Animation */}
          <Animated.View
            style={{
              position: "absolute",
              top: "40%",
              alignSelf: "center",
              transform: [{ scale: scaleAnim }],
              opacity: scaleAnim,
            }}
          >
            <Ionicons name="heart" size={100} color="white" />
          </Animated.View>

          {/* Right Icons */}
          <View style={{ position: "absolute", right: 10, bottom: 80, alignItems: "center" }}>
            <TouchableOpacity style={{ marginBottom: 20 }} onPress={handleLike}>
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

          {/* Bottom Left Info */}
          <View style={{ position: "absolute", left: 10, bottom: 20 }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>@{username}</Text>
            <Text style={{ color: "white", fontSize: 12 }}>🎵 Original Sound - {username}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Comments Modal */}
      <Modal visible={commentsVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setCommentsVisible(false)}>
          <View style={{ flex: 1, backgroundColor: "#00000088", justifyContent: "flex-end" }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={0}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ backgroundColor: "white", borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                  <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <Text style={{ padding: 8 }}>
                        <Text style={{ fontWeight: "bold" }}>@{item.username}: </Text>
                        {item.comment}
                      </Text>
                    )}
                    style={{ maxHeight: 300 }}
                    keyboardShouldPersistTaps="handled"
                  />
                  <View style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#ccc", padding: 8 }}>
                    <TextInput
                      placeholder="Add a comment..."
                      value={newComment}
                      onChangeText={setNewComment}
                      style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 10, height: 40 }}
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
