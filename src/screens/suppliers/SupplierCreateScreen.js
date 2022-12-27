import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { t } from "i18n-js";
import FieldText from "../../components/FieldText";
import Button from "../../components/Button";

import SupplierService from "../../services/SupplierService";

export default function SupplierCreateScreen({ navigation }) {
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tin, setTin] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [customers, setCustomers] = useState([]);

  /**
   * Save a Customer in DB
   */
  async function handleSaveSupplier() {
    /** Construct new customer object */
    const newSupplier = {
      company_name: companyName,
      phone: phone,
      email: email,
      tin: tin,
      address: address,
      note: note,
    };

    // Record customer in the DB
    const lastCustomerId = await SupplierService.save(newSupplier);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView mode="padding">
        <View style={styles.row}>
          <FieldText
            autoFocus={true}
            value={companyName}
            title={t("supplier.company_name")}
            onChangeText={setCompanyName}
            underlineColorAndroid="transparent"
            placeholder={t("supplier.company_name_placeholder")}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={phone}
            title={t("supplier.phone")}
            onChangeText={setPhone}
            keyboardType={"phone-pad"}
            underlineColorAndroid="transparent"
            placeholder={t("supplier.phone_placeholder")}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={email}
            title={t("supplier.email")}
            onChangeText={setEmail}
            keyboardType={"email-address"}
            underlineColorAndroid="transparent"
            placeholder={t("supplier.email_placeholder")}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={tin}
            title={t("supplier.tax_identification_number")}
            onChangeText={setTin}
            underlineColorAndroid="transparent"
            placeholder={t("supplier.tin_placeholder")}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={address}
            title={t("supplier.address")}
            onChangeText={setAddress}
            underlineColorAndroid="transparent"
            placeholder={t("supplier.address_placeholder")}
          />
        </View>

        <View style={styles.row}>
          <FieldText
            value={note}
            title={t("supplier.note")}
            numberOfLines={5}
            onChangeText={setNote}
            underlineColorAndroid="transparent"
            placeholder={t("supplier.note_placeholder")}
            style={{
              height: 200,
              textAlignVertical: "top",
              borderWidth: 0.5,
              borderColor: "#e2e8f0",
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={[styles.row, { marginVertical: 10 }]}>
        <Button onPress={() => navigation.goBack()} color={"#f59e0b"}>
          {t("common.cancel")}
        </Button>
        <Button onPress={handleSaveSupplier} color={"#15803d"}>
          {t("common.save")}
        </Button>
      </View>
    </View>
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
    paddingVertical: 1,
    paddingHorizontal: 15,
  },
});
