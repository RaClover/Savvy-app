import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const BottomLoginSheet = () => {
    const { bottom } = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: bottom }]}>
            <TouchableOpacity style={[defaultStyles.btn, styles.btnLight]}>
                <Ionicons name="logo-google" size={20} style={styles.btnIcon} color={'#fff'}/>
                <Text style={styles.btnLightText}>Continue with Google</Text>
            </TouchableOpacity>
            <Link
                href={{
                    pathname: '/signup',
                    params: { type: 'register' },
                }}
                style={[defaultStyles.btn, styles.btnDark]}
                asChild>
                <TouchableOpacity>
                    <Ionicons name="mail" size={20} style={styles.btnIcon} color={'#fff'} />
                    <Text style={styles.btnDarkText}>Sign up with email</Text>
                </TouchableOpacity>
            </Link>
            <Link
                href={{
                    pathname: '/login',
                    params: { type: 'login' },
                }}
                style={[defaultStyles.btn, styles.btnOutline]}
                asChild>
                <TouchableOpacity>
                    <Text style={styles.btnDarkText}>Log in</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '38%',
        backgroundColor: '#141518',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 26,
        gap: 14,
    },
    btnLight: {
        backgroundColor: 'rgba(6,20,179,0.72)',
    },
    btnLightText: {
        color: '#ffffff',
        fontSize: 20,
    },
    btnDark: {
        backgroundColor: Colors.grey,
    },
    btnDarkText: {
        color: '#fff',
        fontSize: 20,
    },
    btnOutline: {
        borderWidth: 3,
        borderColor: Colors.grey,
    },
    btnIcon: {
        paddingRight: 6,
    },
});
export default BottomLoginSheet;