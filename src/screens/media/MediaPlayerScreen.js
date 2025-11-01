
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function MediaPlayerScreen({ route }) {
  const { item } = route.params;
  const videoRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currTime, setCurrTime] = useState(0);

  // quality menu state
  const [showQuality, setShowQuality] = useState(false);

  const togglePlay = () => setIsPaused(!isPaused);
  const toggleMute = () => setIsMuted(!isMuted);

  const onLoad = (data) => setDuration(data.duration);
  const onProgress = (data) => setCurrTime(data.currentTime);

  const formatTime = (sec) => {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // ✅ Dummy quality URLs (replace later from API)
  const qualityOptions = [
    { label: "240p", url: item.fileUrl },
    { label: "360p", url: item.fileUrl },
    { label: "720p", url: item.fileUrl },
    { label: "1080p", url: item.fileUrl },
  ];

  const changeQuality = (q) => {
    item.fileUrl = q.url;
    setShowQuality(false);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Video */}
      <View>
        <Video
          ref={videoRef}
          source={{ uri: item.fileUrl }}
          style={styles.video}
          resizeMode="contain"
          controls
          paused={isPaused}
          muted={isMuted}
          onLoad={onLoad}
          onProgress={onProgress}
        />

        {/* ✅ Top Right 3-Dot menu */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowQuality(true)}
        >
          <Icon name="more-vert" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* ✅ Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlay}>
          <Text style={styles.playBtn}>
            {isPaused ? "▶️ Play" : "⏸ Pause"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMute}>
          <Text style={styles.playBtn}>{isMuted ? "🔇 Mute" : "🔊 Unmute"}</Text>
        </TouchableOpacity>

        <Text style={styles.timer}>
          {formatTime(currTime)} / {formatTime(duration)}
        </Text>
      </View>

      {/* ✅ Info */}
      <ScrollView style={styles.infoBox}>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.desc}>{item?.description}</Text>

        <View style={styles.row}>
          <Text style={styles.meta}>❤️ {item?.likes?.length ?? 0}</Text>
          <Text style={styles.meta}>💬 {item?.comments?.length ?? 0}</Text>
        </View>
      </ScrollView>

      {/* ✅ Quality Modal */}
      <Modal visible={showQuality} transparent animationType="fade">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowQuality(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Quality</Text>

            {qualityOptions.map((q, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => changeQuality(q)}
                style={styles.modalItem}
              >
                <Text style={styles.modalLabel}>{q.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={toggleMute}
              style={styles.modalItem}
            >
              <Text style={styles.modalLabel}>
                {isMuted ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  video: {
    marginTop: 40,
    width: "100%",
    height: 260,
    backgroundColor: "#111",
  },

  menuButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    marginTop: 40,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },

  playBtn: { color: "white", fontSize: 16 },

  timer: { color: "white", fontSize: 16 },

  infoBox: { padding: 12 },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 6,
  },

  desc: {
    fontSize: 15,
    color: "#aaa",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
  },

  meta: { color: "#ddd", fontSize: 15 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalBox: {
    backgroundColor: "#222",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  modalItem: {
    paddingVertical: 12,
  },

  modalLabel: {
    color: "white",
    fontSize: 16,
  },
});
