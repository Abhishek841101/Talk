// // import React, { useEffect, useRef, useState } from 'react';
// // import { 
// //   View, 
// //   Text, 
// //   TouchableOpacity, 
// //   StyleSheet, 
// //   SafeAreaView,
// //   Image,
// //   Alert,
// //   Platform,
// //   StatusBar,
// //   Dimensions
// // } from 'react-native';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { 
// //   endCall, 
// //   setRemoteStream, 
// //   setCallDuration,
// //   toggleAudio,
// //   toggleVideo,
// //   switchCamera,
// //   setCallStatus
// // } from '../../features/calls/callSlice';
// // import { emitCallEnd, emitIceCandidate, getSocket } from '../../lib/socket';
// // import WebRTCService from '../../lib/WebRTCService';

// // const { width, height } = Dimensions.get('window');

// // const CallScreen = ({ navigation, route }) => {
// //   const dispatch = useDispatch();
// //   const { 
// //     callType, 
// //     caller, 
// //     callee, 
// //     callDuration, 
// //     localStream, 
// //     remoteStream, 
// //     peerConnection,
// //     callId,
// //     isAudioEnabled,
// //     isVideoEnabled,
// //     callStatus
// //   } = useSelector(state => state.call);

// //   const [isSpeakerOn, setIsSpeakerOn] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);
// //   const [remoteVideoAspect, setRemoteVideoAspect] = useState(16/9);
// //   const webrtcServiceRef = useRef(null);
// //   const localVideoRef = useRef(null);
// //   const remoteVideoRef = useRef(null);

// //   // ✅ Initialize WebRTC service and streams
// //   useEffect(() => {
// //     const initializeCall = async () => {
// //       webrtcServiceRef.current = new WebRTCService({
// //         onRemoteStream: (stream) => {
// //           console.log('Remote stream received in CallScreen:', stream);
// //           dispatch(setRemoteStream(stream));
          
// //           // Setup remote video element
// //           if (remoteVideoRef.current && stream) {
// //             // For React Native, you'd use a WebRTC video component
// //             // remoteVideoRef.current.srcObject = stream;
// //           }
// //         },
// //         onIceCandidate: (candidate) => {
// //           const socket = getSocket();
// //           if (socket && callId) {
// //             emitIceCandidate({
// //               targetId: route.params?.isIncoming ? caller.id : callee.id,
// //               candidate: candidate,
// //               callId: callId
// //             });
// //           }
// //         },
// //         onConnectionStateChange: (state) => {
// //           console.log('Connection state:', state);
// //           if (state === 'disconnected' || state === 'failed') {
// //             handleEndCall('connection_lost');
// //           }
// //         }
// //       });

// //       // Reuse existing peer connection or create new one
// //       if (peerConnection) {
// //         webrtcServiceRef.current.setPeerConnection(peerConnection);
// //       }

// //       // Setup local video preview
// //       if (localStream && localVideoRef.current) {
// //         // For React Native WebRTC: localVideoRef.current.srcObject = localStream;
// //       }

// //       // Start call duration timer
// //       startCallTimer();
// //     };

// //     initializeCall();

// //     return () => {
// //       // Cleanup on unmount
// //       if (webrtcServiceRef.current) {
// //         webrtcServiceRef.current.cleanup();
// //       }
// //     };
// //   }, []);

// //   // ✅ Socket event listeners for call updates
// //   useEffect(() => {
// //     const socket = getSocket();
// //     if (!socket) return;

// //     const handleCallEnded = (data) => {
// //       console.log('Call ended by remote party:', data);
// //       handleEndCall('ended_by_remote');
// //     };

// //     const handleIceCandidate = (data) => {
// //       if (webrtcServiceRef.current && data.candidate) {
// //         webrtcServiceRef.current.addIceCandidate(data.candidate);
// //       }
// //     };

// //     socket.on('call:ended', handleCallEnded);
// //     socket.on('ice-candidate', handleIceCandidate);

// //     return () => {
// //       socket.off('call:ended', handleCallEnded);
// //       socket.off('ice-candidate', handleIceCandidate);
// //     };
// //   }, []);

// //   const startCallTimer = () => {
// //     const startTime = Date.now();
// //     const timer = setInterval(() => {
// //       const duration = Math.floor((Date.now() - startTime) / 1000);
// //       dispatch(setCallDuration(duration));
// //     }, 1000);

// //     return () => clearInterval(timer);
// //   };

// //   const formatDuration = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   const handleEndCall = (reason = 'ended_manually') => {
// //     console.log('Ending call, reason:', reason);
    
// //     // Emit call end event
// //     if (callId) {
// //       emitCallEnd({ 
// //         callId: callId,
// //         reason: reason
// //       });
// //     }

// //     // Update Redux state
// //     dispatch(endCall());
// //     dispatch(setCallStatus('ended'));

// //     // Cleanup WebRTC
// //     if (webrtcServiceRef.current) {
// //       webrtcServiceRef.current.cleanup();
// //     }

// //     // Navigate back
// //     navigation.goBack();
// //   };

// //   const handleToggleAudio = () => {
// //     if (webrtcServiceRef.current) {
// //       const success = webrtcServiceRef.current.toggleAudio();
// //       if (success) {
// //         dispatch(toggleAudio());
// //         setIsMuted(!isMuted);
// //       }
// //     }
// //   };

// //   const handleToggleVideo = () => {
// //     if (webrtcServiceRef.current) {
// //       const success = webrtcServiceRef.current.toggleVideo();
// //       if (success) {
// //         dispatch(toggleVideo());
// //       }
// //     }
// //   };

// //   const handleSwitchCamera = () => {
// //     if (webrtcServiceRef.current && callType === 'video') {
// //       webrtcServiceRef.current.switchCamera().then(success => {
// //         if (success) {
// //           dispatch(switchCamera());
// //           setIsFrontCamera(!isFrontCamera);
// //         }
// //       });
// //     }
// //   };

// //   const handleToggleSpeaker = () => {
// //     // This would require native module for speaker control
// //     setIsSpeakerOn(!isSpeakerOn);
// //     // Implement speaker toggle logic here
// //   };

// //   const handleMinimizeCall = () => {
// //     // Implement picture-in-picture or minimize functionality
// //     Alert.alert('Info', 'Minimize feature would be implemented here');
// //   };

// //   // Render participant info
// //   const renderParticipantInfo = () => {
// //     const participant = route.params?.isIncoming ? caller : callee;
// //     return (
// //       <View style={styles.participantInfo}>
// //         <Image 
// //           source={{ uri: participant?.avatar || 'https://via.placeholder.com/150' }} 
// //           style={styles.participantAvatar}
// //           // defaultSource={require('../../assets/default-avatar.png')}
// //         />
// //         <Text style={styles.participantName}>
// //           {participant?.name || participant?.username || 'Unknown'}
// //         </Text>
// //         <Text style={styles.callStatus}>
// //           {callStatus === 'connected' ? formatDuration(callDuration) : 'Connecting...'}
// //         </Text>
// //         <Text style={styles.callType}>
// //           {callType === 'video' ? 'Video Call' : 'Voice Call'}
// //         </Text>
// //       </View>
// //     );
// //   };

// //   // Render local video preview (for video calls)
// //   const renderLocalVideo = () => {
// //     if (callType !== 'video') return null;

// //     return (
// //       <View style={styles.localVideoContainer}>
// //         <Text style={styles.localVideoLabel}>You</Text>
// //         {/* For React Native WebRTC, you'd use RTCView component */}
// //         <View style={styles.videoPlaceholder}>
// //           <Text style={styles.videoPlaceholderText}>
// //             {isVideoEnabled ? 'Local Video' : 'Video Off'}
// //           </Text>
// //         </View>
// //         {!isVideoEnabled && (
// //           <Image 
// //             source={{ uri: callee?.avatar }} 
// //             style={styles.videoDisabledAvatar}
// //           />
// //         )}
// //       </View>
// //     );
// //   };

// //   // Render remote video (for video calls)
// //   const renderRemoteVideo = () => {
// //     if (callType !== 'video') return null;

// //     return (
// //       <View style={styles.remoteVideoContainer}>
// //         {/* For React Native WebRTC, you'd use RTCView component */}
// //         <View style={styles.videoPlaceholderLarge}>
// //           <Text style={styles.videoPlaceholderText}>
// //             {remoteStream ? 'Remote Video' : 'Waiting for video...'}
// //           </Text>
// //         </View>
// //         {!remoteStream && (
// //           <Image 
// //             source={{ uri: caller?.avatar }} 
// //             style={styles.remoteAvatar}
// //           />
// //         )}
// //       </View>
// //     );
// //   };

// //   // Render call controls
// //   const renderCallControls = () => {
// //     return (
// //       <View style={styles.controlsContainer}>
// //         {/* Minimize Button */}
// //         <TouchableOpacity 
// //           style={styles.controlButton}
// //           onPress={handleMinimizeCall}
// //         >
// //           <View style={[styles.controlIcon, styles.minimizeIcon]}>
// //             <Text style={styles.controlIconText}>−</Text>
// //           </View>
// //           <Text style={styles.controlText}>Minimize</Text>
// //         </TouchableOpacity>

// //         {/* Mute/Unmute Button */}
// //         <TouchableOpacity 
// //           style={styles.controlButton}
// //           onPress={handleToggleAudio}
// //         >
// //           <View style={[styles.controlIcon, isMuted ? styles.controlIconDisabled : styles.audioIcon]}>
// //             <Text style={styles.controlIconText}>
// //               {isMuted ? '🎤❌' : '🎤'}
// //             </Text>
// //           </View>
// //           <Text style={styles.controlText}>
// //             {isMuted ? 'Unmute' : 'Mute'}
// //           </Text>
// //         </TouchableOpacity>

// //         {/* Speaker Button */}
// //         <TouchableOpacity 
// //           style={styles.controlButton}
// //           onPress={handleToggleSpeaker}
// //         >
// //           <View style={[styles.controlIcon, isSpeakerOn ? styles.speakerIcon : styles.controlIconDisabled]}>
// //             <Text style={styles.controlIconText}>
// //               {isSpeakerOn ? '🔊' : '🔈'}
// //             </Text>
// //           </View>
// //           <Text style={styles.controlText}>
// //             {isSpeakerOn ? 'Speaker' : 'Earpiece'}
// //           </Text>
// //         </TouchableOpacity>

// //         {/* Video Toggle Button */}
// //         {callType === 'video' && (
// //           <TouchableOpacity 
// //             style={styles.controlButton}
// //             onPress={handleToggleVideo}
// //           >
// //             <View style={[styles.controlIcon, isVideoEnabled ? styles.videoIcon : styles.controlIconDisabled]}>
// //               <Text style={styles.controlIconText}>
// //                 {isVideoEnabled ? '📹' : '📹❌'}
// //               </Text>
// //             </View>
// //             <Text style={styles.controlText}>
// //               {isVideoEnabled ? 'Video On' : 'Video Off'}
// //             </Text>
// //           </TouchableOpacity>
// //         )}

// //         {/* Switch Camera Button */}
// //         {callType === 'video' && isVideoEnabled && (
// //           <TouchableOpacity 
// //             style={styles.controlButton}
// //             onPress={handleSwitchCamera}
// //           >
// //             <View style={[styles.controlIcon, styles.switchCameraIcon]}>
// //               <Text style={styles.controlIconText}>🔄</Text>
// //             </View>
// //             <Text style={styles.controlText}>
// //               {isFrontCamera ? 'Front' : 'Back'}
// //             </Text>
// //           </TouchableOpacity>
// //         )}

// //         {/* End Call Button */}
// //         <TouchableOpacity 
// //           style={[styles.controlButton, styles.endCallButton]}
// //           onPress={() => handleEndCall('ended_manually')}
// //         >
// //           <View style={[styles.controlIcon, styles.endCallIcon]}>
// //             <Text style={styles.controlIconText}>📞</Text>
// //           </View>
// //           <Text style={[styles.controlText, styles.endCallText]}>End</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar backgroundColor="black" barStyle="light-content" />
      
// //       {/* Main Content */}
// //       <View style={styles.content}>
// //         {/* Remote Video/ Audio Call Interface */}
// //         {callType === 'video' ? (
// //           <View style={styles.videoContainer}>
// //             {renderRemoteVideo()}
// //             {renderLocalVideo()}
// //           </View>
// //         ) : (
// //           // Audio Call Interface
// //           <View style={styles.audioContainer}>
// //             {renderParticipantInfo()}
// //             <View style={styles.waveformContainer}>
// //               {/* Audio waveform visualization would go here */}
// //               <Text style={styles.waveformText}>🎵 Audio Call Active 🎵</Text>
// //             </View>
// //           </View>
// //         )}
// //       </View>

// //       {/* Call Controls */}
// //       {renderCallControls()}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: 'black',
// //   },
// //   content: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //   },
// //   remoteVideoContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#1a1a1a',
// //   },
// //   localVideoContainer: {
// //     position: 'absolute',
// //     top: 60,
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     backgroundColor: '#2a2a2a',
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: 'rgba(255,255,255,0.3)',
// //     overflow: 'hidden',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   audioContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   participantInfo: {
// //     alignItems: 'center',
// //     marginBottom: 40,
// //   },
// //   participantAvatar: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     marginBottom: 20,
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.3)',
// //   },
// //   participantName: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: 'white',
// //     marginBottom: 10,
// //     textAlign: 'center',
// //   },
// //   callStatus: {
// //     fontSize: 24,
// //     color: '#4cd964',
// //     fontFamily: 'monospace',
// //     marginBottom: 5,
// //   },
// //   callType: {
// //     fontSize: 16,
// //     color: 'rgba(255,255,255,0.7)',
// //   },
// //   waveformContainer: {
// //     marginTop: 40,
// //     alignItems: 'center',
// //   },
// //   waveformText: {
// //     fontSize: 18,
// //     color: 'rgba(255,255,255,0.8)',
// //   },
// //   videoPlaceholder: {
// //     width: '100%',
// //     height: '100%',
// //     backgroundColor: '#333',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   videoPlaceholderLarge: {
// //     width: width * 0.9,
// //     height: height * 0.6,
// //     backgroundColor: '#333',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //   },
// //   videoPlaceholderText: {
// //     color: 'white',
// //     fontSize: 16,
// //   },
// //   videoDisabledAvatar: {
// //     position: 'absolute',
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //   },
// //   remoteAvatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //   },
// //   localVideoLabel: {
// //     position: 'absolute',
// //     top: 5,
// //     left: 5,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     color: 'white',
// //     padding: 2,
// //     borderRadius: 3,
// //     fontSize: 10,
// //   },
// //   controlsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //     paddingVertical: 20,
// //     paddingHorizontal: 10,
// //     backgroundColor: 'rgba(0,0,0,0.8)',
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     minWidth: 60,
// //   },
// //   controlIcon: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   controlIconText: {
// //     fontSize: 24,
// //   },
// //   controlText: {
// //     color: 'white',
// //     fontSize: 12,
// //     textAlign: 'center',
// //   },
// //   minimizeIcon: {
// //     backgroundColor: '#666',
// //   },
// //   audioIcon: {
// //     backgroundColor: '#007AFF',
// //   },
// //   speakerIcon: {
// //     backgroundColor: '#34C759',
// //   },
// //   videoIcon: {
// //     backgroundColor: '#FF9500',
// //   },
// //   switchCameraIcon: {
// //     backgroundColor: '#8E8E93',
// //   },
// //   endCallButton: {
// //     marginLeft: 'auto',
// //   },
// //   endCallIcon: {
// //     backgroundColor: '#FF3B30',
// //   },
// //   endCallText: {
// //     color: '#FF3B30',
// //     fontWeight: 'bold',
// //   },
// //   controlIconDisabled: {
// //     backgroundColor: '#666',
// //     opacity: 0.6,
// //   },
// // });

// // export default CallScreen;






// // // screens/call/CallScreen.js
// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// //   Image,
// //   StatusBar,
// //   Dimensions,
// // } from "react-native";
// // import Sound from "react-native-sound"; // 🔔 Ringtone
// // import { RTCView } from "react-native-webrtc";
// // import { useSelector, useDispatch } from "react-redux";
// // import {
// //   endCall,
// //   updateCallDuration,
// //   setRemoteStreamId,
// //   setLocalStreamId,
// //   setCallStatus,
// // } from "../../features/calls/callSlice";
// // import { emitCallEnd, emitIceCandidate, getSocket } from "../../lib/socket";
// // import WebRTCService from "../../lib/WebRTCService";

// // const { width, height } = Dimensions.get("window");

// // const CallScreen = ({ navigation, route }) => {
// //   const dispatch = useDispatch();
// //   const {
// //     callType,
// //     caller,
// //     callee,
// //     callDuration,
// //     callStatus,
// //     localStreamId,
// //     remoteStreamId,
// //     callId,
// //   } = useSelector((state) => state.call);

// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isVideoOn, setIsVideoOn] = useState(callType === "video");
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);

// //   const webrtcServiceRef = useRef(null);
// //   const timerRef = useRef(null);
// //   const ringtoneRef = useRef(null);

// //   // 🔔 Play ringtone
// //   const playRingtone = () => {
// //     if (ringtoneRef.current) return;
// //     const ringtone = new Sound("ringtone.mp3", Sound.MAIN_BUNDLE, (err) => {
// //       if (err) console.log("Failed to load ringtone", err);
// //       else ringtone.setNumberOfLoops(-1).play();
// //     });
// //     ringtoneRef.current = ringtone;
// //   };

// //   const stopRingtone = () => {
// //     ringtoneRef.current?.stop();
// //     ringtoneRef.current = null;
// //   };

// //   // ✅ Setup WebRTC service
// //   useEffect(() => {
// //     webrtcServiceRef.current = new WebRTCService({
// //       onLocalStream: (stream) => {
// //         console.log("Local stream received in CallScreen");
// //         dispatch(setLocalStreamId(stream.id));
// //       },
// //       onRemoteStream: (stream) => {
// //         console.log("Remote stream received in CallScreen");
// //         dispatch(setRemoteStreamId(stream.id));
// //         stopRingtone(); // stop ringing once remote answers
// //       },
// //       onIceCandidate: (candidate) => {
// //         const socket = getSocket();
// //         if (socket && callId) {
// //           emitIceCandidate({
// //             targetId: route.params?.isIncoming ? caller.id : callee.id,
// //             candidate,
// //             callId,
// //           });
// //         }
// //       },
// //       onConnectionStateChange: (state) => {
// //         console.log("Connection state:", state);
// //         if (state === "disconnected" || state === "failed") {
// //           handleEndCall("connection_lost");
// //         }
// //       },
// //     });

// //     // Auto-play ringtone for outgoing call
// //     if (!route.params?.isIncoming) playRingtone();

// //     // Start call duration timer
// //     const startTime = Date.now();
// //     timerRef.current = setInterval(() => {
// //       const duration = Math.floor((Date.now() - startTime) / 1000);
// //       dispatch(updateCallDuration(duration));
// //     }, 1000);

// //     return () => {
// //       clearInterval(timerRef.current);
// //       webrtcServiceRef.current?.cleanup();
// //       stopRingtone();
// //     };
// //   }, []);

// //   // ✅ Socket listeners
// //   useEffect(() => {
// //     const socket = getSocket();
// //     if (!socket) return;

// //     const handleCallEnded = (data) => {
// //       console.log("Call ended by remote:", data);
// //       handleEndCall("ended_by_remote");
// //     };

// //     const handleIceCandidate = (data) => {
// //       if (webrtcServiceRef.current && data.candidate) {
// //         webrtcServiceRef.current.addIceCandidate(data.candidate);
// //       }
// //     };

// //     const handleAnswer = (data) => {
// //       console.log("Remote answered call:", data);
// //       stopRingtone(); // stop ringing when call is answered
// //     };

// //     socket.on("call:ended", handleCallEnded);
// //     socket.on("ice-candidate", handleIceCandidate);
// //     socket.on("call:answered", handleAnswer);

// //     return () => {
// //       socket.off("call:ended", handleCallEnded);
// //       socket.off("ice-candidate", handleIceCandidate);
// //       socket.off("call:answered", handleAnswer);
// //     };
// //   }, []);

// //   const formatDuration = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const handleEndCall = (reason = "ended_manually") => {
// //     console.log("Ending call:", reason);
// //     if (callId) emitCallEnd({ callId, reason });

// //     dispatch(endCall());
// //     dispatch(setCallStatus("ended"));
// //     webrtcServiceRef.current?.cleanup();
// //     stopRingtone();
// //     navigation.goBack();
// //   };

// //   const handleToggleAudio = () => {
// //     const enabled = webrtcServiceRef.current?.toggleAudio();
// //     setIsMuted(!enabled);
// //   };

// //   const handleToggleVideo = () => {
// //     const enabled = webrtcServiceRef.current?.toggleVideo();
// //     setIsVideoOn(enabled);
// //   };

// //   const handleSwitchCamera = () => {
// //     webrtcServiceRef.current?.switchCamera().then((ok) => {
// //       if (ok) setIsFrontCamera(!isFrontCamera);
// //     });
// //   };

// //   // UI renderers
// //   const renderRemoteVideo = () => {
// //     if (callType !== "video") return null;
// //     const stream = webrtcServiceRef.current?.getRemoteStream();
// //     return (
// //       <View style={styles.remoteVideoContainer}>
// //         {stream ? (
// //           <RTCView streamURL={stream.toURL()} style={styles.remoteVideo} objectFit="cover" />
// //         ) : (
// //           <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>Waiting for remote video...</Text>
// //         )}
// //       </View>
// //     );
// //   };

// //   const renderLocalVideo = () => {
// //     if (callType !== "video") return null;
// //     const stream = webrtcServiceRef.current?.getLocalStream();
// //     return (
// //       <View style={styles.localVideoContainer}>
// //         {stream ? (
// //           <RTCView streamURL={stream.toURL()} style={styles.localVideo} objectFit="cover" />
// //         ) : (
// //           <Text style={{ color: "white" }}>No local video</Text>
// //         )}
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar backgroundColor="black" barStyle="light-content" />

// //       {callType === "video" ? (
// //         <>
// //           {renderRemoteVideo()}
// //           {renderLocalVideo()}
// //         </>
// //       ) : (
// //         <View style={styles.audioContainer}>
// //           <Image
// //             source={{
// //               uri: (route.params?.isIncoming ? caller?.avatar : callee?.avatar) || "https://via.placeholder.com/150",
// //             }}
// //             style={styles.avatar}
// //           />
// //           <Text style={styles.name}>{route.params?.isIncoming ? caller?.name : callee?.name}</Text>
// //           <Text style={styles.status}>
// //             {callStatus === "accepted" ? formatDuration(callDuration) : "Connecting..."}
// //           </Text>
// //         </View>
// //       )}

// //       {/* Controls */}
// //       <View style={styles.controls}>
// //         <TouchableOpacity onPress={handleToggleAudio} style={styles.button}>
// //           <Text style={styles.icon}>{isMuted ? "🎤❌" : "🎤"}</Text>
// //         </TouchableOpacity>
// //         {callType === "video" && (
// //           <>
// //             <TouchableOpacity onPress={handleToggleVideo} style={styles.button}>
// //               <Text style={styles.icon}>{isVideoOn ? "📹" : "📹❌"}</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity onPress={handleSwitchCamera} style={styles.button}>
// //               <Text style={styles.icon}>🔄</Text>
// //             </TouchableOpacity>
// //           </>
// //         )}
// //         <TouchableOpacity onPress={() => handleEndCall("ended_manually")} style={[styles.button, styles.endButton]}>
// //           <Text style={styles.icon}>📞❌</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "black" },
// //   remoteVideoContainer: { flex: 1 },
// //   remoteVideo: { flex: 1 },
// //   localVideoContainer: {
// //     position: "absolute",
// //     top: 40,
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     borderRadius: 10,
// //     overflow: "hidden",
// //     backgroundColor: "#333",
// //   },
// //   localVideo: { width: "100%", height: "100%" },
// //   audioContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
// //   name: { color: "white", fontSize: 22, marginBottom: 5 },
// //   status: { color: "#4cd964", fontSize: 16 },
// //   controls: {
// //     flexDirection: "row",
// //     justifyContent: "space-around",
// //     padding: 20,
// //     backgroundColor: "rgba(0,0,0,0.6)",
// //   },
// //   button: {
// //     backgroundColor: "#444",
// //     borderRadius: 40,
// //     width: 70,
// //     height: 70,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   endButton: { backgroundColor: "#d9534f" },
// //   icon: { fontSize: 28, color: "white" },
// // });

// // export default CallScreen;






// import React, { useEffect, useRef, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Dimensions } from "react-native";
// import { RTCView } from "react-native-webrtc";
// import { useDispatch, useSelector } from "react-redux";
// import WebRTCService from "../../lib/WebRTCService";
// import { setLocalStreamId, setRemoteStreamId, updateCallDuration, endCall } from "../../features/calls/callSlice";
// import { getSocket, emitIceCandidate, emitCallEnd } from "../../lib/socket";

// const { width, height } = Dimensions.get("window");

// const VideoScreen = ({ navigation, route }) => {
//   const dispatch = useDispatch();
//   const { callType, callId, caller, callee, callDuration, callStatus } = useSelector(s => s.call);

//   const webrtcRef = useRef(null);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     webrtcRef.current = new WebRTCService({
//       onLocalStream: stream => dispatch(setLocalStreamId(stream.id)),
//       onRemoteStream: stream => dispatch(setRemoteStreamId(stream.id)),
//       onIceCandidate: candidate => emitIceCandidate({
//         callId,
//         targetId: route.params?.isIncoming ? caller.id : callee.id,
//         candidate,
//       }),
//     });

//     // Start local camera/audio immediately
//     webrtcRef.current.getUserMedia({ audio: true, video: true }).catch(console.warn);

//     timerRef.current = setInterval(() => {
//       dispatch(updateCallDuration(prev => prev + 1));
//     }, 1000);

//     return () => {
//       clearInterval(timerRef.current);
//       webrtcRef.current?.cleanup();
//     };
//   }, []);

//   const handleEndCall = () => {
//     if (callId) emitCallEnd({ callId, reason: "ended_manually" });
//     dispatch(endCall());
//     webrtcRef.current?.cleanup();
//     navigation.goBack();
//   };

//   const localStream = webrtcRef.current?.getLocalStream();
//   const remoteStream = webrtcRef.current?.getRemoteStream();

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
//       <StatusBar backgroundColor="black" barStyle="light-content" />

//       {/* Remote video */}
//       <View style={{ flex: 1 }}>
//         {remoteStream ? <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} objectFit="cover" /> : <Text style={{color:'white',textAlign:'center',marginTop:20}}>Waiting for remote...</Text>}
//       </View>

//       {/* Local video overlay */}
//       {localStream && (
//         <View style={{ position: "absolute", top: 40, right: 20, width: 120, height: 160, borderRadius: 10, overflow: "hidden" }}>
//           <RTCView streamURL={localStream.toURL()} style={{ width: "100%", height: "100%" }} objectFit="cover" />
//         </View>
//       )}

//       {/* End call button */}
//       <View style={{ position: "absolute", bottom: 40, width, flexDirection: "row", justifyContent: "center" }}>
//         <TouchableOpacity onPress={handleEndCall} style={{ backgroundColor: "red", padding: 20, borderRadius: 50 }}>
//           <Text style={{ color: "white", fontSize: 18 }}>End Call</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default VideoScreen;
