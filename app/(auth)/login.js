import {
  View,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { AuthStore, appSignIn } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { TextInput, Text, Button } from "@react-native-material/core";

export default function LogIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  // valdiate error messages, if errors !exist, then sends to database
  const validate = () => {
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (email.length === 0) setEmailError("Email is required");
    else if (email.indexOf(" ") >= 0) {
      setEmailError("Email cannot contain spaces");
    } else if (password.indexOf(" ") >= 0) {
      setPasswordError("Password cannot contain spaces");
    } else {
      setEmailError("");
      setPasswordError("");
      return true;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
          style={styles.textInput}
          label="password"
          variant="outlined"
          size="small"
          secureTextEntry={true}
          nativeID="password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          color="primary"
        />
      </KeyboardAvoidingView>

      <View style={{ marginTop: 20 }} />
      <Text style={styles.validateErrorText}>{emailError}</Text>
      <Text style={styles.validateErrorText}>{passwordError}</Text>

      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onPress={async () => {
            try {
              const resp = await appSignIn(email, password);
              if (resp?.user) {
                router.replace("/(tabs)/home");
              } else {
                console.log(resp.error);
                Alert.alert("Login Error", resp.error?.message);
              }
            } catch (error) {
              // Handle different error codes from Firebase
              if (error.code === "auth/invalid-email") {
                setEmailError(
                  "Invalid email password combo. Please check and try again."
                );
              } else if (error.code === "auth/user-not-found") {
                setEmailError(
                  "No user found with this email. Please check the email and try again."
                );
              } else if (error.code === "auth/invalid-password") {
                setEmailError(
                  "Invalid email password combo. Please check and try again."
                );
              } else {
                // Generic error message for other error codes
                setEmailError(
                  "An error occurred during login. Please try again."
                );
              }
              console.log(error);
            }
          }}
          title="Login"
          color="#000"
        />

        <View style={{ marginTop: 20 }} />

        <Text style={{ fontSize: 12 }}>Don't have an account?</Text>
        <Button
          onPress={() => {
            if (!validate()) return;
            AuthStore.update((s) => {
              s.isLoggedIn = true;
            });
            router.push("/create-account");
          }}
          title="Create One"
          color="#000"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  textInput: {
    width: 250,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  validateErrorText: {
    color: "red",
    fontSize: 15,
    marginBottom: 8,
  },
});

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
