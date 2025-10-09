// // src/App.tsx
// import React, { useEffect } from "react";
// import { StatusBar } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import AppNavigator from "./navigation/AppNavigator";
// import io from "socket.io-client";

// export default function App() {
//   useEffect(() => {
//     const socket = io("http://10.178.8.114:8000"); // your backend IP

//     socket.on("connect", () => {
//       console.log("✅ Connected to Socket.io server:", socket.id);
//     });

//     socket.on("message", (msg) => {
//       console.log("📩 Message from server:", msg);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <NavigationContainer>
//       <StatusBar barStyle="dark-content" />
//       <AppNavigator />
//     </NavigationContainer>
//   );
// }
