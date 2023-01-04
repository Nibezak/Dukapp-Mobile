import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import FieldText from "../../components/FieldText";
import Button from "../../components/Button";
import { t } from "i18n-js";
import OrderService from "../../services/OrderService";
import CustomerService from "../../services/CustomerService";
import { ScrollView } from "react-native-gesture-handler";

export default function CustomerCreateScreen({ navigation, route }) {
  const [names, setNames] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  // Set order if available
  const [customers, setCustomers] = useState([]);

  /**
   * Save a Customer in DB
   */
  async function handleSaveCustomer() {
    /** Construct new customer object */
    const newCustomer = {
      names: names,
      phone: phone,
      email: email,
      address: address,
      note: note,
    };

    // 1. Record customer in the DB
    CustomerService.save(newCustomer).then((result) => {
      // 2. Add customer to the order if that's the case
      if (route.params?.order) {
        const customerId = result.insertId;
        const order = route.params.order;
        OrderService.addCustomerToOrder(order.id, customerId);
      }
    });

    // Redirect after adding customer
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <FieldText
          value={names}
          autoFocus={true}
          title={t("customer.names")}
          onChangeText={setNames}
          underlineColorAndroid="transparent"
          placeholder={t("common.example_name")}
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
        <Button onPress={() => navigation.goBack()} color={"#f1f1f1"} backgroundColor={"#f59e0b"}>
          {t("common.cancel")}
        </Button>
        <Button onPress={handleSaveCustomer} color={"#f1f1f1"} backgroundColor={"#47a67f"}>
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
  },
  row: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
});
