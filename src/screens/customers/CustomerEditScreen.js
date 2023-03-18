import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { t } from 'i18n-js';
import FieldText from '../../components/FieldText';
import Button from '../../components/Button';
import { Formik } from 'formik';
import validationSchema from '../../helpers/validation/customerValidation.js';
import CustomerService from '../../services/CustomerService';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '../../../App';
import ButtonFilled from '../../components/ButtonFilled';

export default function CustomerEditScreen({ navigation, route }) {
  // Retrieve Customer
  const [customer, setCustomer] = useState(route.params.customer);
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
  async function handleSaveCustomer(customerToUpdate) {
    // Record customer in the DB
    const lastCustomerId = await CustomerService.save(customerToUpdate);
    return navigation.goBack();
  }

  /**
   * Get customer from DB
   */
  async function handDeleteCustomer() {
    CustomerService.destroy(customer);
    navigation.goBack();
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Formik
        initialValues={{
          names: customer.names,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          note: customer.note,
        }}
        onSubmit={(values) => {
          /** Construct new customer object */
          let customerToUpdate = customer;

          // Overwrite any Change that has been done in
          // the current state
          customerToUpdate.names = values.names;
          customerToUpdate.phone = values.phone;
          customerToUpdate.email = values.email;
          customerToUpdate.address = values.address;
          customerToUpdate.note = values.note;
          handleSaveCustomer(customerToUpdate);
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
                placeholder={t('customer.names')}
              />
            </View>
            {errors.names && touched.names && (
              <Text style={{ fontSize: 13, color: 'red', marginLeft: 20 }}>{errors.names}</Text>
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
            {errors.phone && touched.phone && (
              <Text style={{ fontSize: 13, color: 'red', marginLeft: 20 }}>{errors.phone}</Text>
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
            {errors.email && touched.email && (
              <Text style={{ fontSize: 13, color: 'red', marginLeft: 20 }}>{errors.email}</Text>
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
            {errors.address && touched.address && (
              <Text style={{ fontSize: 13, color: 'red', marginLeft: 20 }}>{errors.address}</Text>
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
            {errors.note && touched.note && (
              <Text style={{ fontSize: 13, color: 'red', marginLeft: 20 }}>{errors.note}</Text>
            )}
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <ButtonFilled
                onPress={handDeleteCustomer}
                color={theme.danger}
                labelColor={theme.text}
              >
                {t('common.delete')}
              </ButtonFilled>
              <ButtonFilled onPress={handleSubmit} color={theme.primary} labelColor={theme.text}>
                {t('common.save')}
              </ButtonFilled>
              {/* <Button onPress={handDeleteCustomer} color={'#f1f1f1'} backgroundColor={'#ef4444'}>
              </Button> */}
              {/* <Button onPress={handleSubmit} color={'#f1f1f1'} backgroundColor={'#47a67f'}>
                {t('common.save')}
              </Button> */}
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly',
  },
});
