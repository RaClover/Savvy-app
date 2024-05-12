import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// AsyncStorage for storage initialization
const storageKey = 'inactivity-storage';

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log('🚀 ~ handleAppStateChange ~ nextAppState', nextAppState);

    if (nextAppState === 'background') {
      recordStartTime();
    } else if (nextAppState === 'active' && appState.current.match(/background/)) {
      const elapsed = Date.now() - parseInt(await AsyncStorage.getItem(`${storageKey}:startTime`) || '0');
      console.log('🚀 ~ handleAppStateChange ~ elapsed:', elapsed);

      if (elapsed > 8000 && isSignedIn) {
        router.replace('/(authenticated)/(modals)/lock');
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = async () => {
    await AsyncStorage.setItem(`${storageKey}:startTime`, Date.now().toString());
  };

  return children;
};

