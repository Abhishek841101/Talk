import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import LiveCard from "../../components/live/LiveCard";
import { sampleLive } from "../../data/sampleLive";

export default function LiveFeedScreen({ navigation }) {
  const [lives] = useState(sampleLive);

  const handleOpen = (item) => {
    navigation.navigate("LiveDetailScreen", { live: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔴 Live Now</Text>

      <FlatList
        data={lives}
        renderItem={({ item }) => (
          <LiveCard item={item} onPress={handleOpen} />
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
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
});
