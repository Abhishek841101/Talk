import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import PodcastCard from "../../components/podcasts/PodcastCard";
import { samplePodcasts } from "../../data/samplePodcasts";

export default function PodcastFeedScreen({ navigation }) {
  const [podcasts] = useState(samplePodcasts);

  const handleOpen = (item) => {
    navigation.navigate("PodcastDetailScreen", { podcast: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎧 Trending Podcasts</Text>
      <FlatList
        data={podcasts}
        renderItem={({ item }) => (
          <PodcastCard item={item} onPress={handleOpen} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
});
