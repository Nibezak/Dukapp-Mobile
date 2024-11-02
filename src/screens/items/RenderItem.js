import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { money } from '../../helpers/Numbers';
import { t } from 'i18n-js';
import { getSetting } from '../../models/AsyncStorage';
import { ThemeContext } from '../../../App';

/**
 * Render Customers in a list
 */
export default function RenderItem({ item, index, onPress }) {
  const navigation = useNavigation();
  const [currency, setCurrency] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getSetting('app_default_currency').then(setCurrency);
  }, []);

  // Handle add item action
  const handleAddItem = () => {
    navigation.navigate(`${t('screens.newItem')}`);
  };

  // Change layout for the add action
  if (item.id === 'add') {
    return (
      <TouchableOpacity onPress={handleAddItem} style={styles.addItemContainer}>
        <MaterialIcons name="add" size={34} color="#15803d" />
        <Text style={styles.addItemText}>{t('item.new_item')}</Text>
      </TouchableOpacity>
    );
  }

  const isService = parseInt(item.is_service) === 1;
  const isLowStock = item.quantity < item.reorder_level;

  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <View style={styles.itemRow}>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.itemStatus, {
            backgroundColor: isLowStock && !isService ? '#fef9c3' : '#BBF7D0',
            color: isLowStock && !isService ? '#854d0e' : '#14532D'
          }]}>
            {isService ? t('item.service') : `${t('item.in_stock')} ${item.quantity}`}
          </Text>
        </View>
        <Text style={[styles.itemPrice, { color: theme.text }]}>
          {money(item.sale_price, currency)}
        </Text>
        <MaterialIcons name="chevron-right" size={32} color={theme.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 7,
  },
  addItemText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15803d',
    marginLeft: 10,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 7,
    backgroundColor: 'transparent', // Keep the background transparent
    borderRadius: 8,
    marginVertical: 2,
  },


  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 12,
    marginTop: 5,
    width: "80%"
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 10, // Add space between the price and the status
  },
});
