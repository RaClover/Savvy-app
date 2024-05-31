// services/SenderListService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

const { SmsListenerModule } = NativeModules;

export const getSenders = async () => {
    const savedSenders = await AsyncStorage.getItem('senders');
    return savedSenders ? JSON.parse(savedSenders) : [];
};

export const saveSenders = async (senders) => {
    await AsyncStorage.setItem('senders', JSON.stringify(senders));
    SmsListenerModule.setSenderList(senders); // Update the Kotlin module
};
