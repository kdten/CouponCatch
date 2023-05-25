import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { useRef, useState } from "react";
import { AuthStore, appSignUp } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import { TextInput, Text, Button } from "@react-native-material/core";
import PasswordStrengthMeterBar from "react-native-password-strength-meter-bar";

// Define strength level list
const strengthLevels = [
  {
    label: 'Weak',
    labelColor: '#fff',
    widthPercent: '33',
    innerBarColor: '#fe6c6c'
  },
  {
    label: 'Weak',
    labelColor: '#fff',
    widthPercent: '33',
    innerBarColor: '#fe6c6c'
  },
  {
    label: 'Fair',
    labelColor: '#fff',
    widthPercent: '67',
    innerBarColor: '#feb466'
  },
  {
    label: 'Fair',
    labelColor: '#fff',
    widthPercent: '67',
    innerBarColor: '#feb466'
  },
  {
    label: 'Strong',
    labelColor: '#fff',
    widthPercent: '100',
    innerBarColor: '#6cfeb5'
  }
];

// Define too short object
const tooShort = {
  enabled: true,
  label: 'Too short',
  labelColor: 'red'
};

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordIsValid, setPasswordIsValid] = useState(false);

    // valdiate error messages, if errors !exist, then sends to database
    const validate = () => {
      if (!email.includes('@')){
        setEmailError('Please enter a valid email address');
      }
  
      else if (password.length < 8){
        setPasswordError('Password must be at least 8 characters');
      }
  
      else if (email.length === 0 )
        setEmailError('Email is required');
  
      else if (email.indexOf(' ') >= 0) {
        setEmailError('Email cannot contain spaces');
      }
  
      else if (password.indexOf(' ') >= 0) {
        setPasswordError('Password cannot contain spaces');
      }

      else if (password !== passwordRepeat) {
        setPasswordError('Passwords do not match');
      }
  
      else {
        setEmailError('');
        setPasswordError('');
        return true;
      }
    }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{ title: "Create Account", headerLeft: () => <></> }}
      />
      <KeyboardAvoidingView>
        <TextInput
          style={styles.textInput}
          label="email"
          variant="outlined"
          nativeID="email"
          value={email}
          onChangeText={(text) => { 
            setEmail(text);
          }}
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView>
        <TextInput
          label="password"
          variant="outlined"
          secureTextEntry={true}
          nativeID="password"
          value={password}
          onChangeText={(text) => { 
            setPassword(text);
          }}
          style={styles.textInput}
        />
        <PasswordStrengthMeterBar password={password} />

      </KeyboardAvoidingView>
      <KeyboardAvoidingView>
        <TextInput
          size='short'
          label="password repeat"
          variant="outlined"
          secureTextEntry={true}
          nativeID="passwordrepeat"
          value={passwordRepeat}
          onChangeText={(text) => { 
            setPasswordRepeat(text);
          }}
          style={styles.textInput}
        />
      </KeyboardAvoidingView>

      <Text style={styles.validateErrorText}>{emailError}</Text>
      <Text style={styles.validateErrorText}>{passwordError}</Text>
        
      <View style={{ flexDirection: "column", justifyContent: "space-between", alignSelf: 'center', alignItems: 'center' }}>
      <Button
        onPress={async () => {
          if (!validate()) return;
          const resp = await appSignUp(
            email,
            password,
          );
          if (resp?.user) {
            router.replace("/(tabs)/home");
          } else {
            console.log(resp.error);
            Alert.alert("Sign Up Error", resp.error?.message);
          }
        }}
        title="Save your new account"
        color="#000"
      >
      </Button>
        <br />
      <Button
        onPress={() => {
          AuthStore.update((s) => {
            s.isLoggedIn = false;
          });
          router.replace("/login");
        }}
        title="Cancel"
        color="#000"
      >
      </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  textInput: {
    width: 250,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  validateErrorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 8,
  }
});
