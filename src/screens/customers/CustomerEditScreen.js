import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { t } from "i18n-js";
import FieldText from "../../components/FieldText";
import Button from "../../components/Button";

import CustomerService from "../../services/CustomerService";
import { ScrollView } from "react-native-gesture-handler";

export default function CustomerEditScreen({ navigation, route }) {
  // Retrieve Customer
  const [customer, setCustomer] = useState(route.params.customer);
  const [names, setNames] = useState(customer.names);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);
  const [address, setAddress] = useState(customer.address);
  const [note, setNote] = useState(customer.note);

  /**
   * Save a Customer in DB
   */
  async function handleSaveCustomer() {
    /** Construct new customer object */
    let customerToUpdate = customer;

    // Overwrite any Change that has been done in
    // the current state
    customerToUpdate.names = names;
    customerToUpdate.phone = phone;
    customerToUpdate.email = email;
    customerToUpdate.address = address;
    customerToUpdate.note = note;

    // Record customer in the DB
    const lastCustomerId = await CustomerService.save(customerToUpdate);
    return navigation.goBack();
  }

  /**
   * Get customer from DB
   */
  async function handDeleteCustomer() {
    CustomerService.destroy(customer);
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <FieldText
          autoFocus={true}
          value={names}
          title={t("customer.names")}
          onChangeText={setNames}
          underlineColorAndroid="transparent"
          placeholder={t("customer.names")}
        />
      </View>
      <View style={styles.row}>
        <FieldText
          value={phone}
          title={t("customer.phone")}
          onChangeText={setPhone}
          keyboardType={"phone-pad"}
          underlineColorAndroid="transparent"
          placeholder={t("customer.phone")}
        />
      </View>
      <View style={styles.row}>
        <FieldText
          value={email}
          title={t("customer.email")}
          onChangeText={setEmail}
          keyboardType={"email-address"}
          underlineColorAndroid="transparent"
          placeholder={t("customer.email")}
        />
      </View>
      <View style={styles.row}>
        <FieldText
          value={address}
          title={t("customer.address")}
          onChangeText={setAddress}
          underlineColorAndroid="transparent"
          placeholder={t("customer.address")}
        />
      </View>
      <View style={styles.row}>
        <FieldText
          value={note}
          title={t("customer.note")}
          numberOfLines={5}
          onChangeText={setNote}
          underlineColorAndroid="transparent"
          placeholder={t("customer.enter_customer_note")}
          style={{
            height: 200,
            textAlignVertical: "top",
            borderWidth: 0.5,
            borderColor: "#e2e8f0",
          }}
        />
      </View>
      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Button onPress={handDeleteCustomer} color={"#f1f1f1"} backgroundColor={"#ef4444"}>
          {t("common.delete")}
        </Button>
        <Button onPress={handleSaveCustomer} color={"#f1f1f1"} backgroundColor={'#47a67f'}>
          {t("common.save")}
        </Button>
      </View>
    </ScrollView>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    padding: 10,
  },
});
