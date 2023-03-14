import React, { useState, useRef, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import { t } from 'i18n-js';
import ButtonFilled from '../../components/ButtonFilled';
import PhoneInput from 'react-native-phone-number-input';
import { Formik } from 'formik';
import registerValidationSchema from '../../helpers/validation/registerValidation';
import { AuthContext } from '../../context/AuthProvider';
import { sendOTP } from '../../api/VerifyPhone';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import ShowPassword from '../../components/ShowPassword';
import { setDoc, doc } from 'firebase/firestore';

export default function PhoneNumberScreen({ navigation }) {
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef(null);
  let [userExist, setUserExist] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toggleSwitch = () => setShowPassword((previousState) => !previousState);

  const { error, isLoading, setIsLoading } = useContext(AuthContext);

  /**
   * @todo, implement the verification backend in the context
   * sendSmsVerification
   */
  async function handleSignUp(data) {
    const { password, phone } = data;
    const email = `${phone}@dukapp.com`;
    setIsLoading(true);
    // check if the user exist in our system
    await fetchSignInMethodsForEmail(auth, email).then((signInMethods) => {
      if (signInMethods.length > 0) {
        setIsLoading(false);
        return setValidationMessage('This account is already registered');
      } else {
        //   Send SMS to verify this phone
        sendOTP(formattedValue.substring(1, 13))
          .then((sent) => {
            setIsLoading(false);
            navigation.navigate('Otp', {
              phoneNumber: formattedValue,
              email: email,
              password: password,
            });
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
          });
      }
    });
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.welcome}>
            <Image source={require('./../../../assets/snack-icon.png')} style={styles.appName} />
            <Text style={styles.pitch}>{t('auth.welcome_to_dukapp_app')}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.verifyPhone}>sign up to your shop</Text>
              <Text style={{ color: '#3498db', marginLeft: 20, fontSize: 17, marginTop: 20 }}>
                or
              </Text>
              <TouchableOpacity
                style={{ marginHorizontal: 30, marginTop: 20 }}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={{ color: '#47a67f', fontSize: 15, fontWeight: 'bold' }}>
                  {'Sign in '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Formik
            initialValues={{ phone: '', password: '', confirmPassword: '' }}
            onSubmit={(values) => {
              handleSignUp(values);
            }}
            validationSchema={registerValidationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={values.phone}
                  defaultCode="RW"
                  layout="first"
                  onChangeText={handleChange('phone')}
                  onChangeFormattedText={(text) => {
                    setFormattedValue(text);
                  }}
                  textInputProps={{
                    onBlur: handleBlur('phone'),
                  }}
                  countryPickerProps={{ withAlphaFilter: true }}
                  withShadow
                  autoFocus
                  autoFormat={true}
                  initialCountry="rw"
                />
                {touched.phone && errors.phone && (
                  <Text style={{ color: 'red' }}>{errors.phone}</Text>
                )}
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />

                {touched.password && errors.password && (
                  <Text style={{ color: 'red' }}>{errors.password}</Text>
                )}
                <TextInput
                  style={styles.confirmPasswordInput}
                  placeholder="Confirm your password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>
                )}

                <ShowPassword
                  onValueChange={toggleSwitch}
                  value={showPassword}
                  title={'show password'}
                />
                {validationMessage && <Text style={{ color: 'red' }}>{validationMessage}</Text>}
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Text style={styles.carrierCharges}>{t('auth.carrier_charge_may_apply')}</Text>
                </View>
                {isLoading && (
                  <ActivityIndicator style={{ marginTop: 8 }} size="small" color="gray" />
                )}

                <TouchableOpacity
                  onPress={async () => {
                    // Checking if the link is supported for links with custom URL scheme.
                    const supported = await Linking.canOpenURL('https://butike.app');
                  }}
                >
                  <Text style={styles.termsLink}>{t('common.terms_and_condition')}</Text>
                </TouchableOpacity>
                <ButtonFilled onPress={handleSubmit}>
                  {t('auth.accept_tc_and_continue')}
                </ButtonFilled>
                {/* <Button title="Submit" onPress={handleSubmit} /> */}
              </View>
            )}
          </Formik>
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
    paddingTop: 3,
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
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  passwordInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    width: 300,
    padding: 10,
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 10,
    elevation: 2,
  },
  confirmPasswordInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    width: 300,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
  },
});
