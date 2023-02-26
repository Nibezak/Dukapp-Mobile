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
  const [customer, setCustomer] = useState({ name: 'Guest' })
  const payment = order.payments[0];
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    retrieveSetting();
  }, []);


  function retrieveSetting() {
    getSetting("app_default_currency").then(setCurrency);
  }
  const dayjs = require('dayjs');
  const date = order.created_at
  const orderDate = payment.date_paid
  function handleNavigation() {
    if (order.status !== 'completed') {
      navigation.navigate('Order Details', {
        order: order,
      })
    }
    else {
      navigation.navigate('Order Receipt', {
        order: order,
        customer: customer,
      })
    }
  }
  return (
    <TouchableOpacity
      style={{ backgroundColor: "white", padding: 5, borderRadius: 10, marginBottom: 7, elevation: 2.5, marginTop: 3.5 }}
      key={order.id}
      activeOpacity={0.8}
      onPress={handleNavigation}
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
          {/* {dayjs(date).format('h: mm A')} */}
          {orderDate}
        </Text>
      </View>
      <View style={styles.rows}>
        <Text style={styles.orderNumberColumn}>
          {order.order_type.substr(0, 1).toUpperCase()}
          {'#' + order.id}
        </Text>
        <Text style={styles.itemNameColumn} numberOfLines={2}>
          {order.line_items.length === 1
            ? order.line_items[0].name
            : t('order.items', { count: order.line_items.length })}
        </Text>
        <Text style={[styles.amount]}>{money(order.total, currency)}</Text>
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
    flex: 1,
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNameColumn: {
    flex: 3,
    marginHorizontal: 5,
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
