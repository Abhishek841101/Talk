import React from 'react';
import { Image } from 'react-native';
export default function Avatar({ uri, size = 90 }) {
return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
}