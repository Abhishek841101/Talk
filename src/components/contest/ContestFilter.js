// // src/components/ContestFilter.js
// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// const categories = ["Recommended", "Starting Soon", "Popular"];

// export default function ContestFilter({ selected, onChange }) {
//   return (
//     <View style={styles.container}>
//       {categories.map((cat) => (
//         <TouchableOpacity
//           key={cat}
//           style={[
//             styles.tab,
//             selected === cat && styles.activeTab
//           ]}
//           onPress={() => onChange(cat)}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               selected === cat && styles.activeTabText
//             ]}
//           >
//             {cat}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     marginBottom: 10,
//     justifyContent: "space-around",
//     backgroundColor: "#f0f0f0",
//     borderRadius: 12,
//     padding: 5,
//   },
//   tab: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//   },
//   activeTab: {
//     backgroundColor: "#FF6B00",
//   },
//   tabText: {
//     color: "#555",
//     fontWeight: "bold",
//   },
//   activeTabText: {
//     color: "#fff",
//   },
// });
