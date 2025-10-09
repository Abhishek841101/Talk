import { Dimensions, Image, Pressable, Text, View, StyleSheet } from 'react-native';


export default function GridItem({ item, onPress }) {
const size = Dimensions.get('window').width / 3;
return (
<Pressable onPress={() => onPress(item)}>
<Image source={{ uri: item.uri }} style={{ width: size, height: size }} />
{item.type === 'reel' && (
<View style={styles.reelBadge}>
<Text style={styles.reelBadgeText}>▶︎</Text>
</View>
)}
</Pressable>
);
}


const styles = StyleSheet.create({
reelBadge: {
position: 'absolute', right: 6, top: 6, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
},
reelBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});