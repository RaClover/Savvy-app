import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LineChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');
const tabWidth = (width - 40) / 4; // Dynamically adjust tab width

const Page = () => {
    const [activeTab, setActiveTab] = useState('Day');
    const animation = useRef(new Animated.Value(0)).current;

    const tabs = ['Day', 'Week', 'Month', 'Year'];

    useEffect(() => {
        Animated.timing(animation, {
            toValue: tabs.indexOf(activeTab) * tabWidth,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [activeTab]);

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const getChartData = () => {
        switch (activeTab) {
            case 'Day':
                return [
                    { value: 20, label: '12AM' },
                    { value: 45, label: '6AM' },
                    { value: 28, label: '12PM' },
                    { value: 80, label: '6PM' }
                ];
            case 'Week':
                return [
                    { value: 20, label: 'Mon' },
                    { value: 45, label: 'Tue' },
                    { value: 28, label: 'Wed' },
                    { value: 80, label: 'Thu' },
                    { value: 99, label: 'Fri' },
                    { value: 43, label: 'Sat' },
                    { value: 50, label: 'Sun' }
                ];
            case 'Month':
                return [
                    { value: 200, label: '1' },
                    { value: 450, label: '2' },
                    { value: 280, label: '3' },
                    { value: 800, label: '4' }
                ];
            case 'Year':
                return [
                    { value: 2000, label: 'Jan' },
                    { value: 4500, label: 'Feb' },
                    { value: 2800, label: 'Mar' },
                    { value: 8000, label: 'Apr' },
                    { value: 6000, label: 'May' },
                    { value: 5000, label: 'Jun' },
                    { value: 3000, label: 'Jul' },
                    { value: 4000, label: 'Aug' },
                    { value: 7000, label: 'Sep' },
                    { value: 1000, label: 'Oct' },
                    { value: 2000, label: 'Nov' },
                    { value: 3000, label: 'Dec' }
                ];
            default:
                return [];
        }
    };

    return (
        <BlurView intensity={100} tint={'extraLight'} style={styles.blurView}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.tabsContainer}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={styles.tabContainer}
                                onPress={() => handleTabPress(tab)}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: animation }] }]} />
                    </View>
                    <View style={styles.contentContainer}>
                        <LineChart
                            data={getChartData()}
                            width={width - 40}
                            height={250}
                            spacing={30}
                            initialSpacing={15}
                            animateOnDataChange
                            color="#3b82f6"
                            showLine
                            showDots
                            dotColor="#3b82f6"
                            hideAxesAndRules
                            curved
                            thickness={5} // Increased line thickness
                            hideXAxisText={true}
                            hideYAxisText={true}
                            yAxisLabelWidth={0}
                            xAxisLabelWidth={0}
                            rulesType="none"
                            xLabelsOffset={-999}  // Move labels off-screen, if necessary
                            xAxisTextStyle={{ color: 'transparent' }}  // Make text transparent
                            pointerConfig={{
                                pointerStripHeight: 200,
                                pointerStripWidth: 4,
                                pointerStripColor: '#3b82f6',
                                pointerColor: '#3b82f6',
                                radius: 5,
                                pointerLabelWidth: 100,
                                pointerLabelHeight: 100,
                                pointerLabelComponent: items => {
                                    return (
                                        <View style={styles.pointerLabel}>
                                            <Text style={styles.pointerLabelText}>
                                                {items[0].value}
                                            </Text>
                                            <Text style={styles.pointerLabelSubText}>
                                                {items[0].label}
                                            </Text>
                                        </View>
                                    );
                                }
                            }}
                            areaChart
                        />
                    </View>
                </View>
            </ScrollView>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    blurView: {
        flex: 1,
        paddingTop: 100,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    scrollView: {
        backgroundColor: 'rgba(240,240,240,0.9)',
    },
    container: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: 25,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    tabContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginHorizontal: 5,
    },
    tabText: {
        fontSize: 16,
        color: '#6b7280',
    },
    activeTabText: {
        color: '#3b82f6',
        fontWeight: 'bold',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: -2,
        left: 0,
        width: tabWidth - 10,
        height: 5,
        backgroundColor: '#3b82f6',
        borderRadius: 2.5,
    },
    contentContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    pointerLabel: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    pointerLabelText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    pointerLabelSubText: {
        fontSize: 14,
        color: '#6b7280',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default Page;
