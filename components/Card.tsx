import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    sender: string;
    time: string;
    body: string;
}

const Card: React.FC<Props> = ({ sender, time, body }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.sender}>{sender}</Text>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.body}>{body}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sender: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    time: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    body: {
        fontSize: 16,
    },
});

export default Card;
