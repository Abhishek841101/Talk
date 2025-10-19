
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../features/auth/authSlice";

// export default function LoginScreen({ navigation }) {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       await dispatch(loginUser({ email, password })).unwrap();
//       // ✅ If login successful
//       // navigation.navigate("Home");
//     } catch (err) {
//       console.log("❌ Login failed:", err);
//       // Error state Redux me already save ho raha hai
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       {error && <Text style={styles.error}>{error}</Text>}

//       <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//         <Text style={styles.link}>Don’t have an account? Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   error: {
//     color: "red",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   link: {
//     marginTop: 15,
//     textAlign: "center",
//     color: "#007AFF",
//   },
// });





// // src/screens/LoginScreen.js
// import React, { useState } from "react";
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator,
//   Dimensions
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../features/auth/authSlice";

// const { width } = Dimensions.get("window");

// export default function LoginScreen({ navigation }) {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       await dispatch(loginUser({ email, password })).unwrap();
//       navigation.replace("Onboarding"); // Navigate to onboarding after login
//     } catch (err) {
//       console.log("❌ Login failed:", err);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* ✅ Welcome App Name */}
//       <Text style={styles.welcome}>Welcome to</Text>
//       <Text style={styles.appName}>ChatN</Text>
//       <Text style={styles.subtitle}>Login to continue</Text>

//       {/* ✅ Input Card */}
//       <View style={styles.inputCard}>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#999"
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#999"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>

//       {error && <Text style={styles.error}>{error}</Text>}

//       {/* ✅ Login Button */}
//       <TouchableOpacity 
//         style={styles.button} 
//         onPress={handleLogin} 
//         disabled={loading}
//         activeOpacity={0.8}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Login</Text>
//         )}
//       </TouchableOpacity>

//       {/* ✅ Register Link */}
//       <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//         <Text style={styles.link}>
//           Don’t have an account? <Text style={styles.highlight}>Register</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0D0D0D",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   welcome: {
//     fontSize: 24,
//     color: "#FFB800",
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   appName: {
//     fontSize: 36,
//     color: "#fff",
//     fontWeight: "bold",
//     marginBottom: 6,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#aaa",
//     marginBottom: 30,
//   },
//   inputCard: {
//     width: "100%",
//     backgroundColor: "#1A1A1A",
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 12,
//   },
//   input: {
//     width: "100%",
//     padding: 15,
//     borderRadius: 12,
//     backgroundColor: "#111",
//     color: "#fff",
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: "#FF6B00",
//     width: width * 0.8,
//     padding: 18,
//     borderRadius: 30,
//     alignItems: "center",
//     marginBottom: 20,
//     shadowColor: "#FF6B00",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   link: {
//     color: "#aaa",
//     fontSize: 14,
//     textAlign: "center",
//   },
//   highlight: {
//     color: "#FF6B00",
//     fontWeight: "bold",
//   },
//   error: {
//     color: "#FF4D4F",
//     marginBottom: 10,
//     fontSize: 14,
//   },
// });




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
  Easing,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60";
const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailFocus = useRef(new Animated.Value(0)).current;
  const passwordFocus = useRef(new Animated.Value(0)).current;
  const lockPulse = useRef(new Animated.Value(1)).current;
  const cardPop = useRef(new Animated.Value(0)).current;

  const [responseVisible, setResponseVisible] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [responseType, setResponseType] = useState("success");
  const responseScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(cardPop, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(lockPulse, {
          toValue: 1.12,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(lockPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
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

  const emailBorderColor = emailFocus.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.15)", "rgba(64, 224, 208, 1)"],
  });
  const passwordBorderColor = passwordFocus.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.15)", "rgba(100,149,237,1)"],
  });
  const cardScale = cardPop.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();

      setResponseText("✅ Login Successful! Redirecting...");
      setResponseType("success");
      setResponseVisible(true);

      Animated.spring(responseScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(responseScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setResponseVisible(false));
        navigation.replace("Onboarding");
      }, 2000);
    } catch (err) {
      console.log("❌ Login failed:", err);
      setResponseText("❌ Invalid credentials. Please try again!");
      setResponseType("error");
      setResponseVisible(true);

      Animated.spring(responseScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(responseScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setResponseVisible(false));
      }, 2000);
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
                <Animated.View style={{ transform: [{ scale: lockPulse }] }}>
                  <View style={styles.lockCircle}>
                    <Icon name="lock" size={28} color="#0ff" />
                  </View>
                </Animated.View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>Secure login to ChatN</Text>
                </View>
              </View>

              {/* Email */}
              <Animated.View
                style={[styles.inputWrap, { borderColor: emailBorderColor }]}
              >
                <Icon
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
                  onFocus={() => onFocusAnim(emailFocus)}
                  onBlur={() => onBlurAnim(emailFocus)}
                />
              </Animated.View>

              {/* Password */}
              <Animated.View
                style={[styles.inputWrap, { borderColor: passwordBorderColor }]}
              >
                <Icon
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

              <TouchableOpacity
                style={styles.loginBtn}
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>Log In</Text>
                )}
              </TouchableOpacity>

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
                Don’t have an account?{" "}
                <Text
                  style={{ color: "#00ffff", fontWeight: "700" }}
                  onPress={() => navigation.navigate("Register")}
                >
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>

      {/* ✅ Animated Response Popup */}
      {responseVisible && (
        <Modal transparent animationType="none" visible={responseVisible}>
          <View style={styles.responseOverlay}>
            <Animated.View
              style={[
                styles.responseBox,
                {
                  backgroundColor:
                    responseType === "success"
                      ? "rgba(0,255,200,0.15)"
                      : "rgba(255,0,0,0.15)",
                  borderColor:
                    responseType === "success" ? "#00ffff" : "#ff4d4f",
                  transform: [{ scale: responseScale }],
                  width:
                    Platform.OS === "web"
                      ? width * 0.4
                      : width * 0.8,
                },
              ]}
            >
              <Text
                style={[
                  styles.responseText,
                  {
                    color: responseType === "success" ? "#00ffff" : "#ff4d4f",
                    fontSize: Platform.OS === "web" ? 14 : 18,
                  },
                ]}
              >
                {responseText}
              </Text>
            </Animated.View>
          </View>
        </Modal>
      )}
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
    shadowColor: "#00ffff",
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
    borderColor: "rgba(0,255,255,0.18)",
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
    backgroundColor: "rgba(0,255,255,0.08)",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.18)",
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
  responseOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  responseBox: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.4,
    shadowColor: "#00ffff",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 8,
  },
  responseText: { fontWeight: "700", textAlign: "center" },
});
