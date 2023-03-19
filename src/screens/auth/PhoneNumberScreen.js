import React, { useState, useRef, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { t } from 'i18n-js';
import ButtonFilled from '../../components/ButtonFilled';
import PhoneInput from 'react-native-phone-number-input';
import { AuthContext } from '../../context/AuthProvider';
import { sendOTP } from '../../api/VerifyPhone';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '../../../App';
import { StatusBar } from 'expo-status-bar';

export default function PhoneNumberScreen({ navigation }) {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef(null);
  const { error, isLoading, setIsLoading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  /**
   * @todo, implement the verification backend in the context
   * sendSmsVerification
   */
  async function handleSignUp() {

    setIsLoading(true);
    // check if the user exist in our system
    sendOTP(formattedValue).then(() => {
      navigation.navigate('Otp', {
        phoneNumber: formattedValue,
      });
      setIsLoading(false);
    })

  }

  return (
    <>
      <StatusBar style={theme.statusbar} />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.wrapper}>
          <View style={styles.welcome}>
            <Image
              source={
                theme.theme === 'light'
                  ? require('./../../../assets/snack-icon.png')
                  : require('./../../../assets/snack-icon-dark.png')
              }
              style={styles.appName}
            />
            <Text style={[styles.pitch, { color: theme.text, opacity: 0.7 }]}>
              {t('auth.welcome_to_dukapp_app')}
            </Text>
            <TouchableOpacity
              style={{ marginHorizontal: 30 }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.verifyPhone, { color: theme.text, opacity: 0.7 }]}>
                {t('auth.verify_your_phone')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingTop: 10 }}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="RW"
              layout="second"
              onChangeText={(text) => {
                setValue(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              countryPickerProps={{ withAlphaFilter: true }}
              withShadow
              containerStyle={{ backgroundColor: "#CBD5E1", borderRadius: 100 }}
              textContainerStyle={{ backgroundColor: "#E2E8F0", borderRadius: 100 }}
              autoFocus
              autoFormat={true}
              initialCountry="rw"
            />
          </View>
          <Text style={[styles.carrierCharges, { color: theme.text, opacity: 0.7 }]}>
            {t('auth.carrier_charge_may_apply')}
          </Text>

          {error && <Text style={{ color: theme.danger }}>{error}</Text>}
          {isLoading && (
            <ActivityIndicator style={{ marginTop: 8 }} size="small" color={theme.primary} />
          )}

          <TouchableOpacity
            onPress={async () => {
              // Checking if the link is supported for links with custom URL scheme.
              const supported = await Linking.canOpenURL('https://butike.app');
            }}

          >
            <Text style={[styles.termsLink, { color: theme.text, opacity: 0.7 }]}>
              {t('common.terms_and_condition')}
            </Text>
          </TouchableOpacity>
          <ButtonFilled
            onPress={handleSignUp}
            color={theme.accent}
            labelColor={theme.text}
          >
            {t('auth.accept_tc_and_continue')}
          </ButtonFilled>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    width: 140,
    height: 130,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  pitch: {
    fontSize: 18,
    paddingHorizontal: 30,
    paddingBottom: 20,
    textAlign: 'center',
    color: '#718096',
  },
  verifyPhone: {
    color: '#718096',
    fontWeight: '700',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 20,
  },
  carrierCharges: {
    color: '#718096',
    fontWeight: '600',
    fontSize: 12,
    paddingTop: 20,
    fontStyle: 'italic',
  },
  message: {
    fontSize: 14,
    paddingHorizontal: 30,
    color: '#4a5568',
    textAlign: 'center',
  },
  button: {
    borderRadius: 3,
    fontWeight: 'bold',
    marginTop: 20,
    height: 50,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  welcome: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  status: {
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: 'gray',
  },
  termsLink: {
    fontSize: 14,
    marginTop: 30,
    textDecorationLine: 'underline',
  },
});
