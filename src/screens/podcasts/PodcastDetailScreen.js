import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

export default function PodcastDetailScreen({ route }) {
  const { podcast } = route.params;
  const [sound, setSound] = useState(null);

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: podcast.audioUrl });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.warn("Error playing podcast:", error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Image source={podcast.thumbnail} style={styles.image} />

      <Text style={styles.title}>{podcast.title}</Text>
      <Text style={styles.host}>By {podcast.host}</Text>
      <Text style={styles.desc}>{podcast.description}</Text>

      <TouchableOpacity onPress={playSound} style={styles.playBtn}>
        <Text style={styles.playText}>▶️ Play Podcast</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" },
  image: { width: 200, height: 200, borderRadius: 20, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  host: { color: "#777", marginVertical: 6 },
  desc: { textAlign: "center", color: "#555", marginVertical: 10 },
  playBtn: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  playText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
