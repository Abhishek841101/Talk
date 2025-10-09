import { useMemo } from 'react';
import { Image, Modal, Pressable, SafeAreaView, ScrollView, Text, View, useColorScheme } from 'react-native';
import Avatar from './Avatar';
import { OutlineButton } from './Buttons';


const useTheme = () => {
    const scheme = useColorScheme?.() || 'light';
    const isDark = scheme === 'dark';
    return useMemo(() => ({
        bg: isDark ? '#000' : '#fff',
        text: { primary: isDark ? '#fff' : '#111', secondary: isDark ? '#c7c7c7' : '#666' },
        tint: isDark ? '#0a84ff' : '#007aff',
    }), [scheme]);
};


export default function PostModal({ visible, item, onClose, headerUser }) {
    const C = useTheme();
    if (!item) return null;
    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
                    <Text style={{ color: C.text.primary, fontWeight: '700' }}>Post</Text>
                    <Pressable onPress={onClose}><Text style={{ color: C.tint, fontWeight: '600' }}>Close</Text></Pressable>
                </View>
                <ScrollView>
                    <Image source={{ uri: item.uri }} style={{ width: '100%', height: 400 }} />
                    <View style={{ padding: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Avatar size={36} uri={headerUser?.avatar} />
                                <Text style={{ color: C.text.primary, fontWeight: '700', marginLeft: 8 }}>{headerUser?.username}</Text>
                            </View>
                            <Text style={{ color: C.text.secondary }}>{new Intl.NumberFormat('en', { notation: 'compact' }).format(item.likes)} likes</Text>
                        </View>
                        <Text style={{ color: C.text.primary, marginBottom: 12 }}>A beautiful capture of nature. #{item.id}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <OutlineButton title="Like" onPress={() => { }} />
                            <OutlineButton title="Comment" onPress={() => { }} />
                            <OutlineButton title="Share" onPress={() => { }} />
                            <OutlineButton title="Save" onPress={() => { }} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}