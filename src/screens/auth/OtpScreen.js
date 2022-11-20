import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { t } from "i18n-js";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { AuthContext } from "../../context/AuthProvider";
import ButtonFilled from "../../components/ButtonFilled";

export default function OtpScreen({ route, navigation }) {
  const { phoneNumber } = route.params;
  const [invalidCode, setInvalidCode] = useState(false);
  const { login, isLoading } = useContext(AuthContext);

  /**
   * handle Verification
   *
   * @param {string} code
   * @returns
   */
  async function handleOtpVerification(code) {
    login(phoneNumber, code);
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.appName}>{"Butike"}</Text>
      <Text style={styles.prompt}>Enter the code we sent you</Text>
      <Text style={styles.message}>
        {t(
          "auth.Your_phone_will_be_used_to_protect_your_account_each_time_you_log_in",
          { phone_number: phoneNumber }
        )}
      </Text>
      <ButtonFilled onPress={() => navigation.goBack()}>
        {t("auth.edit_phone_number")}
      </ButtonFilled>

      {isLoading && (
        <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
      )}

      <OTPInputView
        style={{ width: "80%", height: 200 }}
        pinCount={6}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={handleOtpVerification}
        placeholderCharacter="_"
      />
      {invalidCode && (
        <Text style={styles.error}>{t("auth.incorrect_code")}</Text>
      )}
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
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 30,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "#2d3748",
    fontSize: 20,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  prompt: {
    fontSize: 24,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },

  message: {
    fontSize: 16,
    paddingHorizontal: 30,
    color: "#4a5568",
  },

  error: {
    color: "red",
  },
});
