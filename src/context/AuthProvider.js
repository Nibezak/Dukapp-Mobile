import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { verifyOTP } from '../api/VerifyPhone';
import { getSetting } from '../models/AsyncStorage';
import { migrateDatabase } from '../helpers/Database';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { Alert, ToastAndroid } from 'react-native';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    // Get data from the storage
    SecureStore.getItemAsync('user').then((storedUser) => {
      setUser(JSON.parse(storedUser));
    });

    // Get currency
    getSetting('app_default_currency').then(setCurrency);
  }, []);

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
        register: (phone, code) => {
          setIsLoading(true);
          verifyOTP(phone, code)
            .then((response) => {
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
            })
            .catch((error) => {
              setError(error.response.data.message);
              setIsLoading(false);
            });
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
            setUser(userResponse);
            setError(null);
            /** Securely store user information. */
            await SecureStore.setItemAsync('user', JSON.stringify(userResponse));
            /** Run the migration immediately after successful login */
            migrateDatabase();
            /** Stop loading */
            setIsLoading(false);
          } catch (error) {
            setError(error.message);
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


