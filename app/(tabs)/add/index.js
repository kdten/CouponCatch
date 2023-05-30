import React, { useEffect, useState } from "react";
import { View, Button, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack } from "expo-router";
import { callGoogleVisionAsync } from "../../../visionhelper";
import {
  uploadReceiptImageToFirebaseStorage,
  addReceiptToFirestore,
} from "../../../store";

const Tab2Index = () => {
  const [image, setImage] = useState(null);

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
      base64: true,  // Add this line
    });
    //   console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
      //setImage(result.assets[0].uri) instead of setImage(result.uri) if using ImagePicker.launchImageLibraryAsync
      // Send base64 version to API
      const detectedText = await callGoogleVisionAsync(result.base64);


    // Upload the image to Firebase Storage
  // const imageUrl = await uploadReceiptImageToFirebaseStorage(result.uri);
    
  // Save imageURL to Firestore
  // await addReceiptToFirestore(imageUrl);
  
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
      // setImage(result.assets[0].uri) instead of setImage(result.uri) if using ImagePicker.launchImageLibraryAsync
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Stack.Screen options={{ headerShown: true, title: "Add Receipt" }} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "space-around",
        }}
      >
        <Button title="Pick an image" onPress={pickImage} />
        <View style={{ margin: 15 }} />
        <Button title="Use camera" onPress={takePhoto} />
      </View>
      <View>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 400, height: 300, resizeMode: "contain" }}
          />
        )}
      </View>
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
