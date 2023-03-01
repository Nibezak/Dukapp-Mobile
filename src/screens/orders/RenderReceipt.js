import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { t } from 'i18n-js';
import { money } from '../../helpers/Numbers';
import { useNavigation } from '@react-navigation/native';
import { getSetting } from '../../models/AsyncStorage';
import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RenderOrder({ item, parentRefresher }) {
    const navigation = useNavigation();
    const order = item.item;
    const payment = order.payments[0];
    const [customer, setCustomer] = useState({ name: 'Guest' })
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        retrieveSetting();
    }, []);


    function retrieveSetting() {
        getSetting("app_default_currency").then(setCurrency);
    }
    const dayjs = require('dayjs');
    const date = order.created_at;

    return (
        <TouchableOpacity
            style={{ backgroundColor: "white", padding: 5, borderRadius: 10, marginBottom: 7, elevation: 2.5, marginTop: 3.5 }}
            key={order.id}
            activeOpacity={0.8}
            onPress={() =>
                navigation.navigate("Order Receipt", {
                    order: order,
                    customer: customer,
                })
            }
        >

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
                <Text
                    style={{ paddingHorizontal: 5, paddingVertical: 2, borderRadius: 30, color: '#62656b' }}
                >
                    {dayjs(date).format('DD MMM YYYY')}
                </Text>
                <Text
                    style={{ paddingHorizontal: 5, paddingVertical: 2, borderRadius: 30, color: '#62656b' }}
                >
                    {dayjs(date).format('h:mm A')}
                </Text>
            </View>
            <Text style={styles.itemNameColumn} numberOfLines={2}>
                {order.line_items.length === 1
                    ? order.line_items[0].name
                    : t('order.items', { count: order.line_items.length })}
            </Text>
            <View style={styles.rows}>
                <Text style={styles.orderNumberColumn}>
                    {order.order_type.substr(0, 1).toUpperCase()}
                    {'#' + payment.transaction_id}
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
                <Text style={[styles.amount]}>{money(order.total, currency)}</Text>
                <View style={{ marginHorizontal: 5 }}>
                    {order.status === 'completed' ? (
                        <FontAwesome name="check-circle" size={20} color="#10b981" style={{ marginRight: 5 }} />

                    ) : (
                        <>
                            <MaterialCommunityIcons name="dots-circle" size={20} color="#64748B" />
                        </>
                    )}
                </View>

                {/* <Feather name="check-circle" size={18} color="#10b981" style={{ marginLeft: 10 }} /> */}

            </View>
        </TouchableOpacity>
    );
}

const styles = {
    rows: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 2,
        paddingVertical: 10,
        paddingHorizontal: 1,
        marginHorizontal: 3,
        // backgroundColor: "red"

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
        flexDirection: "row",
        color: '#000',
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemNameColumn: {
        paddingHorizontal: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        fontWeight: "bold",
        color: "#52525B"
    },
    itemPriceColumn: {
        flex: 4,
        flexDirection: 'row',
    },
    paymentMethod: {
        flex: 1,
        marginRight: 5,
        marginLeft: 10,
        paddingTop: 3,
        paddingBottom: 5,
        paddingRight: 8,
        // paddingLeft: ,
    },
    rightArrow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
};
