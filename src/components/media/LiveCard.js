// components/media/LiveCard.js
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function LiveCard({ item, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 120,
        marginRight: 12,
        backgroundColor: "#1C1F24",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={{ width: "100%", height: 90 }}
      />

      <View style={{ padding: 6 }}>
        <Text style={{ color: "red", fontWeight: "600" }}>● LIVE</Text>
        <Text style={{ color: "white" }} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
