import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { money } from '../../helpers/Numbers';
import { t } from 'i18n-js';
import { getSetting } from '../../models/AsyncStorage';
import { ThemeContext } from '../../../App';
import { useContext } from 'react';
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

  //  Change layout for the add action
  if (item.id === 'add') {
    return (
      <TouchableOpacity onPress={() => navigation.navigate(`${t('screens.newItem')}`)}>
        {/** Give options to add a new item */}
        <View
          style={[
            styles.row,
            {
              padding: 10,
              // backgroundColor: "#f1f1f1",
              alignContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <MaterialIcons name="add" size={34} color="#15803d" style={[styles.avatar]} />

          <Text
            style={{
              fontSize: 18,
              alignSelf: 'center',
              textAlign: 'center',
              fontWeight: '700',
              color: '#15803d',
            }}
          >
            {t('item.new_item')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const isService = parseInt(item.is_service) === 1;
  const isLowStock = item.quantity < item.reorder_level;
  const noStock = item.quantity <= 0;

  return (
    <TouchableOpacity onPress={onPress} style={{ paddingVertical: 5 }}>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={[styles.names, { color: theme.text }]}>{item.name}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 3, padding: 1 }}>
            <Text
              style={[
                styles.details,
                {
                  paddingHorizontal: 10,
                  paddingVertical: 1,
                  backgroundColor: isLowStock && !isService ? '#fef9c3' : '#BBF7D0',
                  margin: 5,
                  borderRadius: 30,
                  color: isLowStock && !isService ? '#854d0e' : '#14532D',
                },
              ]}
            >
              {isService ? t('item.service') : t('item.in_stock') + item.quantity}
            </Text>
          </View>
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.details, { color: theme.text }]}>
            {t('item.sales_at')}
            {money(item.sale_price, currency)}
          </Text>
        </View>
        <Text>
          <MaterialIcons name="chevron-right" size={32} color={theme.primary} />
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
    paddingHorizontal: 1,
    marginHorizontal: 7,
    borderBottomWidth: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rowText: {
    flex: 1,
    paddingHorizontal: 5,
  },
  details: {
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: "400",
    paddingVertical: 3,
    marginHorizontal: 7,
  },
  names: {
    fontWeight: 'bold',
  },
};
