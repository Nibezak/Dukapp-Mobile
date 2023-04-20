import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { t } from "i18n-js";
import { MaterialIcons } from "@expo/vector-icons";
import { money, number } from "../../helpers/Numbers";
import { getSetting } from "../../models/AsyncStorage";
/**
 * Render Item of the order
 */
export default function ReceiptOrderItems({ item, index }) {

    return (
        <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>
                {item.name}
                {' x '} {item.quantity}
            </Text>
            <Text style={styles.itemAmount}>{number(item.total)}</Text>
        </View>
    );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#a0aec0",
    },
    itemRow: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#4a5568',
        padding: 10,
        borderRadius: 10,
    },
    itemName: {
        fontSize: 12,
        color: '#4a5568',
    },
    itemAmount: {
        fontSize: 12,
        textDecorationStyle: 'solid',
        color: '#4a5568',
    },
});
