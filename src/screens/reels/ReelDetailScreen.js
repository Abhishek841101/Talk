import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import ReelItem from "../../components/Reels/ReelItem";
import CommentsSheet from "../../components/Reels/CommentsSheet";
import { fetchReels } from "../../features/reels/reelsSlice";

const { height } = Dimensions.get("window");

export default function ReelDetailScreen() {
  const route = useRoute();
  const { reelId, openComments } = route.params;

  const dispatch = useDispatch();
  const flatRef = useRef(null);

  const { items: reels } = useSelector((state) => state.reels);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);

  // ✅ Load reels if not loaded
  useEffect(() => {
    if (!reels?.length) {
      dispatch(fetchReels());
    }
  }, []);

  // ✅ Scroll to correct reel
  useEffect(() => {
    if (!reels?.length) return;

    const index = reels.findIndex((r) => r._id === reelId);
    if (index !== -1) {
      setActiveIndex(index);

      setTimeout(() => {
        flatRef?.current?.scrollToIndex({
          index,
          animated: false,
        });
      }, 100);
    }
  }, [reels]);

  // ✅ Auto open comments
  useEffect(() => {
    if (openComments) {
      setTimeout(() => setShowComments(true), 400);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        ref={flatRef}
        data={reels}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ReelItem
            item={item}
            isActive={index === activeIndex}
            onShowComments={() => setShowComments(true)}
          />
        )}
        onMomentumScrollEnd={(ev) => {
          const newIndex = Math.round(
            ev.nativeEvent.contentOffset.y / height
          );
          setActiveIndex(newIndex);
        }}
      />

      {/* ✅ Comment Modal */}
      <CommentsSheet
        visible={showComments}
        onClose={() => setShowComments(false)}
        reel={reels[activeIndex]}
      />
    </View>
  );
}
