
// // // src/screens/RegisterScreen.js
// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Alert,
// // } from "react-native";
// // import { useDispatch, useSelector } from "react-redux";
// // import { registerUser } from "../../features/auth/authSlice";

// // const RegisterScreen = ({ navigation }) => {
// //   const [username, setUsername] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const dispatch = useDispatch();
// //   const { loading } = useSelector((state) => state.auth);

// //   const handleRegister = async () => {

// // // dispatch(registerUser({username,email, password }

// // //       )).then(( res ) => console.log("register response:", res))
        


    
// //     if (!username || !email || !password) {
// //       Alert.alert("Validation Error", "Please fill all fields.");
// //       return;
// //     }

// //     try {
// //       const resultAction = await dispatch(registerUser({ username, email, password }));

// //       if (registerUser.fulfilled.match(resultAction)) {
// //         Alert.alert("Registration Successful");
// //         navigation.reset({
// //           index: 0,
// //           routes: [{ name: "AppTabs" }], // or HomeTab
// //         });
// //       } else {
// //         Alert.alert("Registration Failed", resultAction.payload || "Try again");
// //       }
// //     } catch (err) {
// //       console.log("Register error:", err);
// //       Alert.alert("Registration Error", "Something went wrong");
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Create Account</Text>

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Username"
// //         autoCapitalize="none"
// //         onChangeText={setUsername}
// //         value={username}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Email"
// //         autoCapitalize="none"
// //         keyboardType="email-address"
// //         onChangeText={setEmail}
// //         value={email}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Password"
// //         secureTextEntry
// //         onChangeText={setPassword}
// //         value={password}
// //       />

// //       <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
// //         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
// //       </TouchableOpacity>

// //       <TouchableOpacity onPress={() => navigation.navigate("Login")}>
// //         <Text style={styles.link}>Already have an account? Login</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default RegisterScreen;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, justifyContent: "center", padding: 20 },
// //   title: { fontSize: 26, fontWeight: "600", textAlign: "center", marginBottom: 30 },
// //   input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 16 },
// //   button: { backgroundColor: "#3897f0", padding: 14, borderRadius: 8, alignItems: "center" },
// //   buttonText: { color: "#fff", fontSize: 16 },
// //   link: { marginTop: 20, color: "#3897f0", textAlign: "center" },
// // });



// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../../features/auth/authSlice";

// const RegisterScreen = ({ navigation }) => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.auth);

//   const handleRegister = async () => {
//     if (!username || !email || !password) {
//       Alert.alert("Validation Error", "Please fill all fields.");
//       return;
//     }
//     try {
//       const resultAction = await dispatch(registerUser({ username, email, password }));
//       if (registerUser.fulfilled.match(resultAction)) {
//         navigation.reset({ index: 0, routes: [{ name: "HomeTab" }] });
//       } else {
//         Alert.alert("Registration Failed", resultAction.payload || "Try again");
//       }
//     } catch (err) {
//       Alert.alert("Registration Error", "Something went wrong");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>
//       <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
//       <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

//       <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//         <Text style={styles.link}>Already have an account? Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 26, fontWeight: "600", textAlign: "center", marginBottom: 30 },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 16 },
//   button: { backgroundColor: "#3897f0", padding: 14, borderRadius: 8, alignItems: "center" },
//   buttonText: { color: "#fff", fontSize: 16 },
//   link: { marginTop: 20, color: "#3897f0", textAlign: "center" },
// });








// src/screens/RegisterScreen.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

// 👉 Replace Expo icons with React Native Vector Icons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60";

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // animations
  const usernameFocus = useRef(new Animated.Value(0)).current;
  const emailFocus = useRef(new Animated.Value(0)).current;
  const passwordFocus = useRef(new Animated.Value(0)).current;
  const cardPop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(cardPop, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const onFocusAnim = (animRef) => {
    Animated.timing(animRef, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const onBlurAnim = (animRef) => {
    Animated.timing(animRef, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const usernameBorder = usernameFocus.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.15)", "rgba(255,180,0,1)"],
  });
  const emailBorder = emailFocus.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.15)", "rgba(64,224,208,1)"],
  });
  const passwordBorder = passwordFocus.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.15)", "rgba(100,149,237,1)"],
  });

  const cardScale = cardPop.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const handleRegister = async () => {
    if (!username || !email || !password) return;

    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      navigation.replace("Onboarding");
    } catch (err) {
      console.log("❌ Register failed:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: BACKGROUND_IMAGE }}
        style={styles.background}
        blurRadius={6}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <Animated.View
              style={[styles.card, { transform: [{ scale: cardScale }] }]}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.lockCircle}>
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={28}
                    color="#FFB800"
                  />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>Join ChatN now</Text>
                </View>
              </View>

              {/* Username */}
              <Animated.View
                style={[styles.inputWrap, { borderColor: usernameBorder }]}
              >
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  onFocus={() => onFocusAnim(usernameFocus)}
                  onBlur={() => onBlurAnim(usernameFocus)}
                />
              </Animated.View>

              {/* Email */}
              <Animated.View
                style={[styles.inputWrap, { borderColor: emailBorder }]}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => onFocusAnim(emailFocus)}
                  onBlur={() => onBlurAnim(emailFocus)}
                />
              </Animated.View>

              {/* Password */}
              <Animated.View
                style={[styles.inputWrap, { borderColor: passwordBorder }]}
              >
                <MaterialCommunityIcons
                  name="key-variant"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => onFocusAnim(passwordFocus)}
                  onBlur={() => onBlurAnim(passwordFocus)}
                />
              </Animated.View>

              {error && <Text style={styles.error}>{error}</Text>}

              {/* Register Button */}
              <TouchableOpacity
                style={styles.loginBtn}
                activeOpacity={0.85}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>Register</Text>
                )}
              </TouchableOpacity>

              {/* Social Row */}
              <View style={styles.orRow}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <FontAwesome name="google" size={22} color="#DB4437" />
                  <Text style={styles.socialText}> Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialBtn}>
                  <FontAwesome name="facebook" size={22} color="#4267B2" />
                  <Text style={styles.socialText}> Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialBtn}>
                  <FontAwesome name="twitter" size={22} color="#1DA1F2" />
                  <Text style={styles.socialText}> Twitter</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={{ color: "#FFB800", fontWeight: "700" }}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  container: { flex: 1, paddingHorizontal: 18, justifyContent: "center" },
  card: {
    backgroundColor: "rgba(8,10,15,0.6)",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: "#FFB800",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  lockCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,180,0,0.18)",
  },
  title: { color: "white", fontSize: 18, fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  inputWrap: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 10,
    borderWidth: 1.4,
  },
  input: { flex: 1, color: "white", fontSize: 15 },
  error: { color: "#FF4D4F", textAlign: "center", marginTop: 4, fontSize: 14 },
  loginBtn: {
    marginTop: 14,
    backgroundColor: "rgba(255,180,0,0.08)",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,180,0,0.18)",
  },
  loginBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
  orRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.06)" },
  orText: { color: "rgba(255,255,255,0.5)", paddingHorizontal: 10 },
  socialRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
  },
  socialText: { color: "white", fontWeight: "700", marginLeft: 6 },
  footer: { marginTop: 18, alignItems: "center" },
  footerText: { color: "rgba(255,255,255,0.6)" },
});
