
// import React, { useState } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { useDispatch } from "react-redux";
// import { createContestAPI } from "../features/Contests/ContestsSlice";

// export default function ContestCreateModal({ visible, onClose }) {
//   const dispatch = useDispatch();

//   // Form state
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [slots, setSlots] = useState("2");

//   // NEW: user entered dates & prize
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [prize, setPrize] = useState("");

//   const handleSubmit = () => {
//     if (!title.trim() || !description.trim() || !startDate.trim() || !endDate.trim()) {
//       Alert.alert("Error", "Please fill all required fields");
//       return;
//     }

//     const totalSlots = slots ? parseInt(slots) : 2;

//     dispatch(
//       createContestAPI({
//         title,
//         description,
//         prize,
//         slots: totalSlots,
//         startDate,
//         endDate,
//       })
//     );

//     Alert.alert("Success", "Contest created successfully!");
//     onClose();

//     // Reset fields
//     setTitle("");
//     setDescription("");
//     setSlots("2");
//     setStartDate("");
//     setEndDate("");
//     setPrize("");
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <Text style={styles.header}>Create Contest</Text>
//           <ScrollView>
//             <TextInput
//               style={styles.input}
//               placeholder="Title"
//               value={title}
//               onChangeText={setTitle}
//             />
//             <TextInput
//               style={[styles.input, { height: 80 }]}
//               placeholder="Description"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Slots"
//               value={slots}
//               onChangeText={setSlots}
//               keyboardType="numeric"
//             />

//             {/* Start / End date & Prize */}
//             <TextInput
//               style={styles.input}
//               placeholder="Start Date (YYYY-MM-DD HH:mm)"
//               value={startDate}
//               onChangeText={setStartDate}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="End Date (YYYY-MM-DD HH:mm)"
//               value={endDate}
//               onChangeText={setEndDate}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Prize"
//               value={prize}
//               onChangeText={setPrize}
//             />

//             <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//               <Text style={styles.submitText}>Create</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     maxHeight: "80%",
//   },
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#FF6B00" },
//   input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 8 },
//   submitBtn: { backgroundColor: "#FF6B00", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 6 },
//   submitText: { color: "#fff", fontWeight: "bold" },
//   cancelBtn: { backgroundColor: "#ccc", padding: 12, borderRadius: 8, alignItems: "center" },
//   cancelText: { color: "#333", fontWeight: "bold" },
// });











import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// import { Picker } from "@react-native-picker/picker"; // Make sure to install: expo install @react-native-picker/picker
import { useDispatch } from "react-redux";
import { createContestAPI } from "../features/Contests/ContestsSlice";

export default function ContestCreateModal({ visible, onClose }) {
  const dispatch = useDispatch();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState("2");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prize, setPrize] = useState("");
  const [contestType, setContestType] = useState("solo"); // solo | group

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const totalSlots = slots ? parseInt(slots) : 2;

    dispatch(
      createContestAPI({
        title,
        description,
        prize,
        slots: totalSlots,
        startDate,
        endDate,
        contestType, // ✅ store contest type
      })
    );

    Alert.alert("Success", "Contest created successfully!");
    onClose();

    // Reset all fields
    setTitle("");
    setDescription("");
    setSlots("2");
    setStartDate("");
    setEndDate("");
    setPrize("");
    setContestType("solo");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Create Contest</Text>
          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Slots"
              value={slots}
              onChangeText={setSlots}
              keyboardType="numeric"
            />

            {/* Start / End Date (keep existing) */}
            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD HH:mm)"
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD HH:mm)"
              value={endDate}
              onChangeText={setEndDate}
            />

            {/* Prize + Contest Type (same row) */}
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Prize"
                value={prize}
                onChangeText={setPrize}
              />
              <View style={[styles.input, styles.halfInput]}>
                <Picker
                  selectedValue={contestType}
                  onValueChange={(val) => setContestType(val)}
                  mode="dropdown"
                >
                  <Picker.Item label="Solo" value="solo" />
                  <Picker.Item label="Group" value="group" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    maxHeight: "80%",
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#FF6B00" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  halfInput: { flex: 1, marginHorizontal: 4 },
  submitBtn: { backgroundColor: "#FF6B00", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 6 },
  submitText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: { backgroundColor: "#ccc", padding: 12, borderRadius: 8, alignItems: "center" },
  cancelText: { color: "#333", fontWeight: "bold" },
});
