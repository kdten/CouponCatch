import React, { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack } from "expo-router";

const Tab2Index = () => {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("We need camera roll permissions to make this work.");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    //   console.log(result);

      if (!result.canceled) {
        // 
        // handle your image result here. You can store it in state and then use it as you like.
      }
    };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Add Receipt" }} />
      <Button title="Use camera" onPress={takePhoto} />
      <Button title="Pick an image" onPress={pickImage} />
    </View>
  );
};



// return (
//   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     <Button title="Use camera" onPress={takePhoto} />
//     <Button title="Pick an image from camera roll" onPress={pickImage} />
//     {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//   </View>
// );
// };
export default Tab2Index;
