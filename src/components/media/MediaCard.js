// components/media/MediaCard.js
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function MediaCard({ item, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: 15,
        backgroundColor: "#1C1F24",
        borderRadius: 14,
        padding: 12,
      }}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: item.thumbnail }}
        style={{
          width: "100%",
          height: 180,
          borderRadius: 12,
        }}
      />

      {/* Details */}
      <View style={{ marginTop: 10 }}>
        <Text
          style={{ color: "white", fontSize: 16, fontWeight: "600" }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {item.author} • {item.duration}
        </Text>
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 20,
          marginTop: 8,
        }}
      >
        <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
          ❤️ {item.likes || 0}
        </Text>
        <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
          💬 {item.comments || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
