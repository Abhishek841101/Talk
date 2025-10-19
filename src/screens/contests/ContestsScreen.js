


import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ContestCard from "../../components/ContestCard";
import ContestCreateModal from "../../components/ContestCreateModal";
import { fetchContests } from "../../features/Contests/ContestsSlice";

export default function ContestsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { contests } = useSelector((state) => state.contests);

  const [search, setSearch] = useState("");
  const [section, setSection] = useState("coming");
  const [createVisible, setCreateVisible] = useState(false);

  useEffect(() => {
    console.log("🔄 useEffect triggered, fetching contests for section:", section);
    dispatch(fetchContests({ section }));
  }, [section]);

  console.log("📌 Current contests state from Redux:", contests);

  const filtered = contests.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  console.log("🔍 Filtered contests after search:", filtered);

  return (
    <View style={styles.container}>
      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search contests..."
        value={search}
        onChangeText={(text) => {
          console.log("✏️ Search text updated:", text);
          setSearch(text);
        }}
      />

      {/* Sections filter */}
      <View style={styles.sections}>
        {["coming", "popular", "recommended", "all"].map(sec => (
          <TouchableOpacity 
            key={sec} 
            onPress={() => {
              console.log("📂 Section changed to:", sec);
              setSection(sec);
            }}
          >
            <Text style={[styles.sectionText, section === sec && styles.sectionActive]}>
              {sec.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contests list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => {
          console.log("🆔 Key Extractor for contest:", item._id);
          return item._id;
        }}
        renderItem={({ item }) => {
          console.log("🎴 Rendering ContestCard for:", item.title);
          return (
            <ContestCard
              contest={item}
              onPress={() => {
                console.log("➡️ Contest clicked, navigating to ContestDetails with:", item._id);
                navigation.navigate("ContestDetails", { contest: item });
              }}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Create Contest Modal */}
      <ContestCreateModal 
        visible={createVisible} 
        onClose={() => {
          console.log("❌ Closing Create Contest Modal");
          setCreateVisible(false);
        }} 
      />

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => {
          console.log("➕ Create Contest button clicked");
          setCreateVisible(true);
        }}
      >
        <Text style={styles.createBtnText}>+ Create Contest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 10 },
  searchInput: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 8 },
  sections: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  sectionText: { fontSize: 14, color: "#555" },
  sectionActive: { color: "#FF6B00", fontWeight: "bold" },
  createBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF6B00",
    padding: 12,
    borderRadius: 30,
  },
  createBtnText: { color: "#fff", fontWeight: "bold" },
});









