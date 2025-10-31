import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CreateScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 50 }}>
        {/* ============== TOP ROW ============== */}
        <View style={styles.row}>
          {/* REEL SHORT */}
          <TouchableOpacity
            style={styles.block}
            onPress={() => navigation.navigate("UploadReel")}
          >
            <View style={styles.iconBox}>
              <Ionicons name="videocam-outline" size={30} color="#A45CFF" />
            </View>
            <Text style={styles.mainTitle}>Reel</Text>
            {/* <Text style={styles.subTitle}>Short</Text> */}

            <View style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Record Short Video</Text>
            </View>
          </TouchableOpacity>

          {/* POST */}
          <TouchableOpacity
            style={styles.block}
            onPress={() => navigation.navigate("PostCreateScreen")}
          >
            <View style={styles.iconBox}>
              <Ionicons name="image-outline" size={30} color="#7DB9FF" />
            </View>
            <Text style={styles.mainTitle}>Post</Text>
            {/* <Text style={styles.subTitle}>Upload</Text> */}

            <View style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Upload & Edit</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ============== PODCAST ROW ============== */}
        <View style={styles.row}>
          {renderDisabled("Podcast", "Upload Audio/Video", "mic-outline")}
          {renderDisabled("Record & Upload", "Record + Edit", "recording-outline")}
        </View>

        {/* ============== GO LIVE / LONG VIDEO ============== */}
        <View style={styles.row}>
          {renderDisabled("Go Live", "Live Stream", "radio-outline")}
          {renderDisabled("Long Video", "Upload & Edit", "film-outline")}
        </View>

        {/* ======== SETTINGS ======== */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Monetization</Text>
          <View style={styles.switchFake} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Enable Live Chat</Text>
          <View style={styles.switchFake} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Schedule Post</Text>
          <View style={styles.dateFake}>
            <Text style={{ color: "#999" }}>Datetime Picker</Text>
          </View>
        </View>

        {/* ===== RECENT DRAFTS ===== */}
        <Text style={styles.sectionTitle}>Recent Drafts</Text>

        <TouchableOpacity style={styles.draftRow}>
          <Image
            source={{
              uri: "https://via.placeholder.com/80x80",
            }}
            style={styles.draftImage}
          />
          <View>
            <Text style={styles.draftTitle}>Podcast Intro - V2</Text>
            <Text style={styles.draftSub}>2 days ago</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.draftRow}>
          <Image
            source={{
              uri: "https://via.placeholder.com/80x80",
            }}
            style={styles.draftImage}
          />
          <View>
            <Text style={styles.draftTitle}>Morning Routine Reel</Text>
            <Text style={styles.draftSub}>6 days ago</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ============== DISABLED (NO CLICK) BLOCKS ============== */
function renderDisabled(title, sub, icon) {
  return (
    <View style={[styles.block, { opacity: 0.3 }]}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={30} color="#fff" />
      </View>
      <Text style={styles.mainTitle}>{title}</Text>
      <Text style={styles.subTitle}>{sub}</Text>
      <View style={styles.smallBtn}>
        <Text style={styles.smallBtnText}>Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    zIndex: 10,
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  row: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 12,
  },

  block: {
    width: "45%",
    backgroundColor: "#111",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  iconBox: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
  },

  mainTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  subTitle: { color: "#888", fontSize: 13 },

  smallBtn: {
    marginTop: 14,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  smallBtnText: { color: "#fff", fontSize: 12 },

  /* ===== Settings ===== */
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  settingText: { color: "#fff", fontSize: 16 },
  switchFake: {
    width: 40,
    height: 22,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  dateFake: {
    backgroundColor: "#222",
    padding: 8,
    borderRadius: 10,
  },

  /* ===== Drafts ===== */
  sectionTitle: {
    color: "#fff",
    marginLeft: 18,
    marginTop: 14,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
  },

  draftRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 12,
    alignItems: "center",
  },

  draftImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  draftTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  draftSub: { color: "#888", fontSize: 12 },
});
