
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
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleRegister = async () => {


    
    if (!username || !email || !password) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }

    try {
      const resultAction = await dispatch(registerUser({ username, email, password }));

      if (registerUser.fulfilled.match(resultAction)) {
        Alert.alert("Registration Successful");
        navigation.reset({
          index: 0,
          routes: [{ name: "Onboarding" }], 
        });
      } else {
        Alert.alert("Registration Failed", resultAction.payload || "Try again");
      }
    } catch (err) {
      console.log("Register error:", err);
      Alert.alert("Registration Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "600", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: "#3897f0", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  link: { marginTop: 20, color: "#3897f0", textAlign: "center" },
});
