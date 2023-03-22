import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { t } from 'i18n-js';
import { money } from '../../helpers/Numbers';
import { useNavigation } from '@react-navigation/native';
import { getSetting } from '../../models/AsyncStorage';
import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';

export default function RecentOrder({ item, parentRefresher }) {
    const navigation = useNavigation();
    const order = item.item;
    const [customer, setCustomer] = useState({ name: 'Guest' });
    const payment = order.payments[0];
    const [currency, setCurrency] = useState(null);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        retrieveSetting();
    }, []);

    function retrieveSetting() {
        getSetting('app_default_currency').then(setCurrency);
    }
    const dayjs = require('dayjs');
    const date = order.created_at;
    const orderDate = payment.date_paid;
    function handleNavigation() {
        if (order.status !== 'completed') {
            navigation.navigate('Order Details', {
                order: order,
            });
        } else {
            navigation.navigate('Order Receipt', {
                order: order,
                customer: customer,
            });
        }
    }
    return (
        <TouchableOpacity
            style={{
                backgroundColor: theme.accent,
                paddingHorizontal: 5,
                paddingVertical: 15,
                marginHorizontal: 10,
                borderRadius: 10,
                marginBottom: 10,
                elevation: 2.5,
                marginTop: 20,
                height: 120,
            }}
            key={order.id}
            activeOpacity={0.8}
            onPress={handleNavigation}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
                <Text
                    style={{ paddingHorizontal: 5, paddingVertical: 2, borderRadius: 30, color: theme.text }}
                >
                    {dayjs(date).format('DD MMM YYYY')}
                </Text>
                <Text
                    style={{ paddingHorizontal: 5, paddingVertical: 2, borderRadius: 30, color: theme.text }}
                >
                    {dayjs(date).format('h:mm A')}
                </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 10 }}>
                <Text style={[styles.itemNameColumn, { color: theme.text }]} numberOfLines={2}>
                    {order.line_items.length === 1
                        ? order.line_items[0].name
                        : t('order.items', { count: order.line_items.length })}
                </Text>
            </View>
            <View style={styles.itemPriceColumn}>
                <Text
                    style={[
                        styles.paymentMethod,
                        {
                            color: payment.method == 'credit' ? '#f1c40f' : '#10b981',
                        },
                    ]}
                >
                    {payment.title?.slice(0, 6).toUpperCase()}
                </Text>
                <Text style={[styles.amount, { color: theme.text }]}>{money(order.total, currency)}</Text>
                <View style={{ marginHorizontal: 5 }}>
                    {order.status === 'completed' ? (
                        <FontAwesome name="check-circle" size={20} color="#10b981" style={{ marginRight: 5 }} />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="dots-circle" size={20} color="#64748B" />
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = {
    rows: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 1.8,
        paddingHorizontal: 1,
        marginHorizontal: 3,
    },

    amount: {
        fontSize: 14,
    },
    itemName: {
        paddingRight: 5,
        flexGrow: 1,
        width: 25,
    },
    orderNumberColumn: {
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemNameColumn: {

        marginHorizontal: 5,
    },
    itemPriceColumn: {
        flexDirection: 'row',
    },
    paymentMethod: {
        marginRight: 5,
        marginLeft: 10,
        paddingTop: 3,
        paddingRight: 8,
        // paddingLeft: ,
    },
    rightArrow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
};
