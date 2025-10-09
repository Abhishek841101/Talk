// // // screens/calls/VoiceCallScreen.js
// // import React, { useState, useRef, useEffect } from 'react';
// // import { 
// //   View, Text, TouchableOpacity, StyleSheet, PanResponder, Animated,
// //   BackHandler, Alert, Vibration
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { 
// //   endCall, updateCallDuration, setLocalStreamId, setRemoteStreamId 
// // } from '../../features/calls/callSlice';
// // import SocketService from '../../lib/socket';
// // import AudioService from '../../lib/AudioService';
// // import WebRTCService from '../../lib/WebRTCService';

// // export default function VoiceCallScreen({ route, navigation }) {
// //   const dispatch = useDispatch();
// //   const callState = useSelector(state => state.call);

// //   const caller = callState.caller || route?.params?.caller;
// //   const callee = callState.callee || route?.params?.callee;
// //   const callType = callState.callType || route?.params?.callType || 'voice';
// //   const isIncoming = callState.isIncoming ?? route?.params?.isIncoming ?? false;
// //   const callStatus = callState.callStatus || 'idle';

// //   const [minimized, setMinimized] = useState(false);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
// //   const [callTime, setCallTime] = useState(0);
// //   const [callConnected, setCallConnected] = useState(false);

// //   const pan = useRef(new Animated.ValueXY()).current;
// //   const callTimerRef = useRef(null);
// //   const localStreamRef = useRef(null);
// //   const remoteStreamRef = useRef(null);
// //   const webRTCServiceRef = useRef(null);
// //   const callIdRef = useRef(route?.params?.callId || `call-${Date.now()}`);

// //   // ===== INITIALIZE CALL =====
// //   useEffect(() => {
// //     console.log('[VoiceCallScreen] Mounting call screen...');
// //     if (!caller || !callee) {
// //       Alert.alert('Call Failed', 'User info missing');
// //       navigation.goBack();
// //       return;
// //     }

// //     initializeCall();

// //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
// //       if (!minimized) { minimizeCall(); return true; }
// //       return false;
// //     });

// //     return () => {
// //       console.log('[VoiceCallScreen] Unmounting call screen...');
// //       backHandler.remove();
// //       cleanupCall();
// //     };
// //   }, []);

// //   // ===== START CALL TIMER WHEN CONNECTED =====
// //   useEffect(() => {
// //     if (callConnected && !callTimerRef.current) startCallTimer();
// //     return () => { 
// //       if (callTimerRef.current) {
// //         console.log('[VoiceCallScreen] Clearing call timer');
// //         clearInterval(callTimerRef.current);
// //         callTimerRef.current = null;
// //       }
// //     };
// //   }, [callConnected]);

// //   // ===== SOCKET LISTENERS =====
// //   useEffect(() => {
// //     console.log('[VoiceCallScreen] Setting up socket listeners...');
// //     const handleAnswer = async (answer) => {
// //       console.log('📩 Answer received');
// //       if (webRTCServiceRef.current) await webRTCServiceRef.current.handleAnswer(answer);
// //       setCallConnected(true);
// //     };
// //     const handleCandidate = async (candidate) => {
// //       console.log('📩 ICE Candidate received');
// //       if (webRTCServiceRef.current) await webRTCServiceRef.current.addIceCandidate(candidate);
// //     };
// //     const handleCallEnd = (data) => {
// //       console.log('📩 Call ended by other user:', data);
// //       endCallHandler();
// //     };

// //     // Use safe .on / .off pattern
// //     SocketService?.on?.('call:answer', handleAnswer);
// //     SocketService?.on?.('call:ice', handleCandidate);
// //     SocketService?.on?.('call:end', handleCallEnd);

// //     return () => {
// //       console.log('[VoiceCallScreen] Removing socket listeners...');
// //       SocketService?.off?.('call:answer', handleAnswer);
// //       SocketService?.off?.('call:ice', handleCandidate);
// //       SocketService?.off?.('call:end', handleCallEnd);
// //     };
// //   }, []);

// //   // ===== INITIALIZE AUDIO & WEBRTC =====
// //   const initializeCall = async () => {
// //     try {
// //       console.log('[VoiceCallScreen] Initializing AudioService...');
// //       await AudioService?.setAudioModeAsync?.({
// //         allowsRecordingIOS: true,
// //         playsInSilentModeIOS: true,
// //         staysActiveInBackground: true,
// //         shouldDuckAndroid: true,
// //         playThroughEarpieceAndroid: true,
// //       });

// //       await setupWebRTC();

// //       // Incoming auto-answer → send SDP answer back
// //       if (isIncoming) {
// //         console.log('☎️ Incoming call, sending auto-answer...');
// //         SocketService?.emitCallAnswer?.({ callId: callIdRef.current });
// //       }
// //     } catch (err) {
// //       console.error('❌ Call init error:', err);
// //       Alert.alert('Call Failed', 'Unable to establish connection');
// //       endCallHandler();
// //     }
// //   };

// //   const setupWebRTC = async () => {
// //     console.log('[VoiceCallScreen] Setting up WebRTCService...');
// //     webRTCServiceRef.current = new WebRTCService({
// //       onLocalStream: stream => {
// //         console.log('🎙 Local stream ready:', stream?.id);
// //         localStreamRef.current = stream;
// //         dispatch(setLocalStreamId(stream?.id));
// //       },
// //       onRemoteStream: stream => {
// //         console.log('🔊 Remote stream ready:', stream?.id);
// //         remoteStreamRef.current = stream;
// //         dispatch(setRemoteStreamId(stream?.id));
// //         setCallConnected(true);
// //       },
// //       onIceCandidate: candidate => {
// //         console.log('[WebRTCService] ICE candidate generated', candidate);
// //         const toId = isIncoming ? caller?.id : callee?.id;
// //         if (toId && callIdRef.current) {
// //           SocketService?.emitIceCandidate?.({ targetId: toId, candidate, callId: callIdRef.current });
// //         }
// //       }
// //     });

// //     await webRTCServiceRef.current?.getUserMedia({ audio: true, video: false });
// //     webRTCServiceRef.current?.initializePeerConnection();

// //     // Outgoing → create offer
// //     if (!isIncoming && callee?.id) {
// //       const offer = await webRTCServiceRef.current?.createOffer();
// //       console.log('[VoiceCallScreen] Sending call offer...');
// //       SocketService?.emitCallOffer?.({ calleeId: callee.id, offer, callType, callId: callIdRef.current });
// //     }
// //   };

// //   // ===== CALL TIMER =====
// //   const startCallTimer = () => {
// //     console.log('[VoiceCallScreen] Starting call timer...');
// //     callTimerRef.current = setInterval(() => {
// //       setCallTime(prev => {
// //         const newTime = prev + 1;
// //         dispatch(updateCallDuration(newTime));
// //         return newTime;
// //       });
// //     }, 1000);
// //   };

// //   const formatCallTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
// //   };

// //   // ===== MINIMIZE / MAXIMIZE =====
// //   const minimizeCall = () => { setMinimized(true); Vibration.vibrate(50); };
// //   const maximizeCall = () => { setMinimized(false); Vibration.vibrate(50); };

// //   // ===== MUTE / SPEAKER =====
// //   const toggleMute = () => {
// //     const newMute = !isMuted;
// //     setIsMuted(newMute);
// //     if (localStreamRef.current) {
// //       localStreamRef.current.getAudioTracks()?.forEach(track => track.enabled = !newMute);
// //     }
// //     Vibration.vibrate(50);
// //   };

// //   const toggleSpeaker = async () => {
// //     const newSpeaker = !isSpeakerOn;
// //     setIsSpeakerOn(newSpeaker);
// //     if (AudioService?.setSpeakerphone) {
// //       try { await AudioService.setSpeakerphone(newSpeaker); } catch (err) { console.log('[AudioService] Speaker toggle error', err); }
// //     }
// //     Vibration.vibrate(50);
// //   };

// //   // ===== END CALL =====
// //   const endCallHandler = () => {
// //     console.log('[VoiceCallScreen] Ending call...');
// //     if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }

// //     try {
// //       if (callIdRef.current) SocketService?.emitCallEnd?.({ callId: callIdRef.current, reason: 'ended' });
// //     } catch (err) { console.log('[SocketService] emitCallEnd error', err); }

// //     dispatch(endCall({ duration: callTime }));
// //     cleanupCall();
// //     navigation.goBack();
// //   };

// //   const cleanupCall = () => {
// //     console.log('[VoiceCallScreen] Cleaning up call...');
// //     try {
// //       localStreamRef.current?.getTracks()?.forEach(t => t.stop());
// //       remoteStreamRef.current?.getTracks()?.forEach(t => t.stop());
// //       localStreamRef.current = null;
// //       remoteStreamRef.current = null;

// //       webRTCServiceRef.current?.cleanup?.();
// //       webRTCServiceRef.current = null;

// //       if (AudioService?.cleanup) {
// //         try { AudioService.cleanup(); } catch(err) { console.log('[AudioService] cleanup error', err); }
// //       }
// //     } catch(err) {
// //       console.log('[VoiceCallScreen] cleanup error', err);
// //     }
// //   };

// //   // ===== PAN RESPONDER =====
// //   const panResponder = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => true,
// //       onMoveShouldSetPanResponder: () => true,
// //       onPanResponderGrant: () => { pan.extractOffset(); },
// //       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// //       onPanResponderRelease: () => pan.flattenOffset(),
// //       onPanResponderTerminate: () => pan.flattenOffset()
// //     })
// //   ).current;

// //   // ===== RENDER MINIMIZED CALL =====
// //   if (minimized) {
// //     return (
// //       <Animated.View style={[styles.minimizedContainer, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]} {...panResponder.panHandlers}>
// //         <TouchableOpacity style={styles.minimizedContent} onPress={maximizeCall} activeOpacity={0.8}>
// //           <View style={styles.minimizedInfo}>
// //             <Ionicons name={callConnected ? "call" : "call-outline"} size={20} color="#fff" />
// //             <Text style={styles.minimizedName}>{isIncoming ? caller?.name : callee?.name}</Text>
// //             <Text style={styles.minimizedTime}>{formatCallTime(callTime)}</Text>
// //           </View>
// //           <View style={styles.minimizedControls}>
// //             <TouchableOpacity style={styles.miniButton} onPress={toggleMute}>
// //               <Ionicons name={isMuted ? "mic-off" : "mic"} size={16} color="#fff" />
// //             </TouchableOpacity>
// //             <TouchableOpacity style={[styles.miniButton, styles.endButton]} onPress={endCallHandler}>
// //               <Ionicons name="call" size={16} color="#fff" />
// //             </TouchableOpacity>
// //           </View>
// //         </TouchableOpacity>
// //       </Animated.View>
// //     );
// //   }

// //   // ===== RENDER FULL CALL SCREEN =====
// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <Text style={styles.name}>{isIncoming ? caller?.name : callee?.name}</Text>
// //         <Text style={styles.status}>{callConnected ? formatCallTime(callTime) : 'Connecting...'}</Text>
// //         <Text style={styles.callType}>{callType === 'video' ? 'Video Call' : 'Voice Call'}</Text>
// //       </View>

// //       <View style={styles.controlsContainer}>
// //         <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //           <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
// //           <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
// //           <Ionicons name={isSpeakerOn ? "volume-high" : "volume-medium"} size={28} color="#fff" />
// //           <Text style={styles.controlText}>{isSpeakerOn ? 'Speaker' : 'Earpiece'}</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.controlButton} onPress={minimizeCall}>
// //           <Ionicons name="remove-outline" size={28} color="#fff" />
// //           <Text style={styles.controlText}>Minimize</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <TouchableOpacity style={styles.endCallButton} onPress={endCallHandler}>
// //         <Ionicons name="call" size={32} color="#fff" />
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // // ===== STYLES =====
// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
// //   header: { alignItems: 'center', marginBottom: 50 },
// //   name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
// //   status: { fontSize: 18, color: '#ccc', marginTop: 4 },
// //   callType: { fontSize: 16, color: '#888', marginTop: 2 },
// //   controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 50 },
// //   controlButton: { alignItems: 'center' },
// //   controlText: { color: '#fff', marginTop: 6 },
// //   endCallButton: { backgroundColor: 'red', padding: 20, borderRadius: 50 },
// //   minimizedContainer: { position: 'absolute', bottom: 50, right: 20, zIndex: 10 },
// //   minimizedContent: { flexDirection: 'row', backgroundColor: '#333', borderRadius: 20, padding: 10, alignItems: 'center' },
// //   minimizedInfo: { flexDirection: 'column', marginRight: 10 },
// //   minimizedName: { color: '#fff', fontWeight: 'bold' },
// //   minimizedTime: { color: '#ccc', fontSize: 12 },
// //   minimizedControls: { flexDirection: 'row' },
// //   miniButton: { marginHorizontal: 5, padding: 6, backgroundColor: '#555', borderRadius: 20 },
// //   endButton: { backgroundColor: 'red' },
// // });





// // screens/calls/VoiceCallScreen.js
// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   View, Text, TouchableOpacity, StyleSheet, PanResponder, Animated,
//   BackHandler, Alert, Vibration, Platform
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   endCall, updateCallDuration, setLocalStreamId, setRemoteStreamId 
// } from '../../features/calls/callSlice';
// import SocketService from '../../lib/socket';
// import AudioService from '../../lib/AudioService';
// import WebRTCService from '../../lib/WebRTCService';
// import InCallManager from 'react-native-incall-manager';
// import { RTCView } from 'react-native-webrtc';

// export default function VoiceCallScreen({ route, navigation }) {
//   console.log('[VoiceCallScreen] mounted with route params:', route?.params);

//   const dispatch = useDispatch();
//   const callState = useSelector(state => state.call);

//   const caller = callState.caller || route?.params?.caller;
//   const callee = callState.callee || route?.params?.callee;
//   const callType = callState.callType || route?.params?.callType || 'voice';
//   const isIncoming = callState.isIncoming ?? route?.params?.isIncoming ?? false;
//   const callStatus = callState.callStatus || 'idle';

//   const [minimized, setMinimized] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
//   const [callTime, setCallTime] = useState(0);
//   const [callConnected, setCallConnected] = useState(false);

//   const pan = useRef(new Animated.ValueXY()).current;
//   const callTimerRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const webRTCServiceRef = useRef(null);
//   const callIdRef = useRef(route?.params?.callId || `call-${Date.now()}`);

//   // ===== INITIALIZE CALL =====
//   useEffect(() => {
//     console.log('[VoiceCallScreen] useEffect init, caller:', caller, 'callee:', callee);

//     if (!caller || !callee) {
//       console.warn('[VoiceCallScreen] Missing caller/callee -> Call Failed');
//       Alert.alert('Call Failed', 'User info missing');
//       navigation.goBack();
//       return;
//     }
//     initializeCall();

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       console.log('[VoiceCallScreen] back button pressed, minimized:', minimized);
//       if (!minimized) { minimizeCall(); return true; }
//       return false;
//     });

//     return () => {
//       console.log('[VoiceCallScreen] cleanup useEffect');
//       backHandler.remove();
//       cleanupCall();
//     };
//   }, []);

//   // ===== CALL TIMER =====
//   useEffect(() => {
//     console.log('[VoiceCallScreen] callConnected changed:', callConnected);
//     if (callConnected && !callTimerRef.current) startCallTimer();
//     return () => {
//       if (callTimerRef.current) {
//         console.log('[VoiceCallScreen] clearing call timer');
//         clearInterval(callTimerRef.current);
//       }
//       callTimerRef.current = null;
//     };
//   }, [callConnected]);

//   // ===== SOCKET LISTENERS =====
//   useEffect(() => {
//     console.log('[VoiceCallScreen] setting socket listeners');

//     const handleAnswer = async (answer) => {
//       console.log('[VoiceCallScreen] received call:answer', answer);
//       if (webRTCServiceRef.current) await webRTCServiceRef.current.handleAnswer(answer);
//       setCallConnected(true);
//     };
//     const handleCandidate = async (candidate) => {
//       console.log('[VoiceCallScreen] received call:ice', candidate);
//       if (webRTCServiceRef.current) await webRTCServiceRef.current.addIceCandidate(candidate);
//     };
//     const handleCallEnd = () => {
//       console.log('[VoiceCallScreen] received call:end');
//       endCallHandler();
//     };

//     SocketService?.on?.('call:answer', handleAnswer);
//     SocketService?.on?.('call:ice', handleCandidate);
//     SocketService?.on?.('call:end', handleCallEnd);

//     return () => {
//       console.log('[VoiceCallScreen] removing socket listeners');
//       SocketService?.off?.('call:answer', handleAnswer);
//       SocketService?.off?.('call:ice', handleCandidate);
//       SocketService?.off?.('call:end', handleCallEnd);
//     };
//   }, []);

//   // ===== INITIALIZE AUDIO & WEBRTC =====
//   const initializeCall = async () => {
//     console.log('[VoiceCallScreen] initializeCall');
//     try {
//       await AudioService?.setAudioModeAsync?.({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//         staysActiveInBackground: true,
//         shouldDuckAndroid: true,
//         playThroughEarpieceAndroid: true,
//       });

//       console.log('[VoiceCallScreen] AudioService setAudioModeAsync done');

//       if (Platform.OS === 'android' || Platform.OS === 'ios') {
//         InCallManager.start({ media: 'audio' });
//         InCallManager.setForceSpeakerphoneOn(isSpeakerOn);
//         console.log('[VoiceCallScreen] InCallManager started, speaker:', isSpeakerOn);
//       }

//       await setupWebRTC();

//       if (isIncoming) {
//         console.log('[VoiceCallScreen] incoming call, sending answer event via socket');
//         SocketService?.emitCallAnswer?.({ callId: callIdRef.current });
//       }
//     } catch (err) {
//       console.error('[VoiceCallScreen] initializeCall failed', err);
//       Alert.alert('Call Failed', 'Unable to establish connection');
//       endCallHandler();
//     }
//   };

//   const setupWebRTC = async () => {
//     console.log('[VoiceCallScreen] setupWebRTC');
//     webRTCServiceRef.current = new WebRTCService({
//       onLocalStream: stream => {
//         console.log('[VoiceCallScreen] got localStream', stream?.id);
//         localStreamRef.current = stream;
//         dispatch(setLocalStreamId(stream?.id));
//       },
//       onRemoteStream: stream => {
//         console.log('[VoiceCallScreen] got remoteStream', stream?.id);
//         remoteStreamRef.current = stream;
//         dispatch(setRemoteStreamId(stream?.id));
//         setCallConnected(true);
//       },
//       onIceCandidate: candidate => {
//         console.log('[VoiceCallScreen] new ICE candidate', candidate);
//         const toId = isIncoming ? caller?.id : callee?.id;
//         if (toId && callIdRef.current) {
//           SocketService?.emitIceCandidate?.({ targetId: toId, candidate, callId: callIdRef.current });
//         }
//       }
//     });

//     await webRTCServiceRef.current?.getUserMedia({ audio: true, video: false });
//     webRTCServiceRef.current?.initializePeerConnection();

//     if (!isIncoming && callee?.id) {
//       console.log('[VoiceCallScreen] outgoing call, creating offer');
//       const offer = await webRTCServiceRef.current?.createOffer();
//       SocketService?.emitCallOffer?.({ calleeId: callee.id, offer, callType, callId: callIdRef.current });
//     }
//   };

//   // ===== CALL TIMER =====
//   const startCallTimer = () => {
//     console.log('[VoiceCallScreen] starting call timer');
//     callTimerRef.current = setInterval(() => {
//       setCallTime(prev => {
//         const newTime = prev + 1;
//         console.log('[VoiceCallScreen] call duration', newTime);
//         dispatch(updateCallDuration(newTime));
//         return newTime;
//       });
//     }, 1000);
//   };
//   const formatCallTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
//   };

//   // ===== MINIMIZE / MAXIMIZE =====
//   const minimizeCall = () => { console.log('[VoiceCallScreen] minimizeCall'); setMinimized(true); Vibration.vibrate(50); };
//   const maximizeCall = () => { console.log('[VoiceCallScreen] maximizeCall'); setMinimized(false); Vibration.vibrate(50); };

//   // ===== MUTE / SPEAKER =====
//   const toggleMute = () => {
//     const newMute = !isMuted;
//     console.log('[VoiceCallScreen] toggleMute ->', newMute);
//     setIsMuted(newMute);
//     localStreamRef.current?.getAudioTracks()?.forEach(track => {
//       track.enabled = !newMute;
//       console.log('[VoiceCallScreen] audio track enabled:', track.enabled);
//     });
//     Vibration.vibrate(50);
//   };

//   const toggleSpeaker = async () => {
//     const newSpeaker = !isSpeakerOn;
//     console.log('[VoiceCallScreen] toggleSpeaker ->', newSpeaker);
//     setIsSpeakerOn(newSpeaker);
//     try { InCallManager.setForceSpeakerphoneOn(newSpeaker); } catch(err) { console.error('[VoiceCallScreen] toggleSpeaker error', err); }
//     Vibration.vibrate(50);
//   };

//   // ===== END CALL =====
//   const endCallHandler = () => {
//     console.log('[VoiceCallScreen] endCallHandler');
//     if (callTimerRef.current) clearInterval(callTimerRef.current);
//     try { 
//       SocketService?.emitCallEnd?.({ callId: callIdRef.current, reason: 'ended' }); 
//       console.log('[VoiceCallScreen] emitCallEnd sent');
//     } catch(err) { console.error('[VoiceCallScreen] emitCallEnd failed', err); }
//     dispatch(endCall({ duration: callTime }));
//     cleanupCall();
//     navigation.goBack();
//   };

//   const cleanupCall = () => {
//     console.log('[VoiceCallScreen] cleanupCall');
//     localStreamRef.current?.getTracks()?.forEach(t => { console.log('[VoiceCallScreen] stopping local track', t.kind); t.stop(); });
//     remoteStreamRef.current?.getTracks()?.forEach(t => { console.log('[VoiceCallScreen] stopping remote track', t.kind); t.stop(); });
//     localStreamRef.current = null;
//     remoteStreamRef.current = null;
//     webRTCServiceRef.current?.cleanup?.();
//     webRTCServiceRef.current = null;
//     try { AudioService?.cleanup(); console.log('[VoiceCallScreen] AudioService cleaned'); } catch{}
//     InCallManager.stop();
//     console.log('[VoiceCallScreen] InCallManager stopped');
//   };

//   // ===== PAN RESPONDER =====
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => { console.log('[VoiceCallScreen] panResponder grant'); pan.extractOffset(); },
//       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
//       onPanResponderRelease: () => { console.log('[VoiceCallScreen] panResponder release'); pan.flattenOffset(); },
//       onPanResponderTerminate: () => { console.log('[VoiceCallScreen] panResponder terminate'); pan.flattenOffset(); }
//     })
//   ).current;

//   // ===== RENDER MINIMIZED CALL =====
//   if (minimized) {
//     console.log('[VoiceCallScreen] rendering minimized UI');
//     return (
//       <Animated.View style={[styles.minimizedContainer, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]} {...panResponder.panHandlers}>
//         <TouchableOpacity style={styles.minimizedContent} onPress={maximizeCall} activeOpacity={0.8}>
//           <View style={styles.minimizedInfo}>
//             <Ionicons name={callConnected ? "call" : "call-outline"} size={20} color="#fff" />
//             <Text style={styles.minimizedName}>{isIncoming ? caller?.name : callee?.name}</Text>
//             <Text style={styles.minimizedTime}>{formatCallTime(callTime)}</Text>
//           </View>
//           <View style={styles.minimizedControls}>
//             <TouchableOpacity style={styles.miniButton} onPress={toggleMute}>
//               <Ionicons name={isMuted ? "mic-off" : "mic"} size={16} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.miniButton, styles.endButton]} onPress={endCallHandler}>
//               <Ionicons name="call" size={16} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   }

//   // ===== RENDER FULL CALL SCREEN =====
//   console.log('[VoiceCallScreen] rendering full UI, callConnected:', callConnected);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.name}>{isIncoming ? caller?.name : callee?.name}</Text>
//         <Text style={styles.status}>{callConnected ? formatCallTime(callTime) : 'Connecting...'}</Text>
//         <Text style={styles.callType}>{callType === 'video' ? 'Video Call' : 'Voice Call'}</Text>
//       </View>

//       <View style={styles.controlsContainer}>
//         <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
//           <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
//           <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
//           <Ionicons name={isSpeakerOn ? "volume-high" : "volume-medium"} size={28} color="#fff" />
//           <Text style={styles.controlText}>{isSpeakerOn ? 'Speaker' : 'Earpiece'}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.controlButton} onPress={minimizeCall}>
//           <Ionicons name="remove-outline" size={28} color="#fff" />
//           <Text style={styles.controlText}>Minimize</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.endCallButton} onPress={endCallHandler}>
//         <Ionicons name="call" size={32} color="#fff" />
//       </TouchableOpacity>

//       {/* HIDDEN RTCView for remote audio */}
//       {remoteStreamRef.current && (
//         <RTCView
//           streamURL={remoteStreamRef.current.toURL()}
//           style={{ width: 0, height: 0 }}
//           mirror={false}
//         />
//       )}
//     </View>
//   );
// }

// // ===== STYLES =====
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
//   header: { alignItems: 'center', marginBottom: 50 },
//   name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
//   status: { fontSize: 18, color: '#ccc', marginTop: 4 },
//   callType: { fontSize: 16, color: '#888', marginTop: 2 },
//   controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 50 },
//   controlButton: { alignItems: 'center' },
//   controlText: { color: '#fff', marginTop: 6 },
//   endCallButton: { backgroundColor: 'red', padding: 20, borderRadius: 50 },
//   minimizedContainer: { position: 'absolute', bottom: 50, right: 20, zIndex: 10 },
//   minimizedContent: { flexDirection: 'row', backgroundColor: '#333', borderRadius: 20, padding: 10, alignItems: 'center' },
//   minimizedInfo: { flexDirection: 'column', marginRight: 10 },
//   minimizedName: { color: '#fff', fontWeight: 'bold' },
//   minimizedTime: { color: '#ccc', fontSize: 12 },
//   minimizedControls: { flexDirection: 'row' },
//   miniButton: { marginHorizontal: 5, padding: 6, backgroundColor: '#555', borderRadius: 20 },
//   endButton: { backgroundColor: 'red' },
// });
