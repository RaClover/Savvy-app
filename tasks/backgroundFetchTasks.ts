// tasks/backgroundFetchTasks.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeSMS } from '@/services/smsService';

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();
    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

    try {
        const lastProcessedSMS = await AsyncStorage.getItem('lastProcessedSMS');
        if (lastProcessedSMS) {
            const sms = JSON.parse(lastProcessedSMS);
            const response = await analyzeSMS(sms.messageBody);
            console.log('Background fetch API Response:', response);
        }
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('Error during background fetch:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export const registerBackgroundFetchAsync = async () => {
    console.log('Registering background fetch task');
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 60 * 15, // 15 minutes
            stopOnTerminate: false,
            startOnBoot: true,
        });
        console.log('Background fetch task registered successfully');
    } catch (error) {
        console.error('Failed to register background fetch task:', error);
    }
};

export const unregisterBackgroundFetchAsync = async () => {
    try {
        await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
        console.log('Background fetch task unregistered successfully');
    } catch (error) {
        console.error('Failed to unregister background fetch task:', error);
    }
};
