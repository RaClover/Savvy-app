import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable , Alert, PermissionsAndroid , Linking, Button} from 'react-native';
import init from '../database/db';
import {useEffect} from "react";


const openSettings = () => {
  Linking.openSettings().catch(() => {
    Alert.alert("Unable to open settings");
  });
};

const requestSMSPermission = async () => {
  try {
    const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    console.log('Already granted:', alreadyGranted);
    if (alreadyGranted) {
      console.log("SMS permission already granted");
      Alert.alert("Permission Info", "SMS permission is already granted.");
      return;
    }

    const rationale = {
      title: "SMS Permission Required",
      message: "This app needs access to your SMS to track bank transactions automatically.",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    };

    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        rationale
    );

    console.log('Permission result:', granted); // Log the result of the permission request

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("SMS permission granted");
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log("SMS permission denied with never ask again");
      Alert.alert("Permission Denied", "You need to enable SMS permissions in settings manually to use this feature.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings }
      ]);
    } else {
      console.log("SMS permission denied");
    }
  } catch (err) {
    console.warn("Error requesting SMS permission", err);
    Alert.alert("Permission Error", "An error occurred while requesting permissions.");
  }
};




const Page = () => {
  const [assets] = useAssets([require('@/assets/videos/intro2.mp4')]);

  useEffect(() => {
    init();  // Initialize the SQLite database when the component mounts
    requestSMSPermission(); // Request SMS permission automatically when the app loads
  }, []);


  return (
    <View style={styles.container}>
      {assets && (
        <Video
          resizeMode={ResizeMode.COVER}
          isMuted
          isLooping
          shouldPlay
          source={{ uri: assets[0].uri }}
          style={styles.video}
        />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>Ready to change the way you money?</Text>
      </View>

      <View style={styles.buttons}>
        <View style={[defaultStyles.pillButton, { flex: 1, backgroundColor: Colors.dark }]}>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Log in</Text>
            </Pressable>
          </Link>
        </View>
        <View style={[defaultStyles.pillButton, { flex: 1, backgroundColor: '#fff' }]}>
          <Link href="/signup" asChild>
            <Pressable>
              <Text style={{ fontSize: 22, fontWeight: '500' }}>Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'black',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
});

export default Page;
