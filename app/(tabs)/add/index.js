import React, { useEffect, useState } from "react";
import { View, Button, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack } from "expo-router";
import { callGoogleVisionAsync } from "../../../visionhelper";
import {
  uploadReceiptImageToFirebaseStorage,
  addReceiptToFirestore,
  showSnackbar,
  ReceiptsStore,
} from "../../../store";

import { ActivityIndicator } from "@react-native-material/core";

const Tab2Index = () => {
  const [image, setImage] = useState(null);
  const [base64Img, setBase64Img] = useState(null);
  const usersCurrentReceipts = ReceiptsStore.useState(s => s.receipts);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("We need camera roll permissions.");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    //   console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBase64Img(result.assets[0].base64);
      // Send base64 version to API
      // const receiptInfo = await callGoogleVisionAsync(base64Img);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
        <Button title="Pick image" onPress={pickImage} />
        <View style={{ margin: 25 }} />
        <Button title="Use camera" onPress={takePhoto} />
      </View>
      <View style={{ margin: 15 }} />
      <View>
        {image && (
          <>
            <Image
              source={{ uri: image }}
              style={{ width: 400, height: 300, resizeMode: "contain" }}
            />
            <View style={{ margin: 15 }} />
            <Button
              style={{ margin: 15, width: 100 }}
              title="Submit Receipt"
              onPress={async () => {
                // Get receipt info from Google Vision API
                const receiptInfo = await callGoogleVisionAsync(base64Img);
                // duplicate
                const duplicate = usersCurrentReceipts.find(
                  receipt => JSON.stringify(receipt.terminalTransactionOperator) === JSON.stringify(receiptInfo.terminalTransactionOperator)
                );

                    
                    if (duplicate) {
                        showSnackbar("This receipt already added.");
                    } else {
                        const imageURL = await uploadReceiptImageToFirebaseStorage(image);
                        addReceiptToFirestore(imageURL, receiptInfo);
                        showSnackbar("Receipt added");
                    }

            }}
        />
          </>
        )}
      </View>
    </View>
  );
};

export default Tab2Index;
