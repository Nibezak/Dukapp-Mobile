import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, StyleSheet, Image, InteractionManager, Text } from 'react-native';
import HomeSummary from './HomeSummary';
import { t } from 'i18n-js';
import OrderService from '../../services/OrderService';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Title } from 'react-native-paper';
import RevenueBarChart from '../reports/RevenueBarChart';
import { AntDesign } from '@expo/vector-icons';
import { WelcomeAnimation } from '../../components/WelcomeAnimation';
import { getSetting } from '../../models/AsyncStorage';
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
        refreshOrders();
      });
    }, [])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    setHeader();
    retrieveCurrency();
    refreshOrders();
  }, [theme]);



  function setHeader() {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require('./../../../assets/dukapp-color.png')}
          style={{ width: 35, height: 35, paddingVertical: 10 }}
        />
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <AntDesign
          name="caretright"
          size={24}
          color={theme.primary}
          onPress={() => navigation.openDrawer()}
          style={{ paddingLeft: 10 }}
        />
      ),
      headerRight: () => (
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
      ),
      headerStyle: {
        backgroundColor: "transparent",
      },
    });
  }

  async function refreshOrders() {
    return OrderService.ordersWithItems(setOrders, orderType, null, 8).then(() =>
      setShowLoading(false)
    );
  }

  function retrieveCurrency() {
    getSetting('app_default_currency').then(setCurrency);
  }
  const handleDeleteOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
  };


  const renderOrder = useCallback((item) => (
    <RecentOrder
      item={item}
      index={item.id}
      key={item.id}
      onPress={() =>
        navigation.navigate(`${t('screens.editItem')}`, {
          item: item,
        })
      }
      onDelete={handleDeleteOrder} // Pass the onDelete function
    />
  ), []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusbar} />
      {orders.length === 0 ? (
        <WelcomeAnimation />
      ) : (
        <>
          <Text style={styles.title}>Today's Insights</Text>
          {/* Wrap the chart and list in a container View */}
          <HomeSummary />
          <View style={styles.chartContainer}>

            <RevenueBarChart
              orders={orders}
              renderOrder={renderOrder}
              keyExtractor={keyExtractor}
            />


          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    alignSelf: 'left',
    marginHorizontal: 20,
    color: '#718096',
    textTransform: 'uppercase',
    marginTop: 4

  },
  container: {
    flex: 1,
  },
  chartContainer: {
    flex: 1, // Optional: make it take full height if needed
    marginBottom: 10, // Add margin for spacing
  },
});
