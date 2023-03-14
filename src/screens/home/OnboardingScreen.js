import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RadioForm from 'react-native-simple-radio-button';
import { ScrollView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import { validationSchema } from '../../helpers/validation/onBoardValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { OnboardFlow } from 'react-native-onboard';
import Customer from '../../models/Customer';
import Item from '../../models/Item';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';
import Supplier from '../../models/Supplier';
import { t } from 'i18n-js';

export function OnboardingScreen() {
  const [currencyValue, setCurrencyValue] = useState('RWF');
  const [paymentValue, setPaymentValue] = useState('cash');
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    /**
     * Redirect if the settings existings already.
     * No need to show the form if settings
     * exist in the local database
     */
    redirectIfSettingsExist();
  }, []);

  var currencyOptions = [
    { label: 'RWF', value: 'RWF' },
    { label: 'KES', value: 'KES' },
    { label: 'UGX', value: 'UGX' },
  ];
  var paymentOptions = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Momo', value: 'mobile_mtn_momo' },
    { label: 'Airtel', value: 'mobile_airtel_money' },
    { label: 'Credit', value: 'credit' },
  ];

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
  async function handleSavingSettings(data) {
    const { name, address, email, businessName, tin } = data;
    AsyncStorage.setItem('@business_name', businessName);
    AsyncStorage.setItem('@contact_address', address);
    AsyncStorage.setItem('@contact_person', name);
    AsyncStorage.setItem('@contact_email', email);
    AsyncStorage.setItem('@app_default_currency', currencyValue);
    AsyncStorage.setItem('@app_default_payment_method', paymentValue)
      .then(() => handleCreateMigrations())
      .then((result) => {
        ToastAndroid.show(t('setting.setting_updated'), ToastAndroid.SHORT);
        return navigation.navigate('home');
      });
  }
  async function handleCreateMigrations() {
    // 1. create all necessary tables all tables
    Customer.createTable();
    Item.createTable();
    Order.createTable();
    OrderItem.createTable();
    Supplier.createTable();
  }
  if (showLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
      </View>
    );
  }
  return (
    <>
      <View>
        <OnboardFlow
          pages={[
            {
              title: 'Welcome',
              subtitle: 'Thank you for choosing to work with Dukapp, Just a few more steps to go',
              imageUri: Image.resolveAssetSource(
                require('./../../../assets/WelcomeAnimation/welcomejoyride.png')
              ).uri,
            },
            {
              title: 'Safe and Secure',
              subtitle:
                'Your account is Safe and Secure from any outsiders, ... however , you can not logout unless you uninstall the application',
              imageUri: Image.resolveAssetSource(
                require('./../../../assets/WelcomeAnimation/welcomesecurestep.png')
              ).uri,
            },
            {
              title: 'One Final Step to Complete',
              subtitle: 'Set up your profile details on the next page, and you are good to go.',
              imageUri: Image.resolveAssetSource(
                require('./../../../assets/WelcomeAnimation/welcomelaststep.png')
              ).uri,
            },
          ]}
          type="fullscreen" // Change to either 'fullscreen', 'bottom-sheet', or 'inline'
        />
      </View>

      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.subtitle}>Create a profile to manage your shop even faster</Text>
          <Formik
            initialValues={{
              name: '',
              address: '',
              email: '',
              businessName: '',
              tin: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleSavingSettings(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="Business name"
                  value={values.businessName}
                  onChangeText={handleChange('businessName')}
                  onBlur={handleBlur('businessName')}
                />
                {errors.businessName && <Text style={styles.error}>{errors.businessName}</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="Address (optional)"
                  value={values.address}
                  onChangeText={handleChange('address')}
                />
                {errors.address && <Text style={styles.error}>{errors.address}</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="TIN (optional)"
                  value={values.tin}
                  onChangeText={handleChange('tin')}
                />
                {errors.tin && <Text style={styles.error}>{errors.tin}</Text>}
                <View style={styles.subview}>
                  <Text style={styles.subheading2}>Default currency</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <RadioForm
                    radio_props={currencyOptions}
                    initial={'RWF'}
                    onPress={(value) => setCurrencyValue(value)}
                    buttonColor="black"
                    labelColor="black"
                    selectedButtonColor="#11E05B"
                    selectedLabelColor="#11E05B"
                    labelHorizontal={false}
                    formHorizontal
                  />
                </View>

                <View style={styles.subview}>
                  <Text style={styles.subheading2}>Default payment method</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <RadioForm
                    radio_props={paymentOptions}
                    initial={'Cash'}
                    onPress={(value) => setPaymentValue(value)}
                    buttonColor="black"
                    labelColor="black"
                    selectedButtonColor="#11E05B"
                    selectedLabelColor="#11E05B"
                    labelHorizontal={false}
                    formHorizontal
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity style={styles.done} onPress={handleSubmit}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Start</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 5,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  subview: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E293B',
  },
  subheading2: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    color: '#64748B',
  },
  subheading: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 40,
    color: '#64748B',
  },
  subtitle: {
    paddingRight: 70,
    fontSize: 16,
    marginBottom: 40,
    color: '#64748B',
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 0.7,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  done: {
    backgroundColor: 'black',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 70,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  error: {
    color: '#ef4444',
  },
});
