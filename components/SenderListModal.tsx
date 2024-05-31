// SenderListModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSenders, saveSenders } from '@/services/SenderListService';

const SenderListModal = ({ visible, onClose }) => {
    const [sender, setSender] = useState('');
    const [senders, setSenders] = useState([]);

    useEffect(() => {
        const loadSenders = async () => {
            const senderList = await getSenders();
            setSenders(senderList);
        };
        if (visible) {
            loadSenders();
        }
    }, [visible]);

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

    const handleSave = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Set SMS Senders</Text>
                    <TextInput
                        style={styles.input}
                        value={sender}
                        onChangeText={setSender}
                        placeholder="Enter sender names"
                        placeholderTextColor="gray"
                    />
                    <Button title="Add Sender" onPress={addSender} />
                    <FlatList
                        data={senders}
                        renderItem={({ item, index }) => (
                            <View style={styles.senderRow}>
                                <Text style={styles.senderText}>{item}</Text>
                                <TouchableOpacity onPress={() => removeSender(index)}>
                                    <Ionicons name="close-circle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                    <Button title="Submit" onPress={handleSave} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
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

export default SenderListModal;
