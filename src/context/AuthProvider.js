import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axiosConfig from '../helpers/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generalSettings } from '../screens/settings/settings';
import { verifyOTP } from '../api/VerifyPhone';
import { getSetting, setSetting } from '../models/AsyncStorage';
import { migrateDatabase } from '../helpers/Database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('');
  const [phone, setPhone] = useState('');
  let code = '0000';
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
        login: (phone, code) => {
          setIsLoading(true);

          // Create a dummy user response with the phone number provided
          const userResponse = {
            token: 'DUMMY_TOKEN',
            id: 'DUMMY_ID',
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
            phone: phone, // Use the passed-in phone number
          };

          // Store the phone number
          setSetting('contact_phone', phone);

          // Set the user data
          setUser(userResponse);
          setError(null);

          /** Securely store user information. */
          SecureStore.setItemAsync('user', JSON.stringify(userResponse));

          /** Run the migration immediately after successful login */
          migrateDatabase();

          /** Stop loading */
          setIsLoading(false);
        },

        logout: () => {
          setIsLoading(true);
          setUser(null);
          SecureStore.deleteItemAsync('user');
          setError(null);
          setIsLoading(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
