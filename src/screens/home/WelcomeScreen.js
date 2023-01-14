import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  InteractionManager,
  ScrollView,
} from 'react-native';
import HomeSummary from './HomeSummary';
import { t } from 'i18n-js';
import RenderOrder from '../orders/RenderOrder';
import OrderService from '../../services/OrderService';
import { useFocusEffect } from '@react-navigation/native';
import { Title, ActivityIndicator } from 'react-native-paper';
import RevenueBarChart from '../reports/RevenueBarChart';
import { AntDesign } from '@expo/vector-icons';
import { WelcomeAnimation } from '../../components/WelcomeAnimation';
import { getSetting } from '../../models/AsyncStorage';
/**
 * Screen component
 */
export default function WelcomeScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState('sale');
  const [showLoading, setShowLoading] = useState(true);
  const [currency, setCurrency] = useState('RWF');
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshOrders();
      });
    }, [])
  );

  useEffect(() => {
    setHeader();
    retrieveCurrency()
    refreshOrders();
  }, []);

  function setHeader() {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require('./../../../assets/snack-icon.png')}
          style={{ width: 120, height: 100 }}
        />
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <AntDesign
          name="menuunfold"
          size={24}
          color="#47a67f"
          onPress={() => navigation.openDrawer()}
          style={{ paddingLeft: 10 }}
        />
      ),
    });
  }



  // Fetch Orders
  async function refreshOrders() {
    return OrderService.ordersWithItems(setOrders, orderType, null, 8).then(() => setShowLoading(false))
  }
  function retrieveCurrency() {
    getSetting("app_default_currency").then(setCurrency);
  }

  /**
   * Render an order item.
   */
  const renderOrder = useCallback((item) => (
    <RenderOrder
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
      </View>
    );
  }

  // If we reach here it means that the list of customers has finished loading
  return (
    <View style={styles.container}>
      {/** Welcome Section of the screen */}

      {orders.length === 0 ? (
        <WelcomeAnimation />
      ) : (
        <>
          <Title style={styles.title}>{t('welcome.today_insights')}</Title>
          <HomeSummary />

          <RevenueBarChart />
          {/* <Title style={styles.title}>{orders.length > 0 ? t('welcome.last_4_orders') : ''}</Title> */}
          <ScrollView>

            <FlatList
              data={orders.slice(0, 5)}
              renderItem={renderOrder}
              keyExtractor={keyExtractor}
              nestedScrollEnabled
            />

          </ScrollView>
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
    paddingHorizontal: 5,
  },
});
