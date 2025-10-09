// // components/BlockModal.js
// import React, { useState } from 'react';
// import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { blockUser } from '../features/block/blockSlice';

// const BlockModal = ({ visible, onClose, userId, username }) => {
//   const dispatch = useDispatch();
//   const [selectedReason, setSelectedReason] = useState('');
//   const [customReason, setCustomReason] = useState('');

//   const reasons = [
//     { id: 'spam', label: 'Spam' },
//     { id: 'harassment', label: 'Harassment' },
//     { id: 'fake', label: 'Fake account' },
//     { id: 'other', label: 'Other' },
//   ];

//   const handleBlock = () => {
//     const reason = selectedReason === 'other' ? customReason : selectedReason;
//     dispatch(blockUser({ userId, reason }));
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View className="flex-1 justify-center items-center bg-black/50">
//         <View className="bg-white rounded-2xl p-6 w-80">
//           <Text className="text-xl font-bold text-center mb-4">
//             Block @{username}?
//           </Text>
          
//           <Text className="text-gray-600 text-center mb-6">
//             They won't be able to see your posts, reels, or send you messages.
//           </Text>

//           <Text className="font-semibold mb-3">Why are you blocking?</Text>
          
//           <ScrollView className="max-h-40 mb-4">
//             {reasons.map((reason) => (
//               <TouchableOpacity
//                 key={reason.id}
//                 className="flex-row items-center py-3 border-b border-gray-100"
//                 onPress={() => setSelectedReason(reason.id)}
//               >
//                 <View className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 items-center justify-center">
//                   {selectedReason === reason.id && (
//                     <View className="w-3 h-3 rounded-full bg-blue-500" />
//                   )}
//                 </View>
//                 <Text>{reason.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           {selectedReason === 'other' && (
//             <TextInput
//               className="border border-gray-300 rounded-lg p-3 mb-4"
//               placeholder="Please specify reason..."
//               value={customReason}
//               onChangeText={setCustomReason}
//               multiline
//             />
//           )}

//           <View className="flex-row justify-between">
//             <TouchableOpacity
//               className="px-6 py-3 rounded-lg"
//               onPress={onClose}
//             >
//               <Text className="text-gray-600 font-semibold">Cancel</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               className="px-6 py-3 bg-red-500 rounded-lg"
//               onPress={handleBlock}
//               disabled={!selectedReason || (selectedReason === 'other' && !customReason)}
//             >
//               <Text className="text-white font-semibold">Block</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default BlockModal;









// components/BlockModal.js
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { blockUser } from '../features/block/blockSlice';

const BlockModal = ({ visible, onClose, userId, username }) => {
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reasons = [
    { id: 'spam', label: 'Spam' },
    { id: 'harassment', label: 'Harassment' },
    { id: 'fake', label: 'Fake account' },
    { id: 'other', label: 'Other' },
  ];

  const handleBlock = () => {
    const reason = selectedReason === 'other' ? customReason : selectedReason;
    dispatch(blockUser({ userId, reason }));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Block @{username}?
          </Text>
          
          <Text style={styles.modalMessage}>
            They won't be able to see your posts, reels, or send you messages.
          </Text>

          <Text style={styles.reasonTitle}>Why are you blocking?</Text>
          
          <ScrollView style={styles.reasonsContainer}>
            {reasons.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={styles.reasonItem}
                onPress={() => setSelectedReason(reason.id)}
              >
                <View style={styles.radioCircle}>
                  {selectedReason === reason.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.reasonText}>{reason.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedReason === 'other' && (
            <TextInput
              style={styles.customReasonInput}
              placeholder="Please specify reason..."
              placeholderTextColor="#888"
              value={customReason}
              onChangeText={setCustomReason}
              multiline
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.blockButton, 
                (!selectedReason || (selectedReason === 'other' && !customReason)) && styles.disabledButton
              ]}
              onPress={handleBlock}
              disabled={!selectedReason || (selectedReason === 'other' && !customReason)}
            >
              <Text style={styles.blockButtonText}>Block</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontSize: 14,
  },
  reasonTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
    fontSize: 16,
  },
  reasonsContainer: {
    maxHeight: 160,
    marginBottom: 16,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  reasonText: {
    fontSize: 16,
    color: '#000',
  },
  customReasonInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  blockButton: {
    backgroundColor: '#ff375f',
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  blockButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BlockModal;