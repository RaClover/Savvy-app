import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { insertUser } from '@/database/db';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';


const Page = () => {
    const [email, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const router = useRouter();
    const { signUp } = useSignUp();

    // Define keyboardVerticalOffset - adjust this value based on your UI needs
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0;

    // const onSignup = async () => {
    //     try {
    //         const createUserResponse = await signUp!.create({
    //             firstName,
    //             lastName,
    //             emailAddress: email,
    //             password
    //         });
    //         console.log("Create user response:", createUserResponse);  // Log user creation response
    //
    //         const prepareVerificationResponse = await signUp!.prepareEmailAddressVerification();
    //         console.log("Prepare email verification response:", prepareVerificationResponse);  // Log preparation response
    //
    //         // Navigate to the email verification page
    //         router.push({ pathname: '/verify/[email]', params: { email } });
    //     } catch (error) {
    //         console.error('Error signing up:', error);
    //         // Alert user about the signup error
    //         Alert.alert('Signup Error', 'An error occurred while signing up. Please try again.');
    //     }
    // };

    const onSignup = async () => {
        try {
            const createUserResponse = await signUp!.create({
                firstName,
                lastName,
                emailAddress: email,
                password
            });
            console.log("Create user response:", createUserResponse);  // Log user creation response

            // Await the insert user function and handle separately
            await insertUser(firstName, lastName, email);
            console.log('User has been saved to the SQL database');

            const prepareVerificationResponse = await signUp!.prepareEmailAddressVerification();
            console.log("Prepare email verification response:", prepareVerificationResponse);  // Log preparation response

            // Navigate to the email verification page
            router.push({ pathname: '/verify/[email]', params: { email } });
        } catch (error) {
            console.error('Error during sign up:', error);
            Alert.alert('Signup Error', 'An error occurred while signing up. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Let's get started!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your details to create an account.
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { marginTop: 6 }]}
                        placeholder="First Name"
                        placeholderTextColor={Colors.gray}
                        value={firstName}
                        onChangeText={(firstName) => setFirstName(firstName)}
                    />

                    <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Last Name"
                        placeholderTextColor={Colors.gray}
                        value={lastName}
                        onChangeText={(lastName) => setLastName(lastName)}
                    />

                    <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Email"
                        placeholderTextColor={Colors.gray}
                        value={email}
                        onChangeText={(email) => setEmailAddress(email)}
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Password"
                        placeholderTextColor={Colors.gray}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(password) => setPassword(password)}
                    />


                </View>


                <TouchableOpacity
                    style={[
                        defaultStyles.pillButton,
                        email && password ? styles.enabled : styles.disabled,
                        { marginTop: 20 },
                    ]}
                    onPress={onSignup}
                >
                    <Text style={defaultStyles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/login')}>
                    <Text style={{ color: Colors.primary }}>Already have an account? Log in</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 0,
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 18,
        borderRadius: 16,
        fontSize: 20,
    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
    },
});

export default Page;

