import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { t } from 'i18n-js';
import { money } from '../../helpers/Numbers';
import { useNavigation } from '@react-navigation/native';
import { getSetting } from '../../models/AsyncStorage';
import ItemService from '../../services/ItemService';
import Order from '../../models/Order';

export default function RenderOrder({ item }) {
  const navigation = useNavigation();
  const order = item.item;
  const payment = order.payments[0];
  const [error, setError] = useState(null);

  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    getSetting('app_default_currency').then(setCurrency);
  }, []);

  /**
   * Function to destroy an existing
   * Order
   */
  async function handleDeleteOrder() {
    /** Pass order to be deleted */
    Order.destroy(order.id)
      .then((result) => {
        ToastAndroid.show(t('welcome.order_deleted'), ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const dayjs = require('dayjs');
  const date = order.created_at;
  return (
    <TouchableOpacity
      onLongPress={handleDeleteOrder}
      key={order.id}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Order Details', {
          order: order,
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
          {dayjs(date).format('H:mm A   ZZ')}
        </Text>
      </View>
      <View style={styles.rows}>
        <Text style={styles.orderNumberColumn}>
          {order.order_type.substr(0, 1).toUpperCase()}
          {'#' + order.id}
        </Text>
        <Text style={styles.itemNameColumn} numberOfLines={2}>
          {order.line_items.length === 1
            ? order.line_items[0].name.slice(0, 20)
            : t('order.items', { count: order.line_items.length })}
        </Text>

        <View style={styles.itemPriceColumn}>
          <Text style={[styles.amount]}>{money(order.total, currency)}</Text>
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
    marginHorizontal: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e0',
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
    flex: 4,
    marginHorizontal: 5,
  },
  itemPriceColumn: {
    flex: 4,
    flexDirection: 'row',
  },
  paymentMethod: {
    flex: 1,
    marginRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
  },
  rightArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};
