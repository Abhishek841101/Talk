import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { View, FlatList, Dimensions, ActivityIndicator, Text, AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchReelsThunk } from "../../features/reels/reelsSlice";
import { RootState, AppDispatch } from "../../app/store";
import { useFocusEffect } from "@react-navigation/native";

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

  // Fetch reels once
  useEffect(() => {
    dispatch(fetchReelsThunk()).catch((err) => console.log("Fetch error:", err));
  }, [dispatch]);

  // Pause all when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => setCurrentVisibleId(null);
    }, [])
  );

  // Pause when app goes to background
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active") setCurrentVisibleId(null);
    });
    return () => sub.remove();
  }, []);

  // Remove duplicates
  const uniqueItems = React.useMemo(() => {
    const map = new Map<string, any>();
    items.forEach((i) => map.set(i._id, i));
    return [...map.values()];
  }, [items]);

  const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems?.length > 0) {
      setCurrentVisibleId(viewableItems[0]?.item?._id ?? null);
    }
  }).current;

  if (loading) {
    return <ActivityIndicator size="large" color="white" style={{ flex: 1, backgroundColor: "black" }} />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>{error}</Text>
      </View>
    );
  }

  if (!uniqueItems || uniqueItems.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>No Reels Found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        ref={flatListRef}
        data={uniqueItems}
        keyExtractor={(item) => String(item._id)}
        removeClippedSubviews
        renderItem={({ item }) => (
          <ReelItem
            id={item._id}
            video={item.videoUrl}
            username={item.username || "Anonymous"}
            likes={item.likes}
            comments={item.comments ?? []}
            containerHeight={VIDEO_HEIGHT}
            isPlaying={item._id === currentVisibleId}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={VIDEO_HEIGHT}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
}
