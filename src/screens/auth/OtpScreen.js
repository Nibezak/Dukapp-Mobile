import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, Image, Text } from 'react-native';
import { t } from 'i18n-js';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { AuthContext } from '../../context/AuthProvider';
import ButtonFilled from '../../components/ButtonFilled';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemeContext } from '../../../App';

export default function OtpScreen({ route, navigation }) {
  const { phoneNumber } = route.params;

  const [invalidCode, setInvalidCode] = useState(false);
  const { login, isLoading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

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
    <SafeAreaView style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <KeyboardAwareScrollView>
        <Image
          source={
            theme.theme === 'light'
              ? require('./../../../assets/snack-icon.png')
              : require('./../../../assets/snack-icon-dark.png')
          }
          style={styles.appName}
        />
        <Text style={[styles.prompt, { color: theme.text, fontWeight: 'bold' }]}>
          {t('auth.otp_title')}
        </Text>
        <Text style={[styles.message, { color: theme.text, opacity: 0.7 }]}>
          {t('auth.Your_phone_will_be_used_to_protect_your_account_each_time_you_log_in', {
            phone_number: phoneNumber,
          })}
        </Text>
        <ButtonFilled
          onPress={() => navigation.goBack()}
          labelColor={theme.text}
          color={theme.accent}
        >
          {t('auth.edit_phone_number')}
        </ButtonFilled>

        {isLoading && (
          <ActivityIndicator style={{ margin: 8 }} size="small" color={theme.primary} />
        )}

        <OTPInputView
          style={{ width: '70%', height: 150, alignSelf: 'center' }}
          pinCount={6}
          autoFocusOnLoad
          codeInputFieldStyle={[
            styles.underlineStyleBase,
            { color: theme.text, borderColor: theme.colorIcon },
          ]}
          codeInputHighlightStyle={{ borderColor: theme.text }}
          onCodeFilled={handleOtpVerification}
          // placeholderCharacter="_"
        />
        {invalidCode && (
          <Text style={[styles.error, { color: theme.danger }]}>{t('auth.incorrect_code')}</Text>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    width: 140,
    height: 130,
    alignSelf: 'center',
    marginBottom: 10,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    // color: '#2d3748',
    fontSize: 20,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  prompt: {
    fontSize: 24,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },

  message: {
    fontSize: 16,
    paddingHorizontal: 30,
    color: '#4a5568',
  },

  error: {
    color: 'red',
  },
});
