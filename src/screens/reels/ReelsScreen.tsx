


import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { View, FlatList, Dimensions, ActivityIndicator, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchReelsThunk } from "../../features/reels/reelsSlice";
import { RootState, AppDispatch } from "../../app/store";
// import API_BASE from "../../lib/api";

import ReelItem from "../../components/reels/ReelItem";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = 80;
const TABBAR_HEIGHT = 70;
const VIDEO_HEIGHT = height - HEADER_HEIGHT - TABBAR_HEIGHT;

export default function ReelsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.reels);
  const flatListRef = useRef<FlatList>(null);
  const [currentVisibleId, setCurrentVisibleId] = useState<string | null>(null);

  // 🔹 Fetch reels only once
  useEffect(() => {
    console.log("📡 [ReelsScreen] Fetching reels...");
    dispatch(fetchReelsThunk())
      .unwrap()
      .then((res) => console.log("✅ [ReelsScreen] Reels fetched:", res.length))
      .catch((err) => console.log("❌ [ReelsScreen] Fetch error:", err));
  }, [dispatch]);

  // 🔹 Safer viewability handler
  const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) {
      console.log("⚠️ [ReelsScreen] No viewable items");
      return;
    }
    const visibleId = viewableItems[0]?.item?._id || null;
    console.log("👀 [ReelsScreen] Currently visible:", visibleId);
    setCurrentVisibleId(visibleId);
  }).current;

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="white"
        style={{ flex: 1, backgroundColor: "black" }}
      />
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white" }}>{error}</Text>
      </View>
    );
  }

  if (!items || items.length === 0) {
    console.log("📭 [ReelsScreen] No reels available");
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white" }}>No Reels Found</Text>
      </View>
    );
  }

  console.log("🎬 [ReelsScreen] Rendering FlatList, items:", items.length);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item, index) => {
          console.log("🔑 [ReelsScreen] keyExtractor:", index, item._id);
          return item._id || index.toString();
        }}
        renderItem={({ item, index }) => {
          console.log(
            `🖼️ [ReelsScreen] renderItem index=${index}, id=${item._id}, playing=${item._id === currentVisibleId}`
          );
          return (
            <ReelItem
              id={item._id}
              video={
                item.videoUrl?.startsWith("http")
                  ? item.videoUrl
                  : `${API_BASE}${item.videoUrl}`
              }
              username={item.username || "Anonymous"}
              likes={item.likes}
              containerHeight={VIDEO_HEIGHT}
              isPlaying={item._id === currentVisibleId}
            />
          );
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={VIDEO_HEIGHT}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
}

