import React, { useEffect, useRef } from 'react';
import { NativeEventEmitter, NativeModules, Platform, Alert, PermissionsAndroid, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeSMS } from '@/services/smsService';
import { supabase } from '@/utils/supabase';

const { SmsListenerModule } = NativeModules;

const openSettings = () => {
    Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
    });
};

const requestSMSPermission = async () => {
    if (Platform.OS === 'android') {
        const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
        if (alreadyGranted) {
            return true;
        }

        const rationale = {
            title: "SMS Permission Required",
            message: "This app needs access to your SMS to track bank transactions automatically.",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        };

        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS, rationale);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                Alert.alert("Permission Denied", "You need to enable SMS permissions in settings manually to use this feature.", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: openSettings }
                ]);
            }
            return false;
        }
    }
    return false;
};

const handleReceivedSMS = async (sms) => {
    console.log('Received SMS:', sms);

    const lastProcessedSMS = await AsyncStorage.getItem('lastProcessedSMS');
    const lastProcessedSMSObject = lastProcessedSMS ? JSON.parse(lastProcessedSMS) : null;

    if (lastProcessedSMSObject &&
        lastProcessedSMSObject.messageBody === sms.messageBody &&
        lastProcessedSMSObject.senderPhoneNumber === sms.senderPhoneNumber &&
        lastProcessedSMSObject.timestamp === sms.timestamp) {
        console.log('SMS already processed, skipping:', sms);
        return;
    }

    await AsyncStorage.setItem('lastProcessedSMS', JSON.stringify(sms));

    const userId = await AsyncStorage.getItem('supabaseUserId');

    if (!userId) {
        console.error('User ID not found in AsyncStorage');
        return;
    }

    try {
        const response = await axios.post('http://10.0.2.2:8000/analyze-sms/', { message: sms.messageBody });
        console.log('API Response:', response.data);

        const { is_transaction, category, transaction_type, amount, currency, card, merchant, balance } = response.data;

        if (is_transaction) {
            const { data: cardData, error: cardError } = await supabase
                .from('bank_cards')
                .select('id, current_balance')
                .eq('card_number', card)
                .eq('user_id', userId)
                .single();

            let cardId;
            let newBalance = parseFloat(balance);

            if (cardData) {
                cardId = cardData.id;
                const oldBalance = parseFloat(cardData.current_balance);
                const transactionAmount = parseFloat(amount);

                if (transaction_type === 'payment' || transaction_type === 'transfer') {
                    newBalance = oldBalance - transactionAmount;
                } else if (transaction_type === 'deposit') {
                    newBalance = oldBalance + transactionAmount;
                }

                const { error: updateError } = await supabase
                    .from('bank_cards')
                    .update({ current_balance: newBalance })
                    .eq('id', cardId);

                if (updateError) {
                    throw updateError;
                }
            } else {
                const { data: newCardData, error: newCardError } = await supabase
                    .from('bank_cards')
                    .insert([
                        {
                            user_id: userId,
                            bank_name: sms.senderPhoneNumber,
                            card_number: card,
                            currency,
                            current_balance: balance
                        }
                    ])
                    .select();

                if (newCardError) {
                    throw newCardError;
                }

                cardId = newCardData[0].id;
            }

            const transactionTimestamp = new Date(sms.timestamp).toISOString();

            const { error: transactionError } = await supabase
                .from('transactions')
                .insert([
                    {
                        card_id: cardId,
                        transaction_type,
                        amount,
                        currency,
                        merchant,
                        category,
                        time: transactionTimestamp
                    }
                ]);

            if (transactionError) {
                throw transactionError;
            }
        }
    } catch (error) {
        console.error('Error sending SMS to API or processing transaction:', error);
    }
};

const SMSListener = () => {
    const eventEmitter = useRef<NativeEventEmitter | null>(null);
    const subscription = useRef<any>(null);

    useEffect(() => {
        const initSMSListener = async () => {
            const hasPermission = await requestSMSPermission();
            if (hasPermission) {
                SmsListenerModule.startForegroundService();
                eventEmitter.current = new NativeEventEmitter(SmsListenerModule);
                subscription.current = eventEmitter.current.addListener('onSMSReceived', handleReceivedSMS);
            }
        };

        initSMSListener();

        return () => {
            if (subscription.current) {
                subscription.current.remove();
            }
        };
    }, []);

    return null;
};

export default SMSListener;
