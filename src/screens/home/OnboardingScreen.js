import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { useEffect, useState } from 'react';
import { SafeAreaView, ToastAndroid, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import FieldText from '../../components/FieldText';

export function OnboardingScreen() {
  /** Access navigation. It is needed for redirection */
  const navigation = useNavigation();

  /** Set states for the settings input */
  const [businessName, setBusinessName] = useState(null);
  const [address, setAddress] = useState(null);
  const [shopOwnerName, setShopOwnerName] = useState(null);
  const [email, setEmail] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);

  useEffect(() => {
    /**
     * Redirect if the settings existings already.
     * No need to show the form if settings
     * exist in the local database
     */

    redirectIfSettingsExist();
  }, []);

  /**
   * This function redirects to the home screen
   * if the settings existing in the database
   * Already, otherwise it let the user
   * register new settings
   */
  async function redirectIfSettingsExist() {
    // 1. Fetch settings from the database
    AsyncStorage.getItem('@business_name').then((result) => {
      console.log(result);
      if (result !== null) {
        return navigation.navigate('home');
      }
    });
  }

  /**
   * Persist newly added settings in the database
   */
  async function handleSavingSettings() {
    AsyncStorage.setItem('@business_name', businessName);
    AsyncStorage.setItem('@contact_address', address);
    AsyncStorage.setItem('@contact_person', shopOwnerName);
    AsyncStorage.setItem('@contact_email', email);
    AsyncStorage.setItem('@app_default_currency', currency);
    AsyncStorage.setItem('@app_default_payment_method', defaultPaymentMethod).then((result) => {
      console.log(result);
      ToastAndroid.show(t('setting.setting_updated'), ToastAndroid.SHORT);

      return navigation.navigate('home');
    });
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Business Name */}
      <FieldText
        title={t('setting.shop_name')}
        value={businessName}
        onChangeText={setBusinessName}
        underlineColorAndroid="transparent"
        placeholder={t('setting.shop_name_placeholder')}
      />

      {/* Business Address */}
      <FieldText
        title={t('setting.address')}
        value={address}
        onChangeText={setAddress}
        underlineColorAndroid="transparent"
        placeholder={t('setting.address_placeholder')}
      />

      {/* Business Owner Name */}

      <FieldText
        title={t('setting.shop_owner_name')}
        value={shopOwnerName}
        onChangeText={setShopOwnerName}
        underlineColorAndroid="transparent"
        placeholder={t('setting.shop_owner_name_placeholder')}
      />

      {/* Business Email */}

      <FieldText
        title={t('setting.email')}
        value={email}
        onChangeText={setEmail}
        underlineColorAndroid="transparent"
        placeholder={t('setting.email_placeholder')}
      />

      {/* Business Currency */}

      <FieldText
        title={t('setting.default_currency')}
        value={currency}
        onChangeText={setCurrency}
        underlineColorAndroid="transparent"
        placeholder={t('setting.email_placeholder')}
      />

      {/* Business Default Payment Method */}

      <FieldText
        title={t('setting.default_payment_method')}
        value={defaultPaymentMethod}
        onChangeText={setDefaultPaymentMethod}
        underlineColorAndroid="transparent"
        placeholder={t('setting.default_payment_method_placeholder')}
      />

      <Button onPress={handleSavingSettings} color={'#15803d'}>
        {t('common.save')}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  appName: {
    color: '#4a5568',
    fontWeight: '700',
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
    textAlign: 'center',
    color: '#2d3748',
  },

  message: {
    marginVertical: '50%',
    fontSize: 14,
    paddingHorizontal: 30,
    color: '#4a5568',
    textAlign: 'center',
  },
  elevatorPitch: {
    paddingHorizontal: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#2d3748',
  },

  termsLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  error: {
    color: 'red',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    justifyContent: 'space-between',
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
});
