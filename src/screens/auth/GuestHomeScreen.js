import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Linking,
  Text,
  TouchableOpacity,
} from "react-native";
import { t } from "i18n-js";
import ButtonFilled from "../../components/ButtonFilled";
import KeyboardAvoidingView from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function GuestHomeScreen({ navigation }) {
  // Ensure database tables are created
  useEffect(() => {
    // 1. Migrate database
    Customer.createTable();
    Item.createTable();
    Order.createTable();
    OrderItem.createTable();
    Supplier.createTable();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAwareScrollView>
        <Text style={styles.appName}>{"Dukapp"}</Text>
        <Text style={styles.prompt}>{t("auth.welcome_to_dukapp_app")}</Text>
        <Text style={styles.message}>
          {t("auth.welcome_to_dukapp_app_description")}
        </Text>

        <TouchableOpacity
          onPress={async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL("https://butike.app");
          }}
        >
          <Text style={styles.termsLink}>{t("common.terms_and_condition")}</Text>
        </TouchableOpacity>
        <ButtonFilled onPress={() => navigation.navigate("PhoneNumber")}>
          {t("auth.accept_tc_and_continue")}
        </ButtonFilled>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    color: "#4a5568",
    fontWeight: "700",
    fontSize: 28,
    marginBottom: 30,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  prompt: {
    fontSize: 20,
    paddingHorizontal: 30,
    paddingBottom: 20,
    textAlign: "center",
    color: "#2d3748",
  },

  message: {
    marginVertical: "50%",
    fontSize: 14,
    paddingHorizontal: 30,
    color: "#4a5568",
    textAlign: "center",
  },
  elevatorPitch: {
    paddingHorizontal: 30,
    fontSize: 16,
    textAlign: "center",
    color: "#2d3748",
  },

  termsLink: {
    fontSize: 14,
    textDecorationLine: "underline",
  },

  error: {
    color: "red",
  },
});
