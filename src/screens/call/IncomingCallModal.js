// // // components/calls/IncomingCallModal.js
// // import React, { useEffect, useState, useRef } from 'react';
// // import { 
// //   Modal, 
// //   View, 
// //   Text, 
// //   TouchableOpacity, 
// //   StyleSheet, 
// //   Vibration,
// //   Image,
// //   Alert,
// //   Platform
// // } from 'react-native';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { 
// //   acceptCall, 
// //   rejectCall, 
// //   setLocalStream,
// //   setPeerConnection,
// //   addCallLog,
// //   resetCallState,
// //   setCallStatus,
// //   setCallAnswer
// // } from '../../features/calls/callSlice';
// // import { getSocket, emitCallAccept, emitCallReject, emitIceCandidate } from '../../lib/socket';
// // import WebRTCService from '../../lib/WebRTCService';

// // const IncomingCallModal = ({ navigation }) => {
// //   const dispatch = useDispatch();
// //   const { 
// //     callStatus, 
// //     caller, 
// //     callType, 
// //     callee, 
// //     callId,
// //     incomingCall 
// //   } = useSelector(state => state.call);
  
// //   const [ringtonePlaying, setRingtonePlaying] = useState(false);
// //   const [vibrationPattern, setVibrationPattern] = useState(null);
// //   const [callTimer, setCallTimer] = useState(0);
// //   const ringtoneRef = useRef(null);
// //   const webrtcServiceRef = useRef(null);
// //   const callTimeoutRef = useRef(null);

// //   // ✅ Initialize WebRTC service
// //   useEffect(() => {
// //     if (!caller) return;

// //     webrtcServiceRef.current = new WebRTCService({
// //       onLocalStream: (stream) => {
// //         console.log('Local stream obtained:', stream);
// //         dispatch(setLocalStream(stream));
// //       },
// //       onRemoteStream: (stream) => {
// //         console.log('Remote stream received:', stream);
// //         // Remote stream will be handled in CallScreen
// //       },
// //       onIceCandidate: (candidate) => {
// //         console.log('ICE candidate generated:', candidate);
// //         const socket = getSocket();
// //         if (socket && callId) {
// //           emitIceCandidate({
// //             targetId: caller.id,
// //             candidate: candidate,
// //             callId: callId
// //           });
// //         }
// //       },
// //       onConnectionStateChange: (state) => {
// //         console.log('Connection state changed:', state);
// //         if (state === 'connected') {
// //           dispatch(setCallStatus('connected'));
// //         } else if (state === 'failed' || state === 'disconnected') {
// //           handleReject('connection_failed');
// //         }
// //       }
// //     });

// //     // Initialize peer connection
// //     webrtcServiceRef.current.initializePeerConnection();

// //     return () => {
// //       if (webrtcServiceRef.current) {
// //         webrtcServiceRef.current.cleanup();
// //       }
// //     };
// //   }, [caller, callId]);

// //   // ✅ Ringtone and Vibration Effects
// //   useEffect(() => {
// //     if (callStatus === 'ringing' && incomingCall) {
// //       startRingtone();
// //       startVibration();
// //       startCallTimer();
// //     } else {
// //       stopRingtone();
// //       stopVibration();
// //       stopCallTimer();
// //     }

// //     return () => {
// //       stopRingtone();
// //       stopVibration();
// //       stopCallTimer();
// //     };
// //   }, [callStatus, incomingCall]);

// //   // ✅ Auto reject after 45 seconds if not answered
// //   useEffect(() => {
// //     if (callStatus === 'ringing' && incomingCall) {
// //       callTimeoutRef.current = setTimeout(() => {
// //         console.log('Auto-rejecting call due to timeout');
// //         handleReject('timeout');
// //       }, 45000); // 45 seconds
// //     }

// //     return () => {
// //       if (callTimeoutRef.current) {
// //         clearTimeout(callTimeoutRef.current);
// //       }
// //     };
// //   }, [callStatus, incomingCall]);

// //   // ✅ Socket event listeners for WebRTC negotiation
// //   useEffect(() => {
// //     const socket = getSocket();
// //     if (!socket) return;

// //     const handleCallAnswer = async (data) => {
// //       console.log('Received call answer:', data);
// //       if (webrtcServiceRef.current && data.sdp) {
// //         try {
// //           await webrtcServiceRef.current.handleAnswer(data.sdp);
// //           dispatch(setCallAnswer(true));
// //         } catch (error) {
// //           console.error('Error handling call answer:', error);
// //           handleReject('webrtc_error');
// //         }
// //       }
// //     };

// //     const handleIceCandidate = (data) => {
// //       console.log('Received ICE candidate:', data);
// //       if (webrtcServiceRef.current && data.candidate) {
// //         webrtcServiceRef.current.addIceCandidate(data.candidate);
// //       }
// //     };

// //     const handleCallEnd = (data) => {
// //       console.log('Call ended remotely:', data);
// //       handleReject(data.reason || 'ended_remotely');
// //     };

// //     // Listen for WebRTC events
// //     socket.on('call:answer', handleCallAnswer);
// //     socket.on('ice-candidate', handleIceCandidate);
// //     socket.on('call:ended', handleCallEnd);

// //     return () => {
// //       socket.off('call:answer', handleCallAnswer);
// //       socket.off('ice-candidate', handleIceCandidate);
// //       socket.off('call:ended', handleCallEnd);
// //     };
// //   }, []);

// //   const startRingtone = () => {
// //     setRingtonePlaying(true);
// //     // TODO: Implement actual ringtone with react-native-sound
// //     // For now, we'll just log and rely on vibration
// //     console.log('🔔 Ringtone started');
// //   };

// //   const stopRingtone = () => {
// //     setRingtonePlaying(false);
// //     console.log('🔕 Ringtone stopped');
// //   };

// //   const startVibration = () => {
// //     if (Platform.OS === 'ios') {
// //       // iOS vibration pattern
// //       const pattern = [0, 1000, 1000, 1000]; // vibrate, pause, vibrate, pause
// //       setVibrationPattern(pattern);
// //       Vibration.vibrate(pattern, true);
// //     } else {
// //       // Android vibration pattern
// //       const pattern = [0, 1000, 1000];
// //       setVibrationPattern(pattern);
// //       Vibration.vibrate(pattern, true);
// //     }
// //   };

// //   const stopVibration = () => {
// //     setVibrationPattern(null);
// //     Vibration.cancel();
// //   };

// //   const startCallTimer = () => {
// //     setCallTimer(0);
// //     const timer = setInterval(() => {
// //       setCallTimer(prev => {
// //         if (prev >= 45) { // Auto reject after 45 seconds
// //           handleReject('timeout');
// //           return 0;
// //         }
// //         return prev + 1;
// //       });
// //     }, 1000);

// //     callTimeoutRef.current = timer;
// //   };

// //   const stopCallTimer = () => {
// //     if (callTimeoutRef.current) {
// //       clearInterval(callTimeoutRef.current);
// //       callTimeoutRef.current = null;
// //     }
// //     setCallTimer(0);
// //   };

// //   const handleAccept = async () => {
// //     try {
// //       console.log('Accepting call...');
// //       stopRingtone();
// //       stopVibration();
// //       stopCallTimer();

// //       if (!webrtcServiceRef.current) {
// //         throw new Error('WebRTC service not initialized');
// //       }

// //       // ✅ Get user media permissions and stream
// //       const stream = await webrtcServiceRef.current.getUserMedia(
// //         callType === 'video' // request video only for video calls
// //       );

// //       if (!stream) {
// //         throw new Error('Failed to get media permissions');
// //       }

// //       // ✅ Create and set local description (answer)
// //       const answer = await webrtcServiceRef.current.createAnswer();
      
// //       // ✅ Emit call acceptance with SDP answer
// //       emitCallAccept({
// //         callerId: caller.id,
// //         sdp: answer,
// //         callType: callType,
// //         callId: callId
// //       });

// //       // ✅ Update Redux state
// //       dispatch(acceptCall());
// //       dispatch(setLocalStream(stream));
// //       dispatch(setPeerConnection(webrtcServiceRef.current.getPeerConnection()));

// //       // ✅ Navigate to call screen
// //       navigation.navigate('CallScreen', {
// //         callType: callType,
// //         isIncoming: true,
// //         caller: caller,
// //         callee: callee,
// //         callId: callId
// //       });

// //       console.log('Call accepted successfully');

// //     } catch (error) {
// //       console.error('Error accepting call:', error);
      
// //       Alert.alert(
// //         'Call Failed',
// //         'Could not start the call. Please check your permissions and try again.',
// //         [{ 
// //           text: 'OK', 
// //           onPress: () => handleReject('accept_error') 
// //         }]
// //       );
// //     }
// //   };

// //   const handleReject = (reason = 'manual') => {
// //     console.log('Rejecting call, reason:', reason);
    
// //     stopRingtone();
// //     stopVibration();
// //     stopCallTimer();

// //     // ✅ Add to call logs based on reason
// //     const callLog = {
// //       type: 'incoming',
// //       status: reason === 'timeout' ? 'missed' : 'rejected',
// //       caller: caller,
// //       callee: callee,
// //       callType: callType,
// //       timestamp: Date.now(),
// //       duration: 0,
// //       reason: reason
// //     };

// //     dispatch(addCallLog(callLog));

// //     // ✅ Emit rejection event
// //     if (callId) {
// //       emitCallReject({ 
// //         callerId: caller.id,
// //         reason: reason,
// //         callId: callId
// //       });
// //     }

// //     // ✅ Update Redux state
// //     dispatch(rejectCall());

// //     // ✅ Cleanup WebRTC
// //     if (webrtcServiceRef.current) {
// //       webrtcServiceRef.current.cleanup();
// //     }

// //     // ✅ Clear any pending timeouts
// //     if (callTimeoutRef.current) {
// //       clearTimeout(callTimeoutRef.current);
// //       callTimeoutRef.current = null;
// //     }
// //   };

// //   const handleSendMessage = () => {
// //     const rejectReason = 'message';
// //     handleReject(rejectReason);
    
// //     // Navigate to chat with pre-filled message
// //     navigation.navigate('Chat', { 
// //       userId: caller.id,
// //       prefillMessage: `I can't talk right now. I'll call you back later.`
// //     });
// //   };

// //   const handleAudioOnly = () => {
// //     if (callType === 'video') {
// //       Alert.alert(
// //         'Switch to Audio',
// //         'Answer as audio call only? This will switch to audio mode.',
// //         [
// //           { 
// //             text: 'Cancel', 
// //             style: 'cancel' 
// //           },
// //           { 
// //             text: 'Audio Only', 
// //             onPress: async () => {
// //               try {
// //                 // Stop current ringtone and vibration
// //                 stopRingtone();
// //                 stopVibration();
// //                 stopCallTimer();

// //                 // Get audio-only stream
// //                 const stream = await webrtcServiceRef.current.getUserMedia(false);
                
// //                 // Create answer for audio-only call
// //                 const answer = await webrtcServiceRef.current.createAnswer();
                
// //                 // Emit call acceptance with audio-only flag
// //                 emitCallAccept({
// //                   callerId: caller.id,
// //                   sdp: answer,
// //                   callType: 'audio', // Switch to audio
// //                   callId: callId
// //                 });

// //                 // Update Redux state
// //                 dispatch(acceptCall());
// //                 dispatch(setLocalStream(stream));
// //                 dispatch(setPeerConnection(webrtcServiceRef.current.getPeerConnection()));

// //                 // Navigate to call screen in audio mode
// //                 navigation.navigate('CallScreen', {
// //                   callType: 'audio',
// //                   isIncoming: true,
// //                   caller: caller,
// //                   callee: callee,
// //                   callId: callId
// //                 });

// //               } catch (error) {
// //                 console.error('Error accepting audio call:', error);
// //                 handleReject('audio_error');
// //               }
// //             }
// //           }
// //         ]
// //       );
// //     }
// //   };

// //   // ✅ Don't show modal if no incoming call
// //   if (!incomingCall || callStatus !== 'ringing' || !caller) {
// //     return null;
// //   }

// //   const formatTimer = (seconds) => {
// //     const remaining = 45 - seconds;
// //     return `00:${remaining < 10 ? '0' : ''}${remaining}`;
// //   };

// //   return (
// //     <Modal 
// //       visible={true} 
// //       transparent 
// //       animationType="slide"
// //       statusBarTranslucent={true}
// //       onRequestClose={() => handleReject('back_button')}
// //     >
// //       <View style={styles.container}>
// //         {/* Background Overlay */}
// //         <View style={styles.backgroundOverlay} />
        
// //         {/* Caller Info Section */}
// //         <View style={styles.callerInfo}>
// //           <Image 
// //             source={{ uri: caller.avatar || 'https://via.placeholder.com/150' }} 
// //             style={styles.callerAvatar}
// //             // defaultSource={require('../../assets/default-avatar.png')}
// //           />
// //           <Text style={styles.callerName}>
// //             {caller.name || caller.username || 'Unknown Caller'}
// //           </Text>
// //           <Text style={styles.callType}>
// //             {callType === 'video' ? 'Video Call' : 'Voice Call'}
// //           </Text>
// //           <Text style={styles.callStatus}>
// //             {ringtonePlaying ? 'Ringing...' : 'Incoming call'}
// //           </Text>
// //           <Text style={styles.timerText}>
// //             {formatTimer(callTimer)}
// //           </Text>
// //         </View>

// //         {/* Action Buttons */}
// //         <View style={styles.actionsContainer}>
// //           {/* Reject Button */}
// //           <TouchableOpacity 
// //             style={[styles.actionButton, styles.rejectButton]}
// //             onPress={() => handleReject('manual')}
// //             activeOpacity={0.7}
// //           >
// //             <View style={styles.buttonIcon}>
// //               <Text style={styles.rejectIcon}>✕</Text>
// //             </View>
// //             <Text style={styles.buttonText}>Decline</Text>
// //           </TouchableOpacity>

// //           {/* Accept Button */}
// //           <TouchableOpacity 
// //             style={[styles.actionButton, styles.acceptButton]}
// //             onPress={handleAccept}
// //             activeOpacity={0.7}
// //           >
// //             <View style={styles.buttonIcon}>
// //               <Text style={styles.acceptIcon}>
// //                 {callType === 'video' ? '📹' : '📞'}
// //               </Text>
// //             </View>
// //             <Text style={styles.buttonText}>
// //               {callType === 'video' ? 'Video' : 'Audio'}
// //             </Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Additional Options */}
// //         <View style={styles.optionsContainer}>
// //           <TouchableOpacity 
// //             style={styles.optionButton}
// //             onPress={handleSendMessage}
// //           >
// //             <Text style={styles.optionText}>Message</Text>
// //           </TouchableOpacity>
          
// //           {callType === 'video' && (
// //             <TouchableOpacity 
// //               style={styles.optionButton}
// //               onPress={handleAudioOnly}
// //             >
// //               <Text style={styles.optionText}>Audio Only</Text>
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       </View>
// //     </Modal>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //     backgroundColor: 'rgba(0,0,0,0.95)',
// //   },
// //   backgroundOverlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'rgba(0,0,0,0.8)',
// //   },
// //   callerInfo: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingTop: 100,
// //   },
// //   callerAvatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     marginBottom: 25,
// //     borderWidth: 4,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //   },
// //   callerName: {
// //     fontSize: 32,
// //     fontWeight: 'bold',
// //     color: 'white',
// //     marginBottom: 10,
// //     textAlign: 'center',
// //   },
// //   callType: {
// //     fontSize: 18,
// //     color: 'rgba(255,255,255,0.8)',
// //     marginBottom: 5,
// //   },
// //   callStatus: {
// //     fontSize: 16,
// //     color: 'rgba(255,255,255,0.6)',
// //     marginBottom: 5,
// //   },
// //   timerText: {
// //     fontSize: 14,
// //     color: 'rgba(255,255,255,0.5)',
// //     fontFamily: 'monospace',
// //   },
// //   actionsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //     paddingHorizontal: 50,
// //     paddingBottom: 80,
// //   },
// //   actionButton: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   buttonIcon: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 3,
// //     elevation: 5,
// //   },
// //   rejectButton: {
// //     backgroundColor: '#ff3b30',
// //   },
// //   acceptButton: {
// //     backgroundColor: '#4cd964',
// //   },
// //   rejectIcon: {
// //     fontSize: 35,
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// //   acceptIcon: {
// //     fontSize: 35,
// //     color: 'white',
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   optionsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     paddingBottom: 40,
// //   },
// //   optionButton: {
// //     paddingHorizontal: 25,
// //     paddingVertical: 12,
// //     marginHorizontal: 10,
// //     backgroundColor: 'rgba(255,255,255,0.1)',
// //     borderRadius: 20,
// //   },
// //   optionText: {
// //     color: 'rgba(255,255,255,0.8)',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// // });

// // export default IncomingCallModal;







// // components/calls/IncomingCallModal.js
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Vibration,
//   Image,
//   Alert,
//   Platform,
// } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   acceptCall,
//   rejectCall,
//   addCallLog,
//   setCallStatus,
//   setLocalStreamId,
//   setRemoteStreamId,
// } from "../../features/calls/callSlice";
// import {
//   getSocket,
//   emitCallAccept,
//   emitCallReject,
//   emitIceCandidate,
// } from "../../lib/socket";
// import WebRTCService from "../../lib/WebRTCService";

// const IncomingCallModal = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const {
//     callStatus,
//     caller,
//     callType,
//     callee,
//     callId,
//     incomingCall,
//   } = useSelector((state) => state.call);

//   const [ringtonePlaying, setRingtonePlaying] = useState(false);
//   const [callTimer, setCallTimer] = useState(0);

//   const webrtcServiceRef = useRef(null);
//   const timerRef = useRef(null);
//   const timeoutRef = useRef(null);

//   // ✅ Setup WebRTC service
//   useEffect(() => {
//     if (!caller || !callId) return;

//     webrtcServiceRef.current = new WebRTCService({
//       onLocalStream: (stream) => {
//         dispatch(setLocalStreamId(stream.id));
//       },
//       onRemoteStream: (stream) => {
//         dispatch(setRemoteStreamId(stream.id));
//       },
//       onIceCandidate: (candidate) => {
//         const socket = getSocket();
//         if (socket) {
//           emitIceCandidate({
//             targetId: caller.id,
//             candidate,
//             callId,
//           });
//         }
//       },
//       onConnectionStateChange: (state) => {
//         if (state === "connected") {
//           dispatch(setCallStatus("connected"));
//         } else if (state === "failed" || state === "disconnected") {
//           handleReject("connection_failed");
//         }
//       },
//     });

//     return () => {
//       webrtcServiceRef.current?.cleanup();
//     };
//   }, [caller, callId]);

//   // ✅ Ringtone + vibration + timer
//   useEffect(() => {
//     if (callStatus === "ringing" && incomingCall) {
//       startRingtone();
//       startVibration();
//       startTimer();

//       // auto reject after 45s
//       timeoutRef.current = setTimeout(() => {
//         handleReject("timeout");
//       }, 45000);
//     } else {
//       cleanupRinging();
//     }

//     return () => cleanupRinging();
//   }, [callStatus, incomingCall]);

//   // ✅ Socket listeners
//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;

//     const handleIceCandidate = (data) => {
//       if (webrtcServiceRef.current && data.candidate) {
//         webrtcServiceRef.current.addIceCandidate(data.candidate);
//       }
//     };

//     const handleCallEnd = (data) => {
//       handleReject(data.reason || "ended_remotely");
//     };

//     socket.on("ice-candidate", handleIceCandidate);
//     socket.on("call:ended", handleCallEnd);

//     return () => {
//       socket.off("ice-candidate", handleIceCandidate);
//       socket.off("call:ended", handleCallEnd);
//     };
//   }, []);

//   const startRingtone = () => {
//     setRingtonePlaying(true);
//     console.log("🔔 Ringtone started (implement with RN Sound if needed)");
//   };
//   const stopRingtone = () => {
//     setRingtonePlaying(false);
//     console.log("🔕 Ringtone stopped");
//   };
//   const startVibration = () => {
//     const pattern = [0, 1000, 1000];
//     Vibration.vibrate(pattern, true);
//   };
//   const stopVibration = () => {
//     Vibration.cancel();
//   };

//   const startTimer = () => {
//     timerRef.current = setInterval(() => {
//       setCallTimer((prev) => prev + 1);
//     }, 1000);
//   };
//   const stopTimer = () => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     setCallTimer(0);
//   };

//   const cleanupRinging = () => {
//     stopRingtone();
//     stopVibration();
//     stopTimer();
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//   };

//   const handleAccept = async () => {
//     try {
//       cleanupRinging();

//       const stream = await webrtcServiceRef.current.getUserMedia(
//         callType === "video"
//       );
//       if (!stream) throw new Error("Media permission denied");

//       const answer = await webrtcServiceRef.current.createAnswer();

//       emitCallAccept({
//         callerId: caller.id,
//         sdp: answer,
//         callType,
//         callId,
//       });

//       dispatch(acceptCall());
//       dispatch(setLocalStreamId(stream.id));

//       navigation.navigate("CallScreen", {
//         callType,
//         isIncoming: true,
//         caller,
//         callee,
//         callId,
//       });
//     } catch (err) {
//       console.error("Error accepting call:", err);
//       Alert.alert("Call Failed", "Could not accept the call.");
//       handleReject("accept_error");
//     }
//   };

//   const handleReject = (reason = "manual") => {
//     cleanupRinging();

//     const log = {
//       type: "incoming",
//       status: reason === "timeout" ? "missed" : "rejected",
//       caller,
//       callee,
//       callType,
//       timestamp: Date.now(),
//       duration: 0,
//       reason,
//     };
//     dispatch(addCallLog(log));

//     if (callId) {
//       emitCallReject({ callerId: caller.id, reason, callId });
//     }

//     dispatch(rejectCall());
//     webrtcServiceRef.current?.cleanup();
//   };

//   // Don’t show modal if no incoming call
//   if (!incomingCall || callStatus !== "ringing" || !caller) return null;

//   const formatTimer = (seconds) => {
//     const remaining = 45 - seconds;
//     return `00:${remaining < 10 ? "0" : ""}${remaining}`;
//   };

//   return (
//     <Modal visible transparent animationType="slide" onRequestClose={() => handleReject("back_button")}>
//       <View style={styles.container}>
//         {/* Caller Info */}
//         <View style={styles.callerInfo}>
//           <Image
//             source={{ uri: caller.avatar || "https://via.placeholder.com/150" }}
//             style={styles.callerAvatar}
//           />
//           <Text style={styles.callerName}>
//             {caller.name || caller.username || "Unknown"}
//           </Text>
//           <Text style={styles.callType}>
//             {callType === "video" ? "Video Call" : "Voice Call"}
//           </Text>
//           <Text style={styles.callStatus}>
//             {ringtonePlaying ? "Ringing..." : "Incoming call"}
//           </Text>
//           <Text style={styles.timerText}>{formatTimer(callTimer)}</Text>
//         </View>

//         {/* Actions */}
//         <View style={styles.actionsContainer}>
//           <TouchableOpacity
//             style={[styles.button, styles.reject]}
//             onPress={() => handleReject("manual")}
//           >
//             <Text style={styles.icon}>✕</Text>
//             <Text style={styles.label}>Decline</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, styles.accept]}
//             onPress={handleAccept}
//           >
//             <Text style={styles.icon}>
//               {callType === "video" ? "📹" : "📞"}
//             </Text>
//             <Text style={styles.label}>
//               {callType === "video" ? "Video" : "Audio"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "space-between", backgroundColor: "rgba(0,0,0,0.95)" },
//   callerInfo: { flex: 1, justifyContent: "center", alignItems: "center" },
//   callerAvatar: { width: 150, height: 150, borderRadius: 75, marginBottom: 25 },
//   callerName: { fontSize: 28, fontWeight: "bold", color: "white" },
//   callType: { fontSize: 18, color: "#ccc" },
//   callStatus: { fontSize: 16, color: "#aaa" },
//   timerText: { fontSize: 14, color: "#999", fontFamily: "monospace" },
//   actionsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingBottom: 80,
//   },
//   button: { alignItems: "center" },
//   icon: { fontSize: 36, color: "white" },
//   label: { color: "white", marginTop: 5 },
//   reject: { backgroundColor: "#d9534f", borderRadius: 50, padding: 20 },
//   accept: { backgroundColor: "#4cd964", borderRadius: 50, padding: 20 },
// });

// export default IncomingCallModal;
