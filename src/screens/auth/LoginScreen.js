
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





// src/screens/LoginScreen.js
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigation.replace("Onboarding"); // Navigate to onboarding after login
    } catch (err) {
      console.log("❌ Login failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Welcome App Name */}
      <Text style={styles.welcome}>Welcome to</Text>
      <Text style={styles.appName}>ChatN</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {/* ✅ Input Card */}
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* ✅ Login Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin} 
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* ✅ Register Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          Don’t have an account? <Text style={styles.highlight}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 24,
    color: "#FFB800",
    fontWeight: "600",
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 30,
  },
  inputCard: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#111",
    color: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF6B00",
    width: width * 0.8,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
  highlight: {
    color: "#FF6B00",
    fontWeight: "bold",
  },
  error: {
    color: "#FF4D4F",
    marginBottom: 10,
    fontSize: 14,
  },
});
