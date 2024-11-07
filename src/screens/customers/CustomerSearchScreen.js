import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomerService from '../../services/CustomerService';
import RenderCustomer from './RenderCustomer';
import { t } from 'i18n-js';
import OrderService from '../../services/OrderService';
import { ThemeContext } from '../../../App';
import { SafeAreaView } from 'react-native';

export default function CustomerSearchScreen({ navigation, route }) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customersBuffer, setCustomersBuffer] = useState([]);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        refreshCustomers();
      });
      return () => task.cancel(); // Clean up on unmount
    }, [])
  );

  useEffect(() => {
    refreshCustomers();
  }, []);

  const refreshCustomers = async () => {
    try {
      const dbCustomers = await CustomerService.getCustomers();
      const customersFromDB = [
        {
          id: 'add_customer',
          names: 'add_customer',
          phone: 'add_customer',
          email: 'add_customer',
          address: 'add_customer',
          note: 'add_customer',
        },
        ...dbCustomers,
      ];
      setCustomers(customersFromDB);
      setCustomersBuffer(customersFromDB);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text.trim());

    if (customersBuffer.length === 0) {
      setCustomersBuffer(customers);
    }

    const filteredCustomers = customersBuffer.filter((customer) =>
      customer.names.toLowerCase().startsWith(text.trim().toLowerCase())
    );

    setCustomers(filteredCustomers);
  };

  const handleCustomerSelected = async (customer) => {
    if (route.params?.order) {
      await OrderService.addCustomerToOrder(route.params.order.id, customer.id);
      return navigation.goBack();
    }

    navigation.navigate('Edit Customer', {
      customer: customer,
    });
  };

  const renderCustomer = useCallback(
    ({ item }) => (
      <RenderCustomer
        item={item}
        key={item.id}
        onPress={() => handleCustomerSelected(item)}
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { borderColor: theme.colorIcon }]}
            value={searchTerm}
            onChangeText={handleSearch}
            placeholder={t('common.search_placeholder')}
            placeholderTextColor={theme.textSecondary}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchTerm('');
              handleSearch('');
            }}
          >
            <MaterialIcons name="delete-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={styles.customerList}
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id.toString()}
        maxToRenderPerBatch={6}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop: 30,
    backgroundColor: '#ffffff', // White background for professionalism
  },
  backButton: {
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f9f9f9',
    marginLeft: 10,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 0,
  },
  clearButton: {
    padding: 10,
  },
  customerList: {
    marginTop: 2,
  },
});
