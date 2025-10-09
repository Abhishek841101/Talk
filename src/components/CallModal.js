// src/components/CallModal.js
import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Vibration, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { endCall } from "../../features/calls/callSlice";
import SocketService from "../../lib/socket";
import audioService from "../../lib/AudioService"; // your SimpleAudioService

export default function CallModal({ visible, onCancel, type, incoming = false }) {
  const dispatch = useDispatch();
  const { callee, callId } = useSelector((state) => state.call);
  const [ringingText, setRingingText] = useState(incoming ? "Incoming Call" : "Calling...");
  const [dots, setDots] = useState(0);

  // Animate dots for outgoing call
  useEffect(() => {
    if (!incoming) {
      const interval = setInterval(() => setDots((d) => (d + 1) % 4), 600);
      return () => clearInterval(interval);
    }
  }, [incoming]);

  useEffect(() => {
    if (!incoming) setRingingText(`Calling${'.'.repeat(dots)}`);
  }, [dots, incoming]);

  // Play ringtone / ringback
  useEffect(() => {
    if (!visible) return;

    const playTone = async () => {
      if (incoming) {
        console.log("[CallModal] Incoming call ringtone started");
        await audioService.playRingtone();
        if (Platform.OS === "android") Vibration.vibrate([0, 500, 500, 500], true); // vibrate pattern
      } else {
        console.log("[CallModal] Outgoing call ringback started");
        await audioService.playRingback();
      }
    };

    playTone();

    return () => {
      console.log("[CallModal] Cleaning up audio on modal close");
      audioService.stopRingtone();
      audioService.stopRingback();
      if (Platform.OS === "android") Vibration.cancel();
    };
  }, [visible, incoming]);

  // Socket events for answer/reject
  useEffect(() => {
    const handleAnswer = () => {
      console.log("[CallModal] Call answered");
      audioService.stopRingtone();
      audioService.stopRingback();
      onCancel();
    };
    const handleReject = () => {
      console.log("[CallModal] Call rejected");
      Vibration.vibrate(200);
      audioService.stopRingtone();
      audioService.stopRingback();
      dispatch(endCall({ reason: "rejected" }));
      onCancel();
    };

    SocketService.onCallAnswer(handleAnswer);
    SocketService.onCallRejected(handleReject);

    return () => {
      SocketService.offCallAnswer(handleAnswer);
      SocketService.offCallRejected(handleReject);
    };
  }, []);

  const cancelCall = () => {
    if (callId) SocketService.emitCallEnd({ callId, reason: "canceled" });
    dispatch(endCall({ reason: "canceled" }));
    audioService.stopRingtone();
    audioService.stopRingback();
    if (Platform.OS === "android") Vibration.cancel();
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={cancelCall}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Ionicons
            name={type === "video" ? "videocam" : "call"}
            size={64}
            color="#fff"
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.name}>{callee?.name || "Unknown User"}</Text>
          <Text style={styles.status}>{ringingText}</Text>

          <TouchableOpacity style={styles.endButton} onPress={cancelCall}>
            <Ionicons name="call" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  status: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30,
  },
  endButton: {
    backgroundColor: "red",
    padding: 18,
    borderRadius: 50,
  },
});
