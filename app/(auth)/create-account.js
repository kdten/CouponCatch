import { View, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { AuthStore, appSignUp } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import { TextInput, Text, Button } from "@react-native-material/core";

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

    // valdiate error messages, if errors !exist, then sends to database
    const validate = () => {
      if (!email.includes('@')){
        setEmailError('Please enter a valid email address');
      }
  
      else if (password.length < 6){
        setPasswordError('Password must be at least 6 characters');
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
      <View>
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
      </View>
      <View>
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
      </View>
      <View>
        <TextInput
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
      </View>

      <Text style={styles.validateErrorText}>{emailError}</Text>
      <Text style={styles.validateErrorText}>{passwordError}</Text>
        
      <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
      <Button
        style={{ marginBottom: 8 }}
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
        title="Save new user"
        color="#000"
      >
      </Button>

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
