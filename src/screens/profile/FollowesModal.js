// import { useMemo } from 'react';
// import { FlatList, Modal, Pressable, SafeAreaView, Text, View, useColorScheme } from 'react-native';
// // import Avatar from './Avatar';
// import { OutlineButton } from './Buttons';


// const useTheme = () => {
// const scheme = useColorScheme?.() || 'light';
// const isDark = scheme === 'dark';
// return useMemo(() => ({
// bg: isDark ? '#000' : '#fff',
// text: { primary: isDark ? '#fff' : '#111', secondary: isDark ? '#c7c7c7' : '#666' },
// border: isDark ? '#222' : '#e5e5e5',
// tint: isDark ? '#0a84ff' : '#007aff',
// }), [scheme]);
// };


// export default function FollowersModal({ visible, onClose, title }) {
// const C = useTheme();
// return (
// <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
// <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
// <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
// <Text style={{ color: C.text.primary, fontWeight: '700', fontSize: 16 }}>{title}</Text>
// <Pressable onPress={onClose}><Text style={{ color: C.tint, fontWeight: '600' }}>Close</Text></Pressable>
// </View>
// <FlatList
// data={Array.from({ length: 40 }).map((_, i) => ({ id: `f-${i}`, name: `User ${i + 1}`, username: `user${i + 1}` }))}
// keyExtractor={(x) => x.id}
// renderItem={({ item }) => (
// <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
// <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// <Avatar size={40} uri={`https://picsum.photos/seed/f-${item.id}/200/200`} />
// <View style={{ marginLeft: 10 }}>
// <Text style={{ color: C.text.primary, fontWeight: '600' }}>{item.name}</Text>
// <Text style={{ color: C.text.secondary, fontSize: 12 }}>@{item.username}</Text>
// </View>
// </View>
// <OutlineButton title="Follow" onPress={() => {}} />
// </View>
// )}
// ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: C.border }} />}
// />
// </SafeAreaView>
// </Modal>
// );
// }




// import React, { useEffect } from "react";
// import {
//   FlatList,
//   Modal,
//   Pressable,
//   SafeAreaView,
//   Text,
//   View,
//   Image,
//   useColorScheme,
//   TouchableOpacity,
// } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchAllUsers, followOrUnfollow } from "../features/profile/profileSlice";
// import { OutlineButton } from "./Buttons";

// // ================= Theme Hook =================
// const useTheme = () => {
//   const scheme = useColorScheme?.() || "light";
//   const isDark = scheme === "dark";
//   return {
//     bg: isDark ? "#000" : "#fff",
//     text: { primary: isDark ? "#fff" : "#111", secondary: isDark ? "#c7c7c7" : "#666" },
//     border: isDark ? "#222" : "#e5e5e5",
//     tint: isDark ? "#0a84ff" : "#007aff",
//   };
// };

// // ================= Avatar =================
// const Avatar = ({ uri, size = 40 }) => (
//   <View style={{ width: size, height: size, borderRadius: size/2, overflow: "hidden", backgroundColor: "#ccc" }}>
//     <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />
//   </View>
// );

// // ================= FollowersModal =================
// export default function FollowersModal({ visible, onClose }) {
//   const C = useTheme();
//   const dispatch = useDispatch();

//   const allUsers = useSelector(state => state.profile.allUsers);
//   const allUsersLoading = useSelector(state => state.profile.allUsersLoading);
//   const currentUsername = useSelector(state => state.profile.username);

//   const [activeTab, setActiveTab] = React.useState("Followers"); // Followers / Following / Suggested

//   // Fetch all users when modal opens
//   useEffect(() => {
//     if (visible) dispatch(fetchAllUsers());
//   }, [visible]);

//   useEffect(() => {
//     console.log("All users updated:", allUsers);
//   }, [allUsers]);

//   const handleFollowToggle = (username) => {
//     dispatch(followOrUnfollow(username));
//   };

//   // Filter users based on tab
//   const filteredUsers = allUsers.filter(u => {
//     if (activeTab === "Followers") return !u.isFollowing;         // Users not followed
//     if (activeTab === "Following") return u.isFollowing;         // Users already followed
//     if (activeTab === "Suggested") return u.username !== currentUsername && !u.isFollowing; // Suggested = everyone except self & already followed
//     return true;
//   });

//   useEffect(() => {
//     console.log(`Filtered users for ${activeTab}:`, filteredUsers.map(u => u.username));
//   }, [filteredUsers, activeTab]);

//   return (
//     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//       <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
//         {/* Header: Back + Tabs */}
//         <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1, borderColor:C.border }}>
//           <Pressable onPress={onClose} style={{ paddingRight:20 }}>
//             <Text style={{ color:C.tint, fontWeight:"600" }}>Back</Text>
//           </Pressable>

//           <View style={{ flexDirection:"row", flex:1, justifyContent:"space-around" }}>
//             {["Followers","Following","Suggested"].map(tab => (
//               <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
//                 <Text style={{ color: activeTab===tab ? C.tint : C.text.secondary, fontWeight: activeTab===tab?"700":"500" }}>{tab}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Users List */}
//         {allUsersLoading ? (
//           <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
//             <Text style={{ color:C.text.secondary }}>Loading users...</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredUsers}
//             keyExtractor={x => x.username}
//             renderItem={({ item }) => (
//               <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:16, paddingVertical:12 }}>
//                 {/* Left */}
//                 <View style={{ flexDirection:"row", alignItems:"center" }}>
//                   <Avatar size={40} uri={item.avatar || `https://picsum.photos/seed/${item.username}/200/200`} />
//                   <View style={{ marginLeft:10 }}>
//                     <Text style={{ color:C.text.primary, fontWeight:"600" }}>{item.fullName || item.username}</Text>
//                     <Text style={{ color:C.text.secondary, fontSize:12 }}>@{item.username}</Text>
//                   </View>
//                 </View>

//                 {/* Right */}
//                 <OutlineButton title={item.isFollowing ? "Following" : "Follow"} onPress={() => handleFollowToggle(item.username)} />
//               </View>
//             )}
//             ItemSeparatorComponent={() => <View style={{ height:1, backgroundColor:C.border }} />}
//           />
//         )}
//       </SafeAreaView>
//     </Modal>
//   );
// }







// src/screens/FollowersModal.js
import React, { useEffect } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers, followOrUnfollow } from "../../features/profile/profileSlice";
import { OutlineButton } from "./Buttons";

// ================= Theme Hook =================
const useTheme = () => {
  const scheme = useColorScheme?.() || "light";
  const isDark = scheme === "dark";
  return {
    bg: isDark ? "#000" : "#fff",
    text: { primary: isDark ? "#fff" : "#111", secondary: isDark ? "#c7c7c7" : "#666" },
    border: isDark ? "#222" : "#e5e5e5",
    tint: isDark ? "#0a84ff" : "#007aff",
  };
};

// ================= Avatar =================
const Avatar = ({ uri, size = 40 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: "hidden",
      backgroundColor: "#ccc",
    }}
  >
    <Image
      source={{ uri }}
      style={{ width: size, height: size }}
      resizeMode="cover"
    />
  </View>
);

// ================= FollowersModal =================
export default function FollowersModal({ visible, onClose }) {
  const C = useTheme();
  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.profile.allUsers);
  const allUsersLoading = useSelector((state) => state.profile.allUsersLoading);
  const currentUsername = useSelector((state) => state.profile.username);

  const [activeTab, setActiveTab] = React.useState("Followers"); // Followers / Following / Suggested

  // 🔹 Fetch all users when modal opens
  useEffect(() => {
    if (visible) {
      console.log("🔄 Modal opened → fetching all users...");
      dispatch(fetchAllUsers());
    }
  }, [visible]);

  useEffect(() => {
    console.log("📦 Redux allUsers updated:", allUsers);
  }, [allUsers]);

  const handleFollowToggle = (username) => {
    console.log("👉 Follow toggle for:", username);
    dispatch(followOrUnfollow(username));
  };

  // 🔹 Filter users based on tab
  const filteredUsers = allUsers.filter((u) => {
    if (activeTab === "Followers") return !u.isFollowing; // not following
    if (activeTab === "Following") return u.isFollowing; // already following
    if (activeTab === "Suggested")
      return u.username !== currentUsername && !u.isFollowing; // suggested

    return true;
    
  });

  useEffect(() => {
    console.log(`📊 Filtered users for ${activeTab}:`, filteredUsers.map((u) => u.username));
  }, [filteredUsers, activeTab]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header: Back + Tabs */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderColor: C.border,
          }}
        >
          <Pressable onPress={onClose} style={{ paddingRight: 20 }}>
            <Text style={{ color: C.tint, fontWeight: "600" }}>Back</Text>
          </Pressable>

          <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-around" }}>
            {["Followers", "Following", "Suggested"].map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text
                  style={{
                    color: activeTab === tab ? C.tint : C.text.secondary,
                    fontWeight: activeTab === tab ? "700" : "500",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Users List */}
        {allUsersLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: C.text.secondary }}>Loading users...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(x) => x.username}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                {/* Left */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Avatar
                    size={40}
                    uri={
                      item.avatar ||
                      `https://picsum.photos/seed/${item.username}/200/200`
                    }
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: C.text.primary, fontWeight: "600" }}>
                      {item.fullName || item.username}
                    </Text>
                    <Text style={{ color: C.text.secondary, fontSize: 12 }}>
                      @{item.username}
                    </Text>
                  </View>
                </View>

                {/* Right */}
                <OutlineButton
                  title={item.isFollowing ? "Following" : "Follow"}
                  onPress={() => handleFollowToggle(item.username)}
                />
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: C.border }} />
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
