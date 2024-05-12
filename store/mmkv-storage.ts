import { StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';



// AsyncStorage for storage initialization
const storageKey = 'balance-storage';

export const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error('Error setting data:', error);
    }
  },
  getItem: async (name) => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ?? null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },
};


// const storage = new MMKV({
//   id: 'balance-storage',
// });
//
// export const zustandStorage: StateStorage = {
//   setItem: (name, value) => {
//     return storage.set(name, value);
//   },
//   getItem: (name) => {
//     const value = storage.getString(name);
//     return value ?? null;
//   },
//   removeItem: (name) => {
//     return storage.delete(name);
//   },
// };
