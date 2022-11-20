import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axiosConfig from "../helpers/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generalSettings } from "../screens/settings/settings";
import { verifyOTP } from "../api/VerifyPhone";
import { getSetting } from "../models/AsyncStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [settings, setSettings] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const [currency, setCurrency] = useState("");
        useEffect(() => {
            // Get data from the storage
            SecureStore.getItemAsync("user").then((storedUser) => {
                setUser(JSON.parse(storedUser));
            });

            // Get currency
            getSetting("app_default_currency").then(setCurrency);
        }, []);

        return ( <AuthContext.Provider value = {
                {
                    user,
                    setUser,
                    error,
                    setError,
                    currency,
                    isLoading,
                    setIsLoading,
                    login: (phone, code) => {
                        setIsLoading(true);
                        verifyOTP(phone, code)
                            .then((response) => {
                                const shop = response.data;
                                const userResponse = {
                                    token: "TO BE REPLACED TOKEN",
                                    id: shop.id,
                                    name: shop.name,
                                    username: shop.username,
                                    email: shop.email,
                                    phone: phone,
                                    // avatar: response.data.results[0].picture.thumbnail,
                                };

                                setUser(userResponse);
                                setError(null);
                                SecureStore.setItemAsync("user", JSON.stringify(userResponse));
                                setIsLoading(false);
                            })
                            .catch((error) => {
                                setError(error.response.data.message);
                                setIsLoading(false);
                            });
                    },
                    logout: () => {
                        setIsLoading(true);
                        setUser(null);
                        SecureStore.deleteItemAsync("user");
                        setError(null);
                        setIsLoading(false);
                    },
                }
            } > 
            { children }
            </AuthContext.Provider>);
        };