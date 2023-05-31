import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../../firebase-config'; // import your Firebase config
import { TextInput, View, Button, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
import { StyleSheet } from 'react-native';

const CouponForm = () => {
  const [coupon, setCoupon] = useState(Array(10).fill({ itemNumber: '', value: '' }));
  const [arrayName, setArrayName] = useState('');

  const handleChange = (index, field, value) => {
    const newCoupon = [...coupon];
    newCoupon[index] = { ...newCoupon[index], [field]: value };
    setCoupon(newCoupon);
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "Sales"), { arrayName, coupons: coupon });
      alert("Coupons added successfully!");
      setCoupon(Array(10).fill({ itemNumber: '', value: '' }));
      setArrayName('');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <View style={styles.label}>
          <Text>Which array (ex. May2023)</Text>
          <TextInput
            style={styles.textInput}
            value={arrayName}
            onChangeText={(text) => setArrayName(text)}
            keyboardType="numeric"
          />
        </View>

        {coupon.map((couponItem, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.label}>
              <Text>Item Number:</Text>
              <TextInput
                style={styles.textInput}
                value={couponItem.itemNumber}
                onChangeText={(text) => handleChange(index, "itemNumber", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.label}>
              <Text>Value:</Text>
              <TextInput
                style={styles.textInput}
                value={couponItem.value}
                onChangeText={(text) => handleChange(index, "value", text)}
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}
        
        <Button title="Add Coupons" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginBottom: 4,
  },
  textInput: {
    width: 100,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
});

export default CouponForm;
