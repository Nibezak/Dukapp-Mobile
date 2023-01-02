import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { useEffect, useState } from 'react';
import { SafeAreaView, ToastAndroid, StyleSheet, ActivityIndicator, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from "@react-native-picker/picker";
import Button from '../../components/Button';
import InputText from '../../components/InputText';

export function OnboardingScreen() {
  /** Access navigation. It is needed for redirection */
  const navigation = useNavigation();

  /** Set states for the settings input */
  const [businessName, setBusinessName] = useState(null);
  const [address, setAddress] = useState(null);
  const [shopOwnerName, setShopOwnerName] = useState(null);
  const [email, setEmail] = useState(null);
  const [currency, setCurrency] = useState('');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  /** This state determines if we need to show the loading screen */
  const [showLoading, setShowLoading] = useState(true);

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
    /**
     * Get settings from the local database. If we have a business name
     * in the database this assumes that the rest of the settings
     * exist in the database
     */
    AsyncStorage.getItem('@business_name').then((result) => {
      if (result !== null) {
        /** Settings exist, redirect to home */
        return navigation.navigate('home');
      }

      /** Hide loading indicator */
      setShowLoading(false);
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



  /**
   * If the state hasn't finished loading, display activity indicator.
   */
  if (showLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
      </View>
    );
  }


  /**
   *  For us to reach here it means that the state has finished loading and we are able to proceed
   *  by displaying the form for settings
   */
  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Business Name */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
        <Image source={require('./../../../assets/snack-icon.png')} style={{ width: 120, height: 100 }} />
        <TouchableOpacity style={{ marginTop: 40, marginRight: 130 }} onPress={handleSavingSettings}>
          <AntDesign name="check" size={24} color="#47a67f" />
        </TouchableOpacity>
      </View>
      <InputText
        title={t('setting.shop_name')}
        value={businessName}
        onChangeText={setBusinessName}
        underlineColorAndroid="transparent"
        placeholder={t('setting.shop_name_placeholder')}
      />

      {/* Business Address */}
      <InputText
        title={t('setting.address')}
        value={address}
        onChangeText={setAddress}
        underlineColorAndroid="transparent"
        placeholder={t('setting.address_placeholder')}
      />

      {/* Business Owner Name */}

      <InputText
        title={t('setting.shop_owner_name')}
        value={shopOwnerName}
        onChangeText={setShopOwnerName}
        underlineColorAndroid="transparent"
        placeholder={t('setting.shop_owner_name_placeholder')}
      />

      {/* Business Email */}

      <InputText
        title={t('setting.email')}
        value={email}
        onChangeText={setEmail}
        underlineColorAndroid="transparent"
        placeholder={t('setting.email_placeholder')}
      />

      {/* Business Currency */}

      {/* <InputText
        title={t('setting.default_currency')}
        value={currency}
        onChangeText={setCurrency}
        underlineColorAndroid="transparent"
        placeholder={t('setting.email_placeholder')}
      /> */}

      {/* Business Default Payment Method */}

      {/* <InputText
        style={styles.input}
        title={t('setting.default_payment_method')}
        value={defaultPaymentMethod}
        onChangeText={setDefaultPaymentMethod}
        underlineColorAndroid="transparent"
        placeholder={t('setting.default_payment_method_placeholder')}
      /> */}

      <Picker
        selectedValue={currency}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        prompt="Select a language"
        mode="dropdown"
        dialogueBoxStyle={styles.dialogueBox}
        onValueChange={(itemValue, itemIndex) => setCurrency(itemValue)}>
        <Picker.Item label="RWF" value="RWF" style={{ color: "green", fontWeight: "bold" }} />
        <Picker.Item label="KES" value="KES" style={{ color: "orange", fontWeight: "bold" }} />
        <Picker.Item label="USD" value="USD" style={{ color: "green", fontWeight: "bold" }} />
      </Picker>

      <Picker
        selectedValue={defaultPaymentMethod}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        prompt="Select Default Payment Method"
        mode="dropdown"
        dialogueBoxStyle={styles.dialogueBox}
        onValueChange={(itemValue, itemIndex) => setDefaultPaymentMethod(itemValue)}>
        <Picker.Item label="CASH" value="CASH" style={{ color: "green", fontWeight: "bold" }} />
        <Picker.Item label="MOMO" value="MOMO" style={{ color: "orange", fontWeight: "bold" }} />
        <Picker.Item label="AIRTEL-MONEY" value="AIRTEL-MONEY" style={{ color: "red", fontWeight: "bold" }} />
        <Picker.Item label="CASH" value="CASH" style={{ color: "green", fontWeight: "bold" }} />
        <Picker.Item label="M-PESA" value="M-PESA" style={{ color: "green", fontWeight: "bold" }} />
        <Picker.Item label="CREDIT" value="CREDIT" style={{ color: "green", fontWeight: "bold" }} />
        <Picker.Item label="OTHERS" value="OTHERS" style={{ color: "green", fontWeight: "bold" }} />
      </Picker>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 10,
    width: 500,
  },
  picker: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    flexDirection: "row",
    width: "70%",
    padding: 10,
    marginVertical: 10,
    justifyContent: "center"
  },
  pickerItem: {
    color: '#000',
    fontSize: 18,
  },
  dialogueBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
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
