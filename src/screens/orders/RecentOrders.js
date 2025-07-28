import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { t } from 'i18n-js';
import { money } from '../../helpers/Numbers';
import { useNavigation } from '@react-navigation/native';
import { getSetting } from '../../models/AsyncStorage';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from '../../../App';
import dayjs from 'dayjs';

export default function RecentOrder({ item }) {
    const navigation = useNavigation();
    const order = item.item;
    const payment = order.payments[0];
    const [currency, setCurrency] = useState(null);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        retrieveSetting();
    }, []);

    function retrieveSetting() {
        getSetting('app_default_currency').then(setCurrency);
    }

    const date = order.created_at;
    const orderDate = payment.date_paid;

    function formatTime(time) {
        const [hour, minute] = time.split(':');
        const formattedHour = hour.padStart(2, '0'); // Add leading zero if hour < 10
        return `${formattedHour}:${minute}`;
    }

    function handleNavigation() {
        navigation.navigate(order.status !== 'completed' ? 'Order Details' : 'Order Receipt', { order });
    }

    return (
        <TouchableOpacity
            style={styles.container(theme)}
            activeOpacity={0.8}
            onPress={handleNavigation}
        >
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText(theme)}>
                        {dayjs(date).format('DD MMM YYYY')}
                    </Text>
                    <Text style={styles.dateText(theme)}>
                        {formatTime(orderDate)}
                    </Text>
                </View>
                <View style={styles.statusContainer}>
                    {order.status === 'completed' ? (
                        <FontAwesome name="check-circle" size={20} color="#10b981" />
                    ) : (
                        <MaterialCommunityIcons name="dots-circle" size={20} color="#64748B" />
                    )}
                </View>
            </View>

            <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                {order.line_items.length === 1
                    ? order.line_items[0].name
                    : t('order.items', { count: order.line_items.length })}
            </Text>

            <View style={styles.footer}>
                <Text style={[styles.paymentMethod, {
                    color: payment.method === 'credit' ? '#f1c40f' : '#10b981',
                }]}>
                    {payment.title?.slice(0, 6).toUpperCase()}
                </Text>
                <Text style={[styles.amount, { color: theme.text }]}>
                    {money(order.total, currency)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = {
    container: (theme) => ({
        backgroundColor: 'transparent', // Set the background to transparent
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 15,
        marginBottom: 8,
        borderWidth: 1, // Add border width
        borderColor: 'black', // Set the border color to white
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
    }),

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: (theme) => ({
        color: theme.text,
        fontSize: 12,
        marginRight: 5,
    }),
    statusContainer: {
        alignItems: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    paymentMethod: {
        fontSize: 14,
        fontWeight: '500',
    },
    amount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
};
