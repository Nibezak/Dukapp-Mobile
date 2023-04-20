import React, { useState, useEffect, useCallback, useContext } from 'react';
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
import { ThemeContext } from '../../../App';
import { t } from 'i18n-js';

export default function CustomerListScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);

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
      headerTitle: `${t('screens.customers')}`,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: theme.text,
      },
      headerStyle: {
        backgroundColor: theme.accent,
      },
      headerLeft: () => (
        <TouchableOpacity style={{ paddingLeft: 10 }}>
          <AntDesign
            name="menuunfold"
            size={24}
            color={theme.primary}
            onPress={() => navigation.openDrawer()}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <SearchButton
          onPress={() => navigation.navigate('Search Customer')}
          color={theme.primary}
        />
      ),
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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          background: theme.background,
        }}
      >
        <ActivityIndicator style={{ margin: 8 }} size="small" color={theme.primary} />
      </View>
    );
  }

  // If we reach here it means that the list of customers has finished loading
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {customers.length > 0 ? (
        <>
          <View style={{ marginBottom: 40 }}>
            <FlatList
              data={customers}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              maxToRenderPerBatch={6}
            />
          </View>
          <FloatingButton onPress={() => navigation.navigate(`${t('screens.newCustomer')}`)}>
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
