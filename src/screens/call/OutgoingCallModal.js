// // src/components/OutgoingCallModal.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   Vibration,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSelector, useDispatch } from 'react-redux';
// import { endCall } from '../../features/calls/callSlice';
// import SocketService from '../../lib/socket';
// import audioService from '../../services/audioService'; // ✅ apna audioService import karo

// export default function OutgoingCallModal({ visible, onCancel }) {
//   const dispatch = useDispatch();
//   const { callee, callType, callId } = useSelector((state) => state.call);

//   const [ringingText, setRingingText] = useState('Calling...');
//   const [dots, setDots] = useState(0);

//   // Animate "Calling..."
//   useEffect(() => {
//     let interval = setInterval(() => {
//       setDots((prev) => (prev + 1) % 4);
//     }, 600);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     setRingingText(`Calling${'.'.repeat(dots)}`);
//   }, [dots]);

//   // ✅ Start outgoing ringback when modal visible
//   useEffect(() => {
//     if (visible) {
//       console.log('📞 OutgoingCallModal: starting ringback...');
//       audioService.playRingback();
//     }
//     return () => {
//       console.log('🔕 OutgoingCallModal: stopping ringback (cleanup)...');
//       audioService.stopRingback();
//     };
//   }, [visible]);

//   // ✅ Listen for answer/reject
//   useEffect(() => {
//     const handleAnswered = () => {
//       console.log('✅ Call answered by callee, stopping ringback');
//       audioService.stopRingback();
//       onCancel(); // Close modal and go to Call screen
//     };

//     const handleRejected = () => {
//       console.log('❌ Call rejected, stopping ringback');
//       Vibration.vibrate(200);
//       audioService.stopRingback();
//       onCancel();
//       dispatch(endCall({ reason: 'rejected' }));
//     };

//     SocketService.onCallAnswer(handleAnswered);
//     SocketService.onCallRejected(handleRejected);

//     return () => {
//       SocketService.offCallAnswer(handleAnswered);
//       SocketService.offCallRejected(handleRejected);
//     };
//   }, []);

//   // ✅ Cancel outgoing call
//   const cancelCall = () => {
//     console.log('🚨 Outgoing call canceled by user, stopping ringback');
//     audioService.stopRingback();

//     if (callId) {
//       SocketService.emitCallEnd({ callId, reason: 'canceled' });
//     }
//     dispatch(endCall({ reason: 'canceled' }));
//     onCancel();
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={cancelCall}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <Ionicons
//             name={callType === 'video' ? 'videocam' : 'call'}
//             size={64}
//             color="#fff"
//             style={{ marginBottom: 20 }}
//           />
//           <Text style={styles.name}>{callee?.name || 'Unknown User'}</Text>
//           <Text style={styles.status}>{ringingText}</Text>

//           <TouchableOpacity style={styles.endButton} onPress={cancelCall}>
//             <Ionicons name="call" size={32} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: { alignItems: 'center' },
//   name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
//   status: { fontSize: 16, color: '#ccc', marginBottom: 30 },
//   endButton: {
//     backgroundColor: 'red',
//     padding: 18,
//     borderRadius: 50,
//   },
// });
