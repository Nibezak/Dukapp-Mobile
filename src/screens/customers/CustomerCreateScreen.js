import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import FieldText from '../../components/FieldText';
import Button from '../../components/Button';
import { t } from 'i18n-js';
import { Formik } from 'formik';
import validationSchema from '../../helpers/validation/customerValidation.js';
import OrderService from '../../services/OrderService';
import CustomerService from '../../services/CustomerService';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemeContext } from '../../../App';
import ButtonFilled from '../../components/ButtonFilled';

export default function CustomerCreateScreen({ navigation, route }) {
  // Set order if available
  const [customers, setCustomers] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: theme.text,
      headerStyle: {
        backgroundColor: theme.accent,
      },
    });
  }, [theme]);
  /**
   * Save a Customer in DB
   */
  async function handleSaveCustomer(newCustomer) {
    /** Construct new customer object */
    // const newCustomer = {
    //   names: names,
    //   phone: phone,
    //   email: email,
    //   address: address,
    //   note: note,
    // };

    // 1. Record customer in the DB
    CustomerService.save(newCustomer).then((result) => {
      // 2. Add customer to the order if that's the case
      if (route.params?.order) {
        const customerId = result.insertId;
        const order = route.params.order;
        OrderService.addCustomerToOrder(order.id, customerId);
      }
    });

    // Redirect after adding customer
    navigation.goBack();
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAwareScrollView>
        <Formik
          initialValues={{ names: '', phone: '', email: '', address: '', note: '' }}
          onSubmit={(values) => {
            const newCustomer = {
              names: values.names,
              phone: values.phone,
              email: values.email,
              address: values.address,
              note: values.note,
            };
            handleSaveCustomer(newCustomer);
          }}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.row}>
                <FieldText
                  autoFocus={true}
                  title={t('customer.names')}
                  value={values.names}
                  onChangeText={handleChange('names')}
                  onBlur={handleBlur('names')}
                  underlineColorAndroid="transparent"
                  placeholder={t('common.example_name')}
                />
              </View>
              {touched.names && errors.names && (
                <Text style={{ color: 'red', marginLeft: 20 }}>
                  {t(`customerValidation.${errors.names}`)}
                </Text>
              )}
              <View style={styles.row}>
                <FieldText
                  title={t('customer.phone')}
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  keyboardType={'phone-pad'}
                  underlineColorAndroid="transparent"
                  placeholder={t('customer.phone')}
                />
              </View>
              {touched.phone && errors.phone && (
                <Text style={{ color: 'red', marginLeft: 20 }}>
                  {t(`customerValidation.${errors.phone}`)}
                </Text>
              )}
              <View style={styles.row}>
                <FieldText
                  title={t('customer.email')}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType={'email-address'}
                  underlineColorAndroid="transparent"
                  placeholder={t('customer.email')}
                />
              </View>
              {touched.email && errors.email && (
                <Text style={{ color: 'red', marginLeft: 20 }}>
                  {t(`customerValidation.${errors.email}`)}
                </Text>
              )}
              <View style={styles.row}>
                <FieldText
                  title={t('customer.address')}
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  underlineColorAndroid="transparent"
                  placeholder={t('customer.address')}
                />
              </View>
              {touched.address && errors.address && (
                <Text style={{ color: 'red', marginLeft: 20 }}>
                  {t(`customerValidation.${errors.address}`)}
                </Text>
              )}
              <View style={styles.row}>
                <FieldText
                  title={t('customer.note')}
                  numberOfLines={5}
                  value={values.note}
                  onChangeText={handleChange('note')}
                  onBlur={handleBlur('note')}
                  underlineColorAndroid="transparent"
                  placeholder={t('customer.enter_customer_note')}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    borderWidth: 0.5,
                    borderColor: '#e2e8f0',
                  }}
                />
              </View>
              <View style={[styles.row, { borderBottomWidth: 0, justifyContent: 'space-evenly' }]}>
                <ButtonFilled
                  onPress={() => navigation.goBack()}
                  color={'#f59e0b'}
                  labelColor={theme.text}
                >
                  {t('common.cancel')}
                </ButtonFilled>
                <ButtonFilled onPress={handleSubmit} color={theme.primary} labelColor={theme.text}>
                  {t('common.save')}
                </ButtonFilled>
                {/* <Button
                  onPress={() => navigation.goBack()}
                  color={'#f1f1f1'}
                  backgroundColor={'#f59e0b'}
                >
                </Button> */}
                {/* <Button
                  onPress={handleSubmit}
                  color={'#f1f1f1'}
                  backgroundColor={'#47a67f'}
                ></Button> */}
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
});
