import React from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const accountSections = [
  {
    title: "Your Account",
    data: [
      { icon: "key-outline", text: "Password & Security", navigate: "PasswordSecurity" },
      { icon: "person-outline", text: "Personal Details", navigate: "PersonalDetails" },
      { icon: "card-outline", text: "Subscriptions", navigate: "Subscriptions" },
    ],
  },
];

export default function AccountsCenterScreen() {
  const navigation = useNavigation();

  const handlePress = (item) => {
    navigation.navigate(item.navigate);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Accounts Center</Text>
        <View style={styles.headerIcon} /> {/* empty space */}
      </View>

      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {accountSections.map((section, idx) => (
          <View key={idx} style={{ marginBottom: 30 }}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((item, i) => (
              <Pressable key={i} style={styles.button} onPress={() => handlePress(item)}>
                <View style={styles.buttonLeft}>
                  <Ionicons name={item.icon} size={22} color="#fff" style={{ marginRight: 16 }} />
                  <Text style={styles.buttonText}>{item.text}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#fff" />
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  headerIcon: { padding: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#999", marginBottom: 12, paddingHorizontal: 20 },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#111",
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  buttonLeft: { flexDirection: "row", alignItems: "center" },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "500" },
});
