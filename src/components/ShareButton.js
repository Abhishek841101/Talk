// // import React from "react";
// // import { TouchableOpacity, Alert, Platform } from "react-native";
// // import * as Sharing from "expo-sharing";
// // import { Ionicons } from "@expo/vector-icons";

// // // Clipboard import only if not web
// // let Clipboard;
// // if (Platform.OS === "web") {
// //   Clipboard = require('expo-clipboard');
// // }

// // const ShareButton = ({ item, type }) => {
// //   const handleShare = async () => {
// //     const url = `http://localhost:8000/api/${type}/${item.id}`;
// //     const message = item.caption || item.title || "Check this out!";

// //     try {
// //       if (Platform.OS === "web" && Clipboard) {
// //         await Clipboard.setString(url);
// //         Alert.alert("Link copied to clipboard!");
// //         console.log("Copied URL:", url);
// //         return;
// //       }

// //       const isAvailable = await Sharing.isAvailableAsync();
// //       if (isAvailable) {
// //         await Sharing.shareAsync(url, { dialogTitle: message });
// //         console.log("Sharing success:", url);
// //       } else {
// //         Alert.alert("Sharing is not available on this device.");
// //         console.log("Sharing not available");
// //       }
// //     } catch (err) {
// //       console.log("Share error:", err);
// //       Alert.alert("Error sharing content");
// //     }
// //   };

// //   return (
// //     <TouchableOpacity
// //       style={{ padding: 8, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
// //       onPress={handleShare}
// //     >
// //       <Ionicons name="paper-plane-outline" size={20} color="#8b98a5" />
// //     </TouchableOpacity>
// //   );
// // };

// // export default ShareButton;



// import React from "react";
// import { TouchableOpacity, Alert, Platform } from "react-native";
// import * as Sharing from "expo-sharing";
// import { Ionicons } from "@expo/vector-icons";

// // Clipboard import only on web
// let Clipboard;
// if (Platform.OS === "web") {
//   Clipboard = require("expo-clipboard");
// }

// const ShareButton = ({ item, type }) => {
//   // ✅ Use public URL or ngrok URL, localhost won't work on mobile
//   const PUBLIC_BASE_URL = "https://your-public-url.com"; // replace with your public URL
//   const url = `${PUBLIC_BASE_URL}/api/${type}/${item.id}`;
//   const message = item.caption || item.title || "Check this out!";

//   const handleShare = async () => {
//     try {
//       if (Platform.OS === "web" && Clipboard) {
//         await Clipboard.setString(url);
//         Alert.alert("Link copied to clipboard!", url);
//         console.log("Copied URL:", url);
//         return;
//       }

//       const isAvailable = await Sharing.isAvailableAsync();
//       if (isAvailable) {
//         await Sharing.shareAsync(url, {
//           dialogTitle: message,
//           mimeType: "text/plain",
//         });
//         console.log("Sharing success:", url);
//       } else {
//         // Fallback for devices where Sharing API is unavailable
//         Alert.alert("Sharing not available on this device", url);
//         console.log("Sharing not available, fallback URL:", url);
//       }
//     } catch (err) {
//       console.log("Share error:", err);
//       Alert.alert("Error sharing content", err?.message || "");
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={{
//         padding: 8,
//         borderRadius: 20,
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//       onPress={handleShare}
//     >
//       <Ionicons name="paper-plane-outline" size={20} color="#8b98a5" />
//     </TouchableOpacity>
//   );
// };

// export default ShareButton;




// src/components/ShareButton.js
import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Share,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { sendShare, addReceivedShare } from "../features/share/shareSlice";
import { getSocket } from "../lib/socket";

const ShareButton = ({ item, type, receiverId }) => {
  const dispatch = useDispatch();

  // ✅ Select primitive value directly to avoid rerender warning
  const loading = useSelector(state => state.share?.loading || false);
  const senderId = useSelector(state => state.auth?.user?._id);

  const handleShare = async () => {
    if (!receiverId) return Alert.alert("Error", "Receiver ID is required");
    if (!senderId) return Alert.alert("Error", "User not logged in");

    const url = `https://10.99.136.9:8000/api/${type}/${item._id || item.id}`;

    try {
      console.log("[ShareButton] Sharing:", {
        senderId,
        receiverId,
        postId: item._id || item.id,
        url,
      });

      // Native share dialog
      await Share.share({
        title: item.title || "Check this out!",
        message: `${item.caption || ""}\n\n${url}`,
      });

      // Send share info to backend
      const shareResult = await dispatch(
        sendShare({
          senderId,
          receiverId,
          postId: item._id || item.id,
          message: item.caption || "",
        })
      ).unwrap();

      // Update Redux state optimistically
      dispatch(addReceivedShare(shareResult));

      // Emit socket event
      const socket = getSocket();
      if (socket) {
        socket.emit("newShare", { ...shareResult, to: receiverId });
      }

      Alert.alert("✅ Shared successfully!", "Post shared with your friend.");
    } catch (err) {
      console.error("[ShareButton] Error sharing post:", err);
      Alert.alert("Error", err?.message || "Something went wrong while sharing");
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleShare}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#8b98a5" />
      ) : (
        <Ionicons name="paper-plane-outline" size={22} color="#8b98a5" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ShareButton;
