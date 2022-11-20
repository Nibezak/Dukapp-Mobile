import React, { useState, useEffect, useCallback, useContext } from "react";
import {
    View,
    Text,
    ToastAndroid,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { t } from "i18n-js";
import { AuthContext } from "../../context/AuthProvider";
import Item from "../../models/Item";
import Customer from "../../models/Customer";
import Supplier from "../../models/Supplier";
import Order from "../../models/Order";
import OrderItem from "../../models/OrderItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generalSettings } from "./settings";
import BackupService from "../../services/BackupService";
import { useNavigation } from "@react-navigation/native";

export default function GeneralSettingsScreen() {
    const { logout } = useContext(AuthContext);
    const [settings, setSettings] = useState(generalSettings);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Settings",
        });
    });

    /**
     * Get General Settings
     */
    async function getSettings() {
        AsyncStorage.getItem("@settings")
            .then(setSettings)
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Reset DB
     */
    async function handleDatabaseReset() {
        // 1. Drop all tables
        Customer.reset();
        Item.reset();
        Order.reset();
        OrderItem.reset();
        Supplier.reset();

        ToastAndroid.show(t("setting.database_has_been_reset"), ToastAndroid.SHORT);
    }

    /**
     * Handle the actions method
     */
    async function handleAction(methodName) {
        switch (methodName.toLowerCase()) {
            case "handledatabasereset":
                handleDatabaseReset();
                break;
            case "backup_application":
                BackupService.backupEntireApp();
                ToastAndroid.show(
                    t("setting.application_backup_is_done"),
                    ToastAndroid.SHORT
                );

                break;
            case "logout":
                logout();
                break;
            default:
                console.log("Unable to find method associated with " + methodName);
                break;
        }
    }

    /**
     * Render Customers in a list
     */
    function renderItem({ item }) {
        return (<TouchableOpacity onPress={
            () => item.action ?
                handleAction(item.action) : navigation.navigate("Setting Options", { setting: item })
        } >

            <View style={[styles.row]}>
                <MaterialIcons
                    name={item.icon ? item.icon : "settings"}
                    size={24}
                    color={item?.color}
                    style={styles.avatar}
                /><View style={styles.rowText} >

                    <Text style={[styles.title, { color: item?.color }]} >
                        {item.title}
                    </Text>

                    {
                        /** Display Description if available */
                        item.description ? (
                            <Text style={styles.description} > {item.description} </Text>
                        ) : (<></>)
                    }
                </View>
            </View>
        </TouchableOpacity>
        );
    }

    return (<View style={styles.container} >
        <FlatList data={settings}
            renderItem={renderItem}
            keyExtractor={
                (item, index) => index.toString()
            }
        />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    avatar: {
        borderRadius: 20,
        width: 40,
        height: 40,
        marginRight: 10,
    },
    rowText: {
        flex: 1,
    },
    title: {
        fontWeight: "bold",
        paddingRight: 10,
    },
});