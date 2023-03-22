import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { ThemeContext } from '../../../App';

export default function RenderCustomer({ item, index, onPress }) {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  // If item is for adding a customer, then return a different
  // View
  if (item.id === 'add_customer') {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('New Customer')}>
        {/** Give options to add a new item */}
        <View
          style={[
            styles.row,
            {
              padding: 10,
              backgroundColor: theme.accent,
              alignContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <MaterialIcons name="add" size={34} color={theme.primary} style={[styles.avatar]} />

          <Text
            style={{
              fontSize: 18,
              alignSelf: 'center',
              textAlign: 'center',
              fontWeight: '700',
              color: theme.primary,
            }}
          >
            {t('customer.new_customer')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>
        <MaterialIcons name="person" style={styles.avatar} size={32} color={theme.colorIcon} />

        <View style={styles.rowText}>
          <Text style={[styles.names, { color: theme.text }]}>{item.names}</Text>
          <Text style={[styles.phone, { color: theme.text }]}>{item.phone}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.phone, { color: theme.text }]}>{item.address}</Text>
        </View>
        <Text>
          <MaterialIcons name="chevron-right" size={32} color={theme.colorIcon} />
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rowText: {
    flex: 1,
  },
  phone: {
    fontSize: 14,
  },
  email: {
    fontSize: 14,
  },
  names: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
};
