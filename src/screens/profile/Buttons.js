import { useMemo } from 'react';
import { Pressable, Text, useColorScheme } from 'react-native';


const useThemeColors = () => {
const scheme = useColorScheme?.() || 'light';
const isDark = scheme === 'dark';
return useMemo(() => ({
bg: { subtle: isDark ? '#0b0b0b' : '#f7f7f7' },
text: { primary: isDark ? '#fff' : '#111' },
border: isDark ? '#222' : '#e5e5e5',
}), [scheme]);
};


export function PrimaryButton({ title, onPress, style }) {
const C = useThemeColors();
return (
<Pressable onPress={onPress} style={[{ borderWidth: 1, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginRight: 8, backgroundColor: C.bg.subtle, borderColor: C.border }, style]}>
<Text style={{ color: C.text.primary, fontWeight: '600' }}>{title}</Text>
</Pressable>
);
}


export function OutlineButton({ title, onPress, style }) {
const C = useThemeColors();
return (
<Pressable onPress={onPress} style={[{ borderWidth: 1, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginRight: 8, backgroundColor: 'transparent', borderColor: C.border }, style]}>
<Text style={{ color: C.text.primary, fontWeight: '600' }}>{title}</Text>
</Pressable>
);
}