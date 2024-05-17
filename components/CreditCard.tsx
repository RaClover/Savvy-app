// components/CreditCard.tsx

import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";

const circleSize = 250;

interface CreditCardProps {
    name: string;
    date: string;
    suffix: number | string;
    balance: number;
    style?: StyleProp<ViewStyle>;
    textColor?: string;
    bgColor?: string;
    bank_name: string
    color: string;
}

export default function CreditCard({
                                       name,
                                       date,
                                       suffix,
                                       balance,
                                       bank_name,
                                       style,
                                       textColor = "white",
                                       color
                                   }: CreditCardProps) {
    const dotStyle = [styles.dot, { backgroundColor: textColor }];
    return (
        <View style={[styles.container, { backgroundColor: color }, style]}>
            <View style={[styles.bgCircle, styles.rightBgCircle]} />
            <View style={[styles.bgCircle, styles.bottomBgCircle]} />
            <View style={styles.balanceContainer}>
                <Text style={[styles.text, { color: textColor , fontSize: 20}]}>{balance.toFixed(2)} ₽</Text>
            </View>
            <View style={styles.cardNumberContainer}>
                <View style={styles.cardNumberPart}>
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                </View>
                <View style={styles.cardNumberPart}>
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                </View>
                <View style={styles.cardNumberPart}>
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                </View>
                <Text style={[styles.text, { color: textColor }]}>{suffix}</Text>
            </View>
            <View style={styles.footerContainer}>
                <Text style={[styles.text, { color: textColor }]}>{name}</Text>
                <Text style={[styles.text, { color: textColor }]}>{bank_name}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 100,
        borderRadius: 12,
        width: 320,
        position: "relative",
    },
    balanceContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    cardNumberContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
    },
    cardNumberPart: { flexDirection: "row" },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    text: {
        fontFamily: "Courier",
        fontSize: 16,
        letterSpacing: 0.53,
    },
    bgCircle: {
        position: "absolute",
        backgroundColor: "white",
        opacity: 0.05,
        height: circleSize,
        width: circleSize,
        borderRadius: circleSize,
    },
    rightBgCircle: {
        top: (-1 * circleSize) / 4,
        right: (-1 * circleSize) / 2,
    },
    bottomBgCircle: {
        bottom: (-1 * circleSize) / 2,
        left: (0 * (-1 * circleSize)) / 2,
    },
});
