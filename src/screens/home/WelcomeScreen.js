import React, { useEffect, useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Image, InteractionManager } from 'react-native';
import HomeSummary from './HomeSummary';
import { t } from 'i18n-js';
import RenderOrder from '../orders/RenderOrder';
import OrderService from '../../services/OrderService';
import { useFocusEffect } from '@react-navigation/native';
import { Title, ActivityIndicator } from 'react-native-paper';
import RevenueBarChart from '../reports/RevenueBarChart';
import { AntDesign } from '@expo/vector-icons';

import { WelcomeAnimation } from '../../components/WelcomeAnimation';
/**
 * Screen component
 */
export default function WelcomeScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState('sale');
  const [showLoading, setShowLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        redirectIfOrderExits();
        refreshOrders();
      });
    }, [])
  );

  useEffect(() => {
    setHeader();
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
          color="green"
          onPress={() => navigation.openDrawer()}
          style={{ paddingLeft: 10 }}
        />
      ),
    });
  }

  // Fetch Orders
  async function refreshOrders() {
    return OrderService.ordersWithItems(
      (orders) => {
        setOrders(orders);

        // We have loaded orders, let's disable activity indicator
        setShowLoading(false);
      },
      orderType,
      null,
      8
    );
  }

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

  if (showLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
      </View>
    );
  }

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
          <Title style={styles.title}>{orders.length > 0 ? t('welcome.last_4_orders') : ''}</Title>
          <View>
            <FlatList
              data={orders.slice(0, 4)}
              // Data.slice(0,4
              renderItem={renderOrder}
              keyExtractor={keyExtractor}
            />
          </View>
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
