

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
export default function Header({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PlayTalk</Text>
      <TouchableOpacity onPress={() => navigation.navigate('ChatListScreen')}>
        <Ionicons name="chatbubble-outline" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50, // add top space for notch/status bar
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80, // increased height for better spacing
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 28, // bigger logo
    fontWeight: 'bold',
  },
});
