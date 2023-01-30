import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ToastAndroid,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  Text,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/Button';
import FieldText from '../../components/FieldText';
import InputSelect from '../../components/InputSelect';
import Customer from '../../models/Customer';
import Item from '../../models/Item';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';
import Supplier from '../../models/Supplier';

export function OnboardingScreen() {
  /** Access navigation. It is needed for redirection */
  const navigation = useNavigation();

  /** Set states for the settings input */
  const [businessName, setBusinessName] = useState('Dukapp-Store');
  const [address, setAddress] = useState('KK 509 ST GIK');
  const [shopOwnerName, setShopOwnerName] = useState('Nibeza Kevin');
  const [email, setEmail] = useState('email@example.com');
  const [currency, setCurrency] = useState('RWF');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('CASH');
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
    AsyncStorage.setItem('@app_default_payment_method', defaultPaymentMethod).then(() => handleCreateMigrations()).then((result) => {
      ToastAndroid.show(t('setting.setting_updated'), ToastAndroid.SHORT);
      return navigation.navigate('home');
    });
  }
  async function handleCreateMigrations() {
    // 1. Drop all tables
    Customer.createTable();
    Item.createTable();
    Order.createTable();
    OrderItem.createTable();
    Supplier.createTable();

    // ToastAndroid.show(t("setting.database_has_been_reset"), ToastAndroid.SHORT);
  }
  var paymentOptions = [
    { value: "cash", label: "Cash" },
    { value: "mobile_mtn_momo", label: "MTN MoMo" },
    { value: "mobile_airtel_money", label: "Airtel Money" },
    { value: "mobile_mpesa", label: "M-Pesa" },
    { value: "credit", label: "Credit" },
    { value: "others", label: "Others" },
  ];

  var currencyOptions = [
    { value: "RWF", label: "RWF" },
    { value: "KES", label: "KES" },
    { value: "USD", label: "USD" },
    { value: "UGX", label: "UGX" },
  ];

  // function handleSetPayment(value, index) {
  //   const paymentOption = paymentOptions[index];
  //   setDefaultPaymentMethod(paymentOption.value);
  // }
  // function handleSetCurrency(value, index) {
  //   const currencyOption = currencyOptions[index];
  //   setCurrency(currencyOptions.value);
  // }

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
      <ScrollView>
        {/* Business Name */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image
            source={require('./../../../assets/snack-icon.png')}
            style={{ width: 120, height: 100 }}
          />
        </View>
        <FieldText
          title={t('setting.shop_name')}
          value={businessName}
          onChangeText={setBusinessName}
          underlineColorAndroid="transparent"
          placeholder={"Shop Name"}
        />

        {/* Business Address */}
        <FieldText
          title={t('setting.address')}
          value={address}
          onChangeText={setAddress}
          underlineColorAndroid="transparent"
          placeholder={"KK 509 ST"}
        />

        {/* Business Owner Name */}

        <FieldText
          title={t('setting.shop_owner_name')}
          value={shopOwnerName}
          onChangeText={setShopOwnerName}
          underlineColorAndroid="transparent"
          placeholder={'Nibeza Kevin'}
        />

        {/* Business Email */}

        <FieldText
          title={t('setting.email')}
          value={email}
          onChangeText={setEmail}
          underlineColorAndroid="transparent"
          keyboardType="email-address"
          placeholder={"email@example.com"}
        />

        <View style={{ width: "50%" }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start", paddingVertical: 10, marginHorizontal: 10 }}>
            <Text style={{ fontWeight: "semibold", fontSize: 15, color: "#62656b" }}>
              Default Currency
            </Text>
          </View>
          <InputSelect
            mode={"dropdown"}
            selectedValue={currency}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) =>
              setCurrency(itemValue)
            }
            options={currencyOptions}
          />
        </View>

        <View style={{ width: "70%" }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start", paddingVertical: 10, marginHorizontal: 10 }}>
            <Text style={{ fontWeight: "semibold", fontSize: 15, color: "#62656b" }}>
              Default Payment Method
            </Text>
          </View>
          <InputSelect
            mode={"dropdown"}
            selectedValue={defaultPaymentMethod}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) =>
              setDefaultPaymentMethod(itemValue, itemIndex)
            }
            options={paymentOptions}
          />
        </View>
        <View style={{ width: "70%", paddingVertical: 10, marginVertical: 10, flexDirection: "row", justifyContent: "center" }}>
          <View style={{ width: "50%" }}>
            <Button onPress={handleSavingSettings} color={"#f1f1f1"} backgroundColor={"#47a67f"}>
              {t("common.save")}
            </Button>
          </View>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    width: '70%',
    padding: 10,
    marginVertical: 10,
    justifyContent: 'center',
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