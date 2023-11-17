import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { t } from "i18n-js";
import FieldText from "../../components/FieldText";
import Button from "../../components/Button";

import SupplierService from "../../services/SupplierService";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SupplierCreateScreen({ navigation }) {
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tin, setTin] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");


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
    <KeyboardAwareScrollView>
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <FieldText
            autoFocus={true}
            value={companyName}
            title={t("supplier.company_name")}
            onChangeText={setCompanyName}
            underlineColorAndroid="transparent"
            placeholder={"Company Name"}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={phone}
            title={t("supplier.phone")}
            onChangeText={setPhone}
            keyboardType={"phone-pad"}
            underlineColorAndroid="transparent"
            placeholder={'250788000000'}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={email}
            title={t("supplier.email")}
            onChangeText={setEmail}
            keyboardType={"email-address"}
            underlineColorAndroid="transparent"
            placeholder={'dukappcommunity@gmail.com'}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={tin}
            title={t("supplier.tax_identification_number")}
            onChangeText={setTin}
            underlineColorAndroid="transparent"
            placeholder={'10229 Dukapp'}
          />
        </View>
        <View style={styles.row}>
          <FieldText
            value={address}
            title={t("supplier.address")}
            onChangeText={setAddress}
            underlineColorAndroid="transparent"
            placeholder={"Type Something"}
          />
        </View>

        <View style={styles.row}>
          <FieldText
            value={note}
            title={t("supplier.note")}
            numberOfLines={5}
            onChangeText={setNote}
            underlineColorAndroid="transparent"
            style={{
              height: 200,
              textAlignVertical: "top",
              borderWidth: 0.5,
              borderColor: "#e2e8f0",
            }}
          />
        </View>
        <View style={[styles.row, { marginVertical: 10 }]}>
          <Button onPress={() => navigation.goBack()} color={"#f1f1f1"} backgroundColor={'#f59e0b'}>
            {t("common.cancel")}
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
    paddingVertical: 1,
    paddingHorizontal: 15,
  },
});
