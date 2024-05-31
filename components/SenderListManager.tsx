// SenderListManager.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSenders, saveSenders } from '@/services/SenderListService';

const SenderListManager = () => {
    const [sender, setSender] = useState('');
    const [senders, setSenders] = useState([]);

    useEffect(() => {
        const loadSenders = async () => {
            const senderList = await getSenders();
            setSenders(senderList);
        };
        loadSenders();
    }, []);

    const addSender = async () => {
        if (sender.trim() !== '') {
            const updatedSenders = [...senders, sender.trim()];
            setSenders(updatedSenders);
            await saveSenders(updatedSenders);
            setSender('');
        }
    };

    const removeSender = async (index) => {
        const updatedSenders = senders.filter((_, i) => i !== index);
        setSenders(updatedSenders);
        await saveSenders(updatedSenders);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Senders</Text>
            <TextInput
                style={styles.input}
                value={sender}
                onChangeText={setSender}
                placeholder="Enter sender names"
                placeholderTextColor="gray"
            />
            <Button title="Add Sender" onPress={addSender} />
            <ScrollView style={styles.senderList}>
                {senders.map((item, index) => (
                    <View key={index} style={styles.senderRow}>
                        <Text style={styles.senderText}>{item}</Text>
                        <TouchableOpacity onPress={() => removeSender(index)}>
                            <Ionicons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    senderList: {
        marginTop: 20,
    },
    senderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    senderText: {
        fontSize: 16,
    },
});

export default SenderListManager;
