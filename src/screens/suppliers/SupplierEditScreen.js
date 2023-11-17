import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { t } from "i18n-js";
import FieldText from "../../components/FieldText";
import Button from "../../components/Button";
import SupplierService from "../../services/SupplierService";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SupplierEditScreen({ navigation, route }) {
  // Retrieve Customer
  const [supplier, setSupplier] = useState(route.params.supplier);
  const [companyName, setCompanyName] = useState(supplier.company_name);
  const [phone, setPhone] = useState(supplier.phone);
  const [email, setEmail] = useState(supplier.email);
  const [tin, setTin] = useState(supplier.tin);
  const [address, setAddress] = useState(supplier.address);
  const [note, setNote] = useState(supplier.note);

  /**
   * Save a Customer in DB
   */
  async function handleSaveSupplier() {
    /** Construct new customer object */
    let supplierToUpdate = supplier;

    // Overwrite any Change that has been done in
    // the current state
    supplierToUpdate.company_name = companyName;
    supplierToUpdate.phone = phone;
    supplierToUpdate.email = email;
    supplierToUpdate.address = address;
    supplierToUpdate.note = note;

    // Record customer in the DB
    const lastCustomerId = await SupplierService.save(supplierToUpdate);
    navigation.goBack();
  }

  /**
   * Get customer from DB
   */
  async function handDeleteSupplier() {
    SupplierService.destroy(supplier);
    navigation.goBack();
  }

  return (
    <KeyboardAwareScrollView>
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <FieldText
            autoFocus={true}
            value={companyName}
            title={t("supplier.comany_name")}
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
            title={t("supplier.tin")}
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
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Button onPress={handDeleteSupplier} color={"#f1f1f1"} backgroundColor={'#ef4444'}>
            {t("common.delete")}
          </Button>
          <Button onPress={handleSaveSupplier} color={"#f1f1f1"} backgroundColor={'#47a67f'}>
            {t("common.save")}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
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
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
});
