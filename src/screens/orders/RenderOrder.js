import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { t } from 'i18n-js';
import { money } from '../../helpers/Numbers';
import { useNavigation } from '@react-navigation/native';
import { getSetting } from '../../models/AsyncStorage';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from '../../../App';
import dayjs from 'dayjs';

export default function RenderOrder({ item }) {
  const navigation = useNavigation();
  const order = item.item;
  const payment = order.payments[0];
  const [currency, setCurrency] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getSetting('app_default_currency').then(setCurrency);
  }, []);

  const date = order.created_at;
  const orderDate = payment.date_paid;

  function handleNavigation() {
    navigation.navigate(
      order.status !== 'completed' ? 'Order Details' : 'Order Receipt',
      { order }
    );
  }

  return (
    <TouchableOpacity
      style={styles.container(theme)}
      activeOpacity={0.9}
      onPress={handleNavigation}
    >
      <View style={styles.header}>
        <Text style={styles.dateText(theme)}>{dayjs(date).format('DD MMM YYYY')}</Text>
        <Text style={styles.dateText(theme)}>{orderDate}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.orderNumber, { color: theme.text }]}>
          {order.order_type[0].toUpperCase()}#{order.id}
        </Text>
        <Text style={styles.receiptNumber}># {payment.transaction_id}</Text>
        <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
          {order.line_items.length === 1
            ? order.line_items[0].name
            : t('order.items', { count: order.line_items.length })}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.paymentMethod, { color: payment.method === 'credit' ? '#f1c40f' : '#10b981' }]}>
          {payment.title?.slice(0, 6).toUpperCase()}
        </Text>
        <Text style={[styles.amount, { color: theme.text }]}>
          {money(order.total, currency)}
        </Text>
        {order.status === 'completed' ? (
          <FontAwesome name="check-circle" size={20} color="#10b981" />
        ) : (
          <MaterialCommunityIcons name="dots-circle" size={20} color="#64748B" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: (theme) => ({
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 10,
  }),
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: (theme) => ({
    fontSize: 12,
    color: theme.text,
    opacity: 0.7,
  }),
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    flexShrink: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
