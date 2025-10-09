// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useDispatch } from 'react-redux';
// import { toggleLike } from '../features/posts/postsSlice';

// export default function PostCard({ post }) {
//   const dispatch = useDispatch();

//   return (
//     <View style={styles.card}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
//         <Text style={styles.username}>{post.user.username}</Text>
//       </View>

//       {/* Post Image */}
//       <Image source={{ uri: post.image }} style={styles.postImage} />

//       {/* Actions */}
//       <View style={styles.actions}>
//         <TouchableOpacity onPress={() => dispatch(toggleLike(post.id))}>
//           <Ionicons name={post.liked ? "heart" : "heart-outline"} size={24} color={post.liked ? "red" : "black"} />
//         </TouchableOpacity>
//         <Ionicons name="chatbubble-outline" size={24} style={styles.icon} />
//         <Ionicons name="paper-plane-outline" size={24} />
//       </View>

//       {/* Likes */}
//       <Text style={styles.likes}>{post.likes} likes</Text>

//       {/* Caption */}
//       <Text style={styles.caption}><Text style={styles.username}>{post.user.username}</Text> {post.caption}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: { marginBottom: 20 },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
//   avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
//   username: { fontWeight: 'bold' },
//   postImage: { width: '100%', height: 400 },
//   actions: { flexDirection: 'row', padding: 10 },
//   icon: { marginHorizontal: 10 },
//   likes: { paddingHorizontal: 10, fontWeight: 'bold' },
//   caption: { paddingHorizontal: 10 },
// });






import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PostCard({ post }) {
  return (
    <View style={styles.card}>
      {/* Header: avatar + username + time */}
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.time}>{post.time}</Text>
        </View>
      </View>

      {/* Post Image */}
      <Image source={{ uri: post.image }} style={styles.postImage} />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={post.onLike}>
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={24}
            color={post.liked ? "red" : "black"}
          />
        </TouchableOpacity>
        <Ionicons name="chatbubble-outline" size={24} style={styles.icon} />
        <Ionicons name="paper-plane-outline" size={24} />
      </View>

      {/* Likes */}
      <Text style={styles.likes}>{post.likes} likes</Text>

      {/* Caption / Description */}
      <Text style={styles.caption}>
        <Text style={styles.username}>{post.user.username} </Text>
        {post.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 0, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", padding: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  username: { fontWeight: "bold" },
  time: { color: "gray", fontSize: 12 },
  postImage: { width: "100%", height: 400 },
  actions: { flexDirection: "row", padding: 10 },
  icon: { marginHorizontal: 10 },
  likes: { paddingHorizontal: 10, fontWeight: "bold" },
  caption: { paddingHorizontal: 10, paddingBottom: 10 },
});
