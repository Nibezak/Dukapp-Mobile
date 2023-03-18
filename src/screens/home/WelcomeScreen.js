import React, { useEffect, useCallback, useState, useContext, useRef } from 'react';
import { View, FlatList, StyleSheet, Image, InteractionManager } from 'react-native';
import HomeSummary from './HomeSummary';
import { t } from 'i18n-js';
import OrderService from '../../services/OrderService';
import { useFocusEffect } from '@react-navigation/native';
import { Title, ActivityIndicator } from 'react-native-paper';
import RevenueBarChart from '../reports/RevenueBarChart';
import { AntDesign } from '@expo/vector-icons';
import { WelcomeAnimation } from '../../components/WelcomeAnimation';
import { getSetting } from '../../models/AsyncStorage';
import * as Analytics from 'expo-firebase-analytics';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../../../firebase';
import { ThemeContext } from '../../../App';
import { StatusBar } from 'expo-status-bar';
import RecentOrder from '../orders/RecentOrders';
export default function WelcomeScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState('sale');
  const [showLoading, setShowLoading] = useState(true);
  const [currency, setCurrency] = useState('RWF');
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshOrders();
      });
    }, [])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    tracker();
    setHeader();
    retrieveCurrency();
    refreshOrders();
  }, [theme]);

  // track screen on google analytics
  async function tracker() {
    Analytics.setUserId(user.email);
    Analytics.logEvent('users', {
      user: user.email,
      screen: 'screens',
      navigation: 'Home Screen',
    });
  }

  function setHeader() {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={
            theme.theme === 'light'
              ? require('./../../../assets/snack-icon.png')
              : require('./../../../assets/snack-icon-dark.png')
          }
          style={{ width: 120, height: 100 }}
        />
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <AntDesign
          name="menuunfold"
          size={24}
          color={theme.primary}
          onPress={() => navigation.openDrawer()}
          style={{ paddingLeft: 10 }}
        />
      ),

      headerRight: () => (
        <>
          <View style={{ flexDirection: 'row' }}>
            <AntDesign
              name="shoppingcart"
              size={24}
              color={theme.primary}
              onPress={() =>
                navigation.navigate('Purchase Orders', {
                  order_type: 'purchase',
                })
              }
              style={{ paddingRight: 10, marginTop: 5 }}
            />
          </View>
        </>
      ),
      headerStyle: {
        backgroundColor: theme.accent,
      },
    });
  }

  // Fetch Orders
  async function refreshOrders() {
    return OrderService.ordersWithItems(setOrders, orderType, null, 8).then(() =>
      setShowLoading(false)
    );
  }
  function retrieveCurrency() {
    getSetting('app_default_currency').then(setCurrency);
  }

  /**
   * Render an order item.
   */
  const renderOrder = useCallback((item) => (
    <RecentOrder
      item={item}
      index={item.id}
      key={item.id}
      onPress={() =>
        navigation.navigate('Edit Item', {
          item: item,
        })
      }
    />
  ));

  const keyExtractor = useCallback((item, index) => index.toString(), []);

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
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator style={{ margin: 8 }} size="small" color={theme.primary} />
      </View>
    );
  }

  // If we reach here it means that the list of customers has finished loading
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/** Welcome Section of the screen */}
      <StatusBar style={theme.statusbar} />

      {orders.length === 0 ? (
        <WelcomeAnimation />
      ) : (
        <>
          <Title style={styles.title}>{t('welcome.today_insights')}</Title>
          <HomeSummary />
          <Title style={styles.sales}>{'Last 7 Days Sales'}</Title>
          <RevenueBarChart />
          <Title style={styles.sales}>{'Recent Sales'}</Title>
          <FlatList
            data={orders.slice(0, 5)}
            renderItem={renderOrder}
            keyExtractor={keyExtractor}
            nestedScrollEnabled
            horizontal={true} // add this line to make the list scroll horizontally
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {},
  title: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#718096',
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
    // backgroundColor: 'white',
    // paddingHorizontal: 5,
  },
  sales: {
    marginTop: 5,
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#718096',
  },
  input: {
    height: '40%',
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
});
