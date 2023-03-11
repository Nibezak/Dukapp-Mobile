import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, InteractionManager, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import FloatingButton from '../../components/FloatingButton';
import CustomerService from '../../services/CustomerService';
import RenderCustomer from './RenderCustomer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SearchButton from '../../components/SearchButton';
import { CustomersAnimation } from '../../components/CustomersAnimation';
import * as Analytics from 'expo-firebase-analytics';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../../../firebase';

export default function CustomerListScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshCustomers();
      });
    }, [])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    refreshCustomers();
    tracker();
  }, []);

  /**
   * Get DB customers
   */

  // track screen on google analytics
  async function tracker() {
    Analytics.setUserId(user.email);
    Analytics.logEvent('users', {
      user: user.email,
      screen: 'screens',
      navigation: 'Customer Screen',

    });
  }
  async function refreshCustomers() {
    CustomerService.getCustomers()
      .then(setCustomers)
      .then((result) => setShowLoading(false));
    // set the Header with search
    setHeaderRight();
  }

  function setHeaderRight() {
    navigation.setOptions({
      headerTitle: 'Customers',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity style={{ paddingLeft: 10 }}>
          <AntDesign
            name="menuunfold"
            size={24}
            color="#47a67f"
            onPress={() => navigation.openDrawer()}
          />
        </TouchableOpacity>
      ),
      headerRight: () => <SearchButton onPress={() => navigation.navigate('Search Customer')} />,
    });
  }

  /**
   * Render Customers in a list
   */
  const renderItem = useCallback(({ item }) => (
    <RenderCustomer
      item={item}
      index={item.id}
      key={item.id}
      onPress={() =>
        navigation.navigate('Edit Customer', {
          customer: item,
        })
      }
    />
  ));

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  /**
   * Show the activity indicator as long as the items are being fetched.
   * This improves user experience by showing a loader.
   */
  if (showLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
      </View>
    );
  }

  // If we reach here it means that the list of customers has finished loading
  return (
    <View style={styles.container}>
      {customers.length > 0 ? (
        <>
          <FlatList
            data={customers}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            maxToRenderPerBatch={6}
          />
          <FloatingButton onPress={() => navigation.navigate('New Customer')}>
            <MaterialIcons name="person-add-alt" size={32} />
          </FloatingButton>
        </>
      ) : (
        <CustomersAnimation />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
