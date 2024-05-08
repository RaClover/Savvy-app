// app/login.tsx

import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
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

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

const Page = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  // const onSignInPress = async () => {
  //   if (!isLoaded) {
  //     return;
  //   }
  //
  //   try {
  //     const completeSignIn = await signIn.create({
  //       identifier: emailAddress,
  //       password,
  //     });
  //     // This is an important step,
  //     // This indicates the user is signed in
  //     await setActive({ session: completeSignIn.createdSessionId });
  //
  //     // Redirect to email verification page
  //     router.push({
  //       pathname: '/verify/[email]',
  //       params: { email: emailAddress },
  //     });
  //   } catch (err) {
  //     console.error('Error during sign in:', err);
  //     if (isClerkAPIResponseError(err)) {
  //       // Handle Clerk API errors if needed
  //       Alert.alert('Error', err.message);
  //     } else {
  //       Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
  //     }
  //   }
  // };


  const onSignInPress = async () => {
    try {
      const completeSignIn = await signIn!.create({
        identifier: emailAddress,
        password,
      });

      switch (completeSignIn.status) {
        case 'complete':
          // This indicates the user is fully signed in
          await setActive!({ session: completeSignIn.createdSessionId });
          router.replace('/(authenticated)/(tabs)/home');
          break;

        case 'needs_second_factor':
        case 'needs_first_factor':
          // Redirect to a general verification page or specific based on the factor needed
          router.push({
            pathname: '/verify/[email]',
            params: { email: emailAddress, signin: 'true' },
          });
          break;

        default:
          // Handle other statuses or errors
          Alert.alert('Login Status', `Action required: ${completeSignIn.status}`);
          break;
      }
    } catch (err) {
      console.error('Error during sign in:', err);
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Login Error', err.message);
      } else {
        Alert.alert('Login Error', 'An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={defaultStyles.container}>
          <Text style={defaultStyles.header}>Welcome back</Text>
          <Text style={defaultStyles.descriptionText}>
            Enter your email and password to sign in
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.gray}
                value={emailAddress}
                onChangeText={setEmailAddress}
            />
            <TextInput
                style={[styles.input, { marginTop: 20 }]}
                placeholder="Password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
              style={[
                defaultStyles.pillButton,
                emailAddress && password ? styles.enabled : styles.disabled,
                { marginTop: 20 },
              ]}
              onPress={onSignInPress}
          >
            <Text style={defaultStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/signup')}>
            <Text style={{ color: Colors.primary }}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
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
