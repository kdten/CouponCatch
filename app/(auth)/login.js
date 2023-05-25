import {
  View,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AuthStore, appSignIn } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { TextInput, Text, Button } from "@react-native-material/core";

export default function LogIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          onPress={async () => {
            const resp = await appSignIn(email, password);
            if (resp?.user) {
              router.replace("/(tabs)/home");
            } else {
              console.log(resp.error);
              Alert.alert("Login Error", resp.error?.message);
            }
          }}
          title="Login"
          color="#000"
        />
        
        <Button
          style={{ marginLeft: 24 }}
          onPress={() => {
            AuthStore.update((s) => {
              s.isLoggedIn = true;
            });
            router.push("/create-account");
          }}
          title="Create"
          color="#000"
        />
      </View>
      {/* <View style={{ flexDirection: "row" }}>
        <Button
          style={{ marginTop: 12, backgroundColor: "red" }}
          // login with Google here 
          title="Login with Google"
          trailing={props => <Ionicon name="logo-google" {...props} />}
        />
      </View> */}
    </View>
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
    color: 'red',
    fontSize: 15,
    marginBottom: 8,

  }
});

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
