// src/screens/OnboardingScreen.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

// ✅ Import local placeholder image
import profilePlaceholder from "../../assets/profile.jpg";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Get current logged-in user
  const user = useSelector((state) => state.auth.user);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % 3;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // ✅ Slides array
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

  // ✅ Navigate after onboarding
  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("AppTabs"); // Navigate to main app tabs
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome, {user?.username || user?.name || "User"} 👋
      </Text>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: "center", padding: 20 }}>
            <Image source={item.src} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

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

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FACC15",
    textAlign: "center",
    marginTop: 60,
    marginBottom: -80,
  },
  image: {
    width: 340,
    height: 480,
    borderRadius: 20,
    marginTop: 160,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#FACC15",
  },
  subtitle: {
    fontSize: 14,
    color: "#E0F2FE",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#FACC15",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#93C5FD",
  },
  button: {
    backgroundColor: "#FACC15",
    padding: 15,
    borderRadius: 30,
    alignSelf: "center",
    width: "80%",
    marginBottom: 30,
  },
  buttonText: {
    color: "#1E3A8A",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
