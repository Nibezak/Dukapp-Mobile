import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { t } from 'i18n-js';
import { money } from '../../helpers/Numbers';
import { useNavigation } from '@react-navigation/native';
import { getSetting } from '../../models/AsyncStorage';
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../../App';

export default function RenderPurchase({ item, parentRefresher }) {
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
  const dayjs = require('dayjs');
  const date = order.created_at;
  const orderDate = payment.date_paid;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme.accent,
        padding: 5,
        borderRadius: 10,
        marginBottom: 7,
        elevation: 2.5,
        marginTop: 3.5,
      }}
      key={order.id}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Purchase Details', {
          order: order,
        })
      }
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
        <Text
          style={{
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderRadius: 30,
            color: theme.text,
            opacity: 0.7,
          }}
        >
          {dayjs(date).format('DD MMM YYYY')}
        </Text>
        <Text
          style={{
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderRadius: 30,
            color: theme.text,
            opacity: 0.7,
          }}
        >
          {/* {dayjs(date).format('h: mm A')} */}
          {orderDate}
        </Text>
      </View>
      <View style={styles.rows}>
        <Text style={[styles.orderNumberColumn, { color: theme.text }]}>
          {order.order_type.substr(0, 1).toUpperCase()}
          {'#' + order.id}
        </Text>
        <Text style={[styles.itemNameColumn, { color: theme.text }]} numberOfLines={2}>
          {order.line_items.length === 1
            ? order.line_items[0].name
            : t('order.items', { count: order.line_items.length })}
        </Text>
        <Text style={[styles.amount, { color: theme.text }]}>{money(order.total, currency)}</Text>
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
          <Feather name="check-circle" size={18} color={theme.primary} style={{ marginLeft: 10 }} />
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
