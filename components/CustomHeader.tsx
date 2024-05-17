import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {View, Text, StyleSheet, Image} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import {Link, Stack} from 'expo-router';
import {  useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();
  const { user } = useUser();
  const router = useRouter();

  return (
    <BlurView intensity={100} tint={'extraLight'} style={{ paddingTop: top }}>
      <View
        style={[
          styles.container,
          {
            height: 60,
            gap: 10,
            paddingHorizontal: 20,
            backgroundColor: 'transparent',
          },
        ]}>
        <Link href={'/(authenticated)/(modals)/account'} asChild>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.gray,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {user?.imageUrl ? (
                <Image
                    source={{ uri: user.imageUrl }}
                    style={{ width: '100%', height: '100%' , borderRadius: 20 }}
                />
            ) : (
                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>SG</Text>
            )}
          </TouchableOpacity>
        </Link>
        <View style={styles.searchSection}>

        </View>
        <View style={styles.circle}>
          <Link href={'/(authenticated)/(modals)/account'} asChild>
          <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
          <Ionicons name={'stats-chart'} size={20} color={Colors.dark} />
          </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.circle}>
          <Ionicons name={'card'} size={20} color={Colors.dark} />
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    padding: 10,
    backgroundColor: Colors.gray,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 30,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: Colors.lightGray,
    color: Colors.dark,
    borderRadius: 30,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CustomHeader;
