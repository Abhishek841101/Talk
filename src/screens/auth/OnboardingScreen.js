// // src/screens/OnboardingScreen.js
// import React, { useRef, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
//   StyleSheet,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { useSelector } from "react-redux";

// // ✅ Import local placeholder image
// import profilePlaceholder from "../../assets/profile.jpg";

// const { width } = Dimensions.get("window");

// export default function OnboardingScreen() {
//   const navigation = useNavigation();
//   const flatListRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // ✅ Get current logged-in user
//   const user = useSelector((state) => state.auth.user);

//   // Auto-slide every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % 3;
//       setCurrentIndex(nextIndex);
//       flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   // ✅ Slides array
//   const slides = [
//     {
//       id: "1",
//       src: user?.profileImage ? { uri: user.profileImage } : profilePlaceholder,
//       title: "Stay connected with your close friends",
//       subtitle: "Share your special moments and find new inspiration",
//     },
//     {
//       id: "2",
//       src: profilePlaceholder,
//       title: "Discover amazing stories",
//       subtitle: "Find daily inspiration from people around the world",
//     },
//     {
//       id: "3",
//       src: profilePlaceholder,
//       title: "Create unforgettable memories",
//       subtitle: "Capture and share every special moment instantly",
//     },
//   ];

//   // ✅ Navigate after onboarding
//   const handleGetStarted = async () => {
//     await AsyncStorage.setItem("hasSeenOnboarding", "true");
//     navigation.replace("AppTabs"); // Navigate to main app tabs
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcomeText}>
//         Welcome, {user?.username || user?.name || "User"} 👋
//       </Text>

//       <FlatList
//         ref={flatListRef}
//         data={slides}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={{ width, alignItems: "center", padding: 20 }}>
//             <Image source={item.src} style={styles.image} />
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.subtitle}>{item.subtitle}</Text>
//           </View>
//         )}
//       />

//       <View style={styles.dotsContainer}>
//         {slides.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               currentIndex === index ? styles.activeDot : styles.inactiveDot,
//             ]}
//           />
//         ))}
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
//         <Text style={styles.buttonText}>Get Started</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#1E1E1E",
//     justifyContent: "center",
//   },
//   welcomeText: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FACC15",
//     textAlign: "center",
//     marginTop: 60,
//     marginBottom: -80,
//   },
//   image: {
//     width: 340,
//     height: 480,
//     borderRadius: 20,
//     marginTop: 160,
//     resizeMode: "cover",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 12,
//     backgroundColor: "#000",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 20,
//     color: "#FACC15",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#E0F2FE",
//     textAlign: "center",
//     marginTop: 10,
//     paddingHorizontal: 20,
//   },
//   dotsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 20,
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 5,
//   },
//   activeDot: {
//     width: 20,
//     backgroundColor: "#FACC15",
//   },
//   inactiveDot: {
//     width: 8,
//     backgroundColor: "#93C5FD",
//   },
//   button: {
//     backgroundColor: "#FACC15",
//     padding: 15,
//     borderRadius: 30,
//     alignSelf: "center",
//     width: "80%",
//     marginBottom: 30,
//   },
//   buttonText: {
//     color: "#1E3A8A",
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });









import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import profilePlaceholder from "../../assets/first.jpg";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useSelector((state) => state.auth.user);

  // Animated values
  const imageScale = useRef(new Animated.Value(1.02)).current;
  const buttonScale = useRef(new Animated.Value(1.02)).current;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % 3;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const slides = [
    {
      id: "1",
      src: user?.profileImage ? { uri: user.profileImage } : profilePlaceholder,
      title: "Stay connected with your close friends",
      subtitle: "Share your special moments and find new inspiration",
    },
    {
      id: "2",
      src: profilePlaceholder,
      title: "Discover amazing stories",
      subtitle: "Find daily inspiration from people around the world",
    },
    {
      id: "3",
      src: profilePlaceholder,
      title: "Create unforgettable memories",
      subtitle: "Capture and share every special moment instantly",
    },
  ];

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("AppTabs");
  };

  // Animation helpers
  const animatePressIn = (animatedValue) => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const animatePressOut = (animatedValue, defaultValue = 1.02) => {
    Animated.spring(animatedValue, {
      toValue: defaultValue,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Glow Effects */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      {/* Avatar with Glowing Ring */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarRing}>
          <TouchableWithoutFeedback
            onPressIn={() => animatePressIn(imageScale)}
            onPressOut={() => animatePressOut(imageScale)}
          >
            <Animated.Image
              source={slides[currentIndex].src}
              style={[
                styles.avatar,
                { transform: [{ scale: imageScale }] },
              ]}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>
          Welcome, {user?.username || user?.name || "User"} 👋
        </Text>
        <Text style={styles.subtitle}>Let's get started</Text>
      </View>

      {/* Content Slider */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardContent}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Get Started Button */}
      <TouchableWithoutFeedback
        onPressIn={() => animatePressIn(buttonScale)}
        onPressOut={() => animatePressOut(buttonScale)}
        onPress={handleGetStarted}
      >
        <Animated.View
          style={[
            styles.button,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: StatusBar.currentHeight + 20,
  },
  // Glow Effects
  glow1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(74, 123, 255, 0.2)",
    opacity: 0.6,
  },
  glow2: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(200, 92, 255, 0.2)",
    opacity: 0.6,
  },
  // Avatar
  avatarContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 25,
  },
  avatarRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "linear-gradient(135deg, #4A7BFF, #C85CFF)",
    padding: 5,
    shadowColor: "#4A7BFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2A2F4F",
    resizeMode: "cover",
  },
  // User Info
  userInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  name: {
    color: "#E4E4E4",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#A8A8C9",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  // Slides
  slide: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  cardTitle: {
    color: "#E4E4E4",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  cardContent: {
    color: "#A8A8C9",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  // Dots
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#4A7BFF",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#2A2F4F",
  },
  // Button
  button: {
    backgroundColor: "linear-gradient(to right, #4A7BFF, #C85CFF)",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#4A7BFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});