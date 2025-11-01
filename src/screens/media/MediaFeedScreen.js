// screens/media/MediaFeedScreen.js
import React, { useEffect } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMedia } from "../../features/media/mediaSlice";

import MediaCard from "../../components/media/MediaCard";
import LiveCard from "../../components/media/LiveCard";

export default function MediaFeedScreen({ navigation }) {
  const dispatch = useDispatch();
  const { mediaList } = useSelector((s) => s.media);

  useEffect(() => {
    dispatch(fetchAllMedia());
  }, []);

  const liveDummy = [
    {
      id: "1",
      title: "Morning Talk",
      thumbnail:
        "https://picsum.photos/200/200?random=1",
    },
    {
      id: "2",
      title: "Live Coding",
      thumbnail:
        "https://picsum.photos/200/200?random=2",
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#111315", padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ✅ Search bar placeholder */}
      <View
        style={{
          height: 45,
          backgroundColor: "#1C1F24",
          borderRadius: 20,
          justifyContent: "center",
          paddingHorizontal: 14,
          marginBottom: 18,
        }}
      >
        <Text style={{ color: "#9CA3AF" }}>🔍 Search podcasts, creators…</Text>
      </View>

      {/* ✅ Live Now Section */}
      <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
        LIVE NOW
      </Text>
      <FlatList
        horizontal
        data={liveDummy}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <LiveCard item={item} onPress={() => {}} />
        )}
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 12 }}
      />

      {/* ✅ Tabs Placeholder */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", gap: 20, marginBottom: 16 }}
      >
        {["For You", "Trending", "Music", "Dance", "Lecture"].map((t) => (
          <Text key={t} style={{ color: "white", fontSize: 15 }}>
            {t}
          </Text>
        ))}
      </ScrollView>

      {/* ✅ Main Feed */}
      {mediaList?.map((item) => (
        <MediaCard
          key={item._id}
          item={item}
          onPress={() =>
            navigation.navigate("MediaPlayer", { item })
          }
        />
      ))}
    </ScrollView>
  );
}
