import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, DeviceEventEmitter, Alert } from 'react-native';

interface SMSDetails {
    messageBody: string;
    senderPhoneNumber: string;
    timestamp: number;
}

interface TransactionDetails {
    message: string;
    is_transaction: boolean;
    category?: string;
    transaction_type?: string;
    amount?: string;
    currency?: string;
    card?: string;
    merchant?: string;
    balance?: string;
}

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionDetails[]>([]);

    const handleReceivedSMS = async (smsDetails: SMSDetails) => {
        try {
            const response = await fetch('http://10.0.2.2:8000/analyze-sms/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: smsDetails.messageBody }),
            });
            const data = await response.json();
            if (response.ok) {
                setTransactions(prevTransactions => [...prevTransactions, data]);
            } else {
                throw new Error(data.detail || 'Failed to analyze the SMS');
            }
        } catch (error) {
            console.error('Error sending SMS to API:', error);
            Alert.alert('Error', 'Failed to process the SMS.');
        }
    };

    useEffect(() => {
        const subscriber = DeviceEventEmitter.addListener('onSMSReceived', handleReceivedSMS);
        return () => subscriber.remove();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {transactions.map((transaction, index) => (
                <View key={index} style={styles.transactionContainer}>
                    <Text style={styles.transactionHeader}>Transaction: {transaction.message}</Text>
                    {transaction.is_transaction && (
                        <>
                            <Text>Category: {transaction.category}</Text>
                            <Text>Type: {transaction.transaction_type}</Text>
                            <Text>Amount: {transaction.amount}</Text>
                            <Text>Currency: {transaction.currency}</Text>
                            <Text>Card: {transaction.card}</Text>
                            <Text>Merchant: {transaction.merchant}</Text>
                            <Text>Balance: {transaction.balance}</Text>
                        </>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    transactionContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
    },
    transactionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TransactionsPage;
