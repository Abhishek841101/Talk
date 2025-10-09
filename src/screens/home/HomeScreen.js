

// import React from 'react';
// import { View, FlatList, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../../components/common/Header';
// // import Stories from '../components/Stories';
// // import PostCard from '../components/common/PostCard';

// export default function HomeScreen() {
//   const posts = useSelector((state) => state.posts.posts);
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       {/* Header with Chat Icon */}
//       <Header navigation={navigation} />

//       {/* Stories + Posts */}
//       {/* <FlatList
//         data={posts}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={<Stories />}
//         renderItem={({ item }) => <PostCard post={item} />}
//       /> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
// });



// import React from 'react';
// import { View, FlatList, StyleSheet, Text } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../../components/common/Header';
// import PostCard from '../../components/common/PostCard'; // uncomment if exists
// import Stories from '../../components/common/Stories'; // uncomment if exists

// export default function HomeScreen() {
//   const posts = useSelector((state) => state.posts?.posts || []); // <-- safe fallback
//   const navigation = useNavigation();

//   const renderItem = ({ item }) => <PostCard post={item} />;

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Header navigation={navigation} />

//       {/* FlatList with Stories + Posts */}
//       {posts.length > 0 ? (
//         <FlatList
//           data={posts}
//           keyExtractor={(item) => item.id}
//           showsVerticalScrollIndicator={false}
//           ListHeaderComponent={<Stories />}
//           renderItem={renderItem}
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text>No posts yet. Start posting!</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });





import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import PostCard from "../../components/PostCard";
import profilePic from "../../assets/profile.jpg";

// Dummy posts
const posts = [
  {
    id: "1",
    user: { username: "john_doe", avatar: "https://i.pravatar.cc/150?img=1" },
    image: "https://picsum.photos/800/400?random=1",
    likes: 120,
    liked: false,
    caption: "Nature at its best!",
    followingOnly: false,
  },
  {
    id: "2",
    user: { username: "jane_smith", avatar: "https://i.pravatar.cc/150?img=2" },
    image: "https://picsum.photos/800/400?random=2",
    likes: 300,
    liked: true,
    caption: "Amazing sunset!",
    followingOnly: true,
  },
  {
    id: "3",
    user: { username: "alex_90", avatar: "https://i.pravatar.cc/150?img=3" },
    image: "https://picsum.photos/800/400?random=3",
    likes: 75,
    liked: false,
    caption: "Adventure time!",
    followingOnly: false,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("For You");

  // Filter posts based on active tab
  const filteredPosts =
    activeTab === "For You"
      ? posts.filter((p) => !p.followingOnly)
      : posts.filter((p) => p.followingOnly);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Profile icon */}
        <TouchableOpacity onPress={() => navigation.navigate("ProfileStack")}>
          <Image source={profilePic} style={styles.profilePic} />
        </TouchableOpacity>

        {/* App name */}
        <Text style={styles.logo}>GTalk</Text>

        {/* Chat icon */}
        <TouchableOpacity onPress={() => navigation.navigate("ChatListScreen")}>
          <Ionicons name="chatbubble-outline" size={28} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["For You", "Following"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabBtn}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Posts feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
  },
  profilePic: { width: 36, height: 36, borderRadius: 18 },
  logo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
  },
  tabBtn: { alignItems: "center", paddingVertical: 10 },
  tabText: { color: "gray", fontSize: 15, fontWeight: "600" },
  tabTextActive: { color: "#1DA1F2" },
  tabUnderline: {
    marginTop: 5,
    height: 3,
    width: 40,
    backgroundColor: "#1DA1F2",
    borderRadius: 2,
  },
});
