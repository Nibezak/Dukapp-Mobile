import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { verifyOTP } from '../api/VerifyPhone';
import { getSetting, setSetting } from '../models/AsyncStorage';
import { migrateDatabase } from '../helpers/Database';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { Alert, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { doc, getDoc, setDoc } from '@firebase/firestore';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState();
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState()

  useEffect(() => {
    // Get data from the storage
    SecureStore.getItemAsync('user').then((storedUser) => {
      setUser(JSON.parse(storedUser));
    });

    // Get currency
    setSetting('app_default_currency', 'RWF').then(setCurrency);
    setSetting('app_default_payment_method', 'cash').then(setDefaultPaymentMethod);
  }, []);

  async function userLog(response) {
    const shop = response.data;
    const userResponse = {
      token: 'TO BE REPLACED TOKEN',
      id: shop.id,
      name: shop.name,
      username: shop.username,
      email: shop.email,
      // avatar: response.data.results[0].picture.thumbnail,
    };

    setUser(userResponse);
    setError(null);

    /** Securely store user information. */
    SecureStore.setItemAsync('user', JSON.stringify(userResponse));

    /** Run the migration immediately after successful login */
    migrateDatabase();

    /** Stop loading */
    setIsLoading(false);

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        setError,
        currency,
        isLoading,
        setIsLoading,
        register: (phone, code, email, password) => {
          setIsLoading(true);
          verifyOTP(phone, code).then((response) => userLog(response)).then(async () => {
            try {
              const user = await createUserWithEmailAndPassword(auth, email, password)
                .then(({ user }) => {
                  const dbRef = doc(db, "users", auth.currentUser.uid);
                  const data = {
                    database: []
                  };
                  data.userId = user.uid
                  setDoc(dbRef, data)
                })
            }
            catch (error) {
              switch (error.code) {
                case 'auth/email-already-in-use':
                  setError('This account is already registered')
                  break;
                case 'auth/invalid-email':
                  setError(`this account can't be registered try another one`);
                  break;
                case 'auth/operation-not-allowed':
                  setError(`Error during sign up.`);
                  break;
                case 'auth/weak-password':
                  setError(`Your password is weak minimum : 6 characters`);
                  break;
                default:
                  setError('Something went wrong , try reopening the application')
                  break;
              }
              setIsLoading(false);
            }
          })
        },
        loginFirebase: async (email, password) => {
          setIsLoading(true);
          try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            const userResponse = {
              token: 'TO BE REPLACED TOKEN',
              id: user.uid,
              name: user.displayName,
              username: user.email,
              email: user.email
            };
            setUser(userResponse)
            setError(null);
            /** Securely store user information. */
            await SecureStore.setItemAsync('user', JSON.stringify(userResponse));
            /** Run the migration immediately after successful login */
            migrateDatabase();
            /** Stop loading */
            setIsLoading(false);
          } catch (error) {
            switch (error.code) {
              case 'auth/email-already-in-use':
                setError('This account number is already registered')
                break;
              case 'auth/invalid-email':
                setError(`this account is invalid, try another one`);
                break;
              case 'auth/user-not-found':
                setError(`this account is not found, try another one`);
                break;
              case 'auth/too-many-requests':
                setError(`Too many attempts , try again shortly`);
                break;

              case 'auth/operation-not-allowed':
                setError(`Error during sign up.`);
                break;
              default:
                setError('Something went wrong , try reopening the application')
                break;
            }

            setIsLoading(false);
          }
        },
        logout: () => {
          setIsLoading(true);

          async function handleLogout() {
            signOut(auth).then(() => {
              setUser(null);
              SecureStore.deleteItemAsync('user').then(() => {
                ToastAndroid.show('You have logged out', ToastAndroid.SHORT);
              })
            }).catch((error) => {
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
            });
          }

          Alert.alert(
            'Want to Logout ?',
            'Are you sure you want to Logout',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'CANCEL',
              },
              { text: 'Log out', onPress: () => handleLogout() },
            ]
          );
          setError(null);
          setIsLoading(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider >
  );
};


