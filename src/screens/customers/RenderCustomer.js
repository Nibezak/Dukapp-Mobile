import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import { ThemeContext } from '../../../App';

/**
 * Render a customer item in a list
 */
export default function RenderCustomer({ item, onPress }) {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  // If item is for adding a customer, return the add button
  if (item.id === 'add_customer') {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('New Customer')}>
        <View style={[styles.addCustomerButton, { backgroundColor: theme.accent }]}>
          <MaterialIcons name="add" size={34} color={theme.primary} style={styles.icon} />
          <Text style={styles.addCustomerText}>{t('customer.new_customer')}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Generate initials based on the customer's name
  const initials = generateInitials(item.names);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>{initials}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.names, { color: theme.text }]}>{item.names}</Text>
          <Text style={[styles.phone, { color: theme.text }]}>{item.phone}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={32} color={theme.colorIcon} />
      </View>
    </TouchableOpacity>
  );
}

// Function to generate initials based on the customer's name
const generateInitials = (name) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? `${parts[0].charAt(0).toUpperCase()}${parts[parts.length - 1].charAt(0).toUpperCase()}`
    : `${name.charAt(0).toUpperCase()}${name.charAt(name.length - 1).toUpperCase()}`;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 5,
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  addCustomerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  icon: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#F5F5F4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#78716C',
    marginRight: 15,
  },
  initial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#292524',
  },
  rowText: {
    flex: 1,
    paddingRight: 15,
  },
  names: {
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 2,
  },
  phone: {
    fontSize: 14,
    color: '#757575',
  },
  addCustomerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00796b',
  },
});
