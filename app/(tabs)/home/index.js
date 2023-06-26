import { Link, Redirect, Stack } from "expo-router";
import { View, ScrollView, SafeAreaView } from "react-native";
import { ListItem, Badge, ActivityIndicator } from "@react-native-material/core";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { db, AuthStore } from "../../../store";
import { ReceiptsStore, fetchReceipts } from "../../../store";


const Tab1Index = () => {
  const receipts = ReceiptsStore.useState(s => s.receipts);

  useEffect(() => {
    // Execute fetchReceipts and don't worry about cleanup
    fetchReceipts();
  }, []);
  
  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "start", alignItems: "stretch" }}>
      <Stack.Screen options={{ headerShown: true, title: "My Receipts" }} />

      {receipts.map((receipt, index) => (
        <ReceiptListItem key={index} receipt={receipt} />
      ))}
    </ScrollView>
  );
};


const ReceiptListItem = ({ receipt }) => {
  return (
    <ListItem
      title={`${receipt.dateOfPurchase} #${receipt.storeNumber}`} // use data from receipt
      secondaryText=""
      trailing={<Badge style={{ flexWrap: "nowrap" }} label={"2_days_$12.65"} color="primary" />}
      onClick={() => {
        // Handle button press
      }}
    />
  );
};

export default Tab1Index;
