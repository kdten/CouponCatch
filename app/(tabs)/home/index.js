import { Link, Redirect, Stack } from "expo-router";
import { View, ScrollView, SafeAreaView } from "react-native";
import { ListItem, Badge, ActivityIndicator } from "@react-native-material/core";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getFirestore, collection, getDocs, setDoc, serverTimestamp, doc, query, where } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { db, AuthStore } from "../../../store";


const Tab1Index = () => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      const { user } = AuthStore.getRawState(); // Get current user from AuthStore
    
      if (user) { // Make sure user is not null
        const querySnapshot = await getDocs(query(collection(db, "Receipts"), where("UserID", "==", user.uid)));
    
        const receiptsData = querySnapshot.docs.map(doc => doc.data());
        setReceipts(receiptsData);
        if (!receiptsData) {
          console.log("No receipts found");
        }
      }
    };

    fetchReceipts();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "start", alignItems: "stretch" }}>
      <Stack.Screen options={{ headerShown: true, title: "Home" }} />

      {receipts.map((receipt, index) => (
        <ReceiptListItem key={index} receipt={receipt} />
      ))}

      {/* <Link href="/home/details">Go to Details</Link>
      <Link href="/home/new-entry-modal">Present modal</Link> */}
    </ScrollView>
  );
};


const ReceiptListItem = ({ receipt }) => {
  return (
    <ListItem
      title={`${receipt.dateOfPurchase} #${receipt.storeNumber}`} // use data from receipt
      secondaryText=""
      trailing={<Badge style={{ flexWrap: "nowrap" }} label={"$12.65"} color="primary" />}
      onClick={() => {
        // Handle button press
      }}
    />
  );
};

export default Tab1Index;
