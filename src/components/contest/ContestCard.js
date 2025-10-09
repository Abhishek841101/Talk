// // src/components/ContestCard.js
// import React from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

// export default function ContestCard({ contest, onPress }) {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <Image source={{ uri: contest.image }} style={styles.image} />
//       <View style={styles.info}>
//         <Text style={styles.title}>{contest.title}</Text>
//         <Text style={styles.description} numberOfLines={2}>
//           {contest.description}
//         </Text>
//         <View style={styles.details}>
//           <Text style={styles.prize}>Prize: {contest.prize}</Text>
//           <Text style={styles.entry}>Entry: {contest.entry}</Text>
//         </View>
//        <Text style={styles.participants}>
//   {contest.participants?.length || 0} participants
// </Text>

//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 12,
//     overflow: "hidden",
//     elevation: 3, // shadow for Android
//     shadowColor: "#000", // shadow for iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },
//   info: {
//     flex: 1,
//     padding: 10,
//     justifyContent: "space-between",
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#FF6B00",
//   },
//   description: {
//     fontSize: 12,
//     color: "#555",
//     marginVertical: 4,
//   },
//   details: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   prize: {
//     fontWeight: "bold",
//     color: "#0A8F08",
//   },
//   entry: {
//     fontWeight: "bold",
//     color: "#FF4500",
//   },
//   participants: {
//     fontSize: 12,
//     color: "#555",
//     marginTop: 4,
//   },
// });
