import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from "react-native";

interface LiveItem {
  thumbnail: ImageSourcePropType;
  viewers: string | number;
  title: string;
  host: string;
}

interface Props {
  item: LiveItem;
  onPress: (item: LiveItem) => void;
}

export default function LiveCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Image source={item.thumbnail} style={styles.thumb} />

      <View style={styles.overlay}>
        <Text style={styles.liveTag}>LIVE 🔴</Text>
        <Text style={styles.viewers}>{item.viewers}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.host}>by {item.host}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  thumb: {
    width: "100%",
    height: 180,
  },
  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  liveTag: {
    backgroundColor: "red",
    color: "#fff",
    fontWeight: "bold",
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  viewers: {
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  host: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
});
