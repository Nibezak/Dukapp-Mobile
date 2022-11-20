import React, { useState, useRef, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { t } from "i18n-js";
import ButtonFilled from "../../components/ButtonFilled";
import PhoneInput from "react-native-phone-number-input";
import { AuthContext } from "../../context/AuthProvider";
import { sendOTP } from "../../api/VerifyPhone";

export default function PhoneNumberScreen({ navigation }) {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef(null);
  const { error, isLoading, setIsLoading } = useContext(AuthContext);

  /**
   * @todo, implement the verification backend in the context
   * sendSmsVerification
   */
  async function handleSendSmsVerification() {
    setIsLoading(true);
    //   Send SMS to verify this phone
    sendOTP(formattedValue.substring(1, 13))
      .then((sent) => {
        setIsLoading(false);
        navigation.navigate("Otp", {
          phoneNumber: formattedValue,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.welcome}>
            <Text style={styles.appName}>{"Butike"}</Text>
            <Text style={styles.pitch}>{t("auth.welcome_to_butike_app")}</Text>
            <Text style={styles.verifyPhone}>
              {t("auth.verify_your_phone")}
            </Text>
          </View>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="RW"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            countryPickerProps={{ withAlphaFilter: true }}
            withShadow
            autoFocus
            autoFormat={true}
            initialCountry="rw"
          />

          <Text style={styles.carrierCharges}>
            {t("auth.carrier_charge_may_apply")}
          </Text>

          {error && <Text style={{ color: "red" }}>{error}</Text>}
          {isLoading && (
            <ActivityIndicator
              style={{ marginTop: 8 }}
              size="small"
              color="gray"
            />
          )}

          <TouchableOpacity
            onPress={async () => {
              // Checking if the link is supported for links with custom URL scheme.
              const supported = await Linking.canOpenURL("https://butike.app");
            }}
          >
            <Text style={styles.termsLink}>
              {t("common.terms_and_condition")}
            </Text>
          </TouchableOpacity>
          <ButtonFilled onPress={handleSendSmsVerification}>
            {t("auth.accept_tc_and_continue")}
          </ButtonFilled>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    color: "#4a5568",
    fontWeight: "700",
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 30,
  },
  pitch: {
    fontSize: 18,
    paddingHorizontal: 30,
    paddingBottom: 20,
    textAlign: "center",
    color: "#718096",
  },
  verifyPhone: {
    color: "#718096",
    fontWeight: "700",
    fontSize: 16,
    alignSelf: "center",
    marginTop: 20,
  },
  carrierCharges: {
    color: "#718096",
    fontWeight: "600",
    fontSize: 12,
    paddingTop: 20,
    fontStyle: "italic",
  },
  message: {
    fontSize: 14,
    paddingHorizontal: 30,
    color: "#4a5568",
    textAlign: "center",
  },
  button: {
    borderRadius: 3,
    fontWeight: "bold",
    marginTop: 20,
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d3748",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 14,
  },
  welcome: {
    padding: 20,
  },
  status: {
    padding: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    color: "gray",
  },
  termsLink: {
    fontSize: 14,
    marginTop: 30,
    textDecorationLine: "underline",
  },
});
