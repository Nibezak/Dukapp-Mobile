import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { t } from 'i18n-js';
import { MaterialIcons } from '@expo/vector-icons';
import { money, number } from '../../helpers/Numbers';
import { getSetting } from '../../models/AsyncStorage';
import { ThemeContext } from '../../../App';
/**
 * Render Item of the chat
 */
export default function RenderOrderLineItem({
  item,
  onPriceChange,
  onReduceQuantity,
  onIncreaseQuantity,
  onChangingQuantity,
}) {
  const [currency, setCurrency] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getSetting('app_default_currency').then(setCurrency);
  }, []);

  return (
    <View style={[styles.row]}>
      <View style={styles.itemNameColumn}>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.unitPrice, { color: theme.text, opacity: 0.7 }]}>
          {t('order.unit_price')}
          {money(item.unit_sales_price, currency)}
        </Text>
      </View>

      <View style={styles.quantityColumn}>
        <TouchableOpacity onPress={onReduceQuantity}>
          <MaterialIcons name="remove" size={30} color={theme.danger} />
        </TouchableOpacity>

        <TextInput
          editable={false}
          style={[styles.quantityInput, { color: theme.text, backgroundColor: theme.accent }]}
          defaultValue={number(item.quantity)}
          onChangeText={onChangingQuantity}
          keyboardType="numeric"
        />

        <TouchableOpacity onPress={onIncreaseQuantity}>
          <MaterialIcons name="add" size={30} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.priceColumn}>
        <TextInput
          defaultValue={number(item.total).toString()}
          style={[styles.totalPriceInput, { color: theme.text, backgroundColor: theme.accent }]}
          onChangeText={(text) => onPriceChange(text)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    marginVertical: 4,
  },
  totalPriceInput: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    color: '#2d3748',
    borderRadius: 10,
    width: 90,
    backgroundColor: '#cfd8dc',
  },
  itemName: {
    paddingRight: 5,
    color: '#000',
  },
  itemNameColumn: {
    flex: 5,
    marginRight: 5,
  },
  unitPrice: {
    marginVertical: 5,
    color: '#718096',
  },
  priceColumn: {
    flex: 2,
    width: '100%',
    marginRight: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  quantityColumn: {
    flex: 2,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  quantityInput: {
    paddingHorizontal: 20,
    backgroundColor: '#cfd8dc',
    paddingVertical: 5,
    color: '#2d3748',
    marginHorizontal: 2,
    fontSize: 13,
    height: '50%',
    borderRadius: 30,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
