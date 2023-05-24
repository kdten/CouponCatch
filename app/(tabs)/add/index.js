import { Link, Redirect, Stack } from "expo-router";
import { View } from "react-native";
import * as ImagePicker from 'expo-image-picker';


const Tab2Index = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Add Receipt" }} />
      <Link href="/home/details">Use camera</Link>
      <Link href="/home/new-entry-modal">upload photo</Link>
    </View>
  );
};
export default Tab2Index;
