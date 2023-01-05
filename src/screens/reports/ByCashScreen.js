import { useEffect, useState } from 'react';
import { t } from 'i18n-js';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReportService from '../../services/ReportService';

export function ByCashScreen() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  /** Upon the screen load, fetch orders paid by cash */
  useEffect(() => {
    getOrderPaidByCash();
  }, []);

  /**
   * Fetch orders by payment method
   */
  async function getOrderPaidByCash() {
    ReportService.getSaleOrdersByPayment('cash')
      .then(setOrders)
      .then(() => setShowLoading(false));
  }

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

  /** Display orders with cash payment */
  return (
    <View style={[styles.container, { width }]}>
      {orders.map((order, index) => {
        return (
          <Text>
            {order.id} | {order.status} | {order.total}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    alignSelf: 'center',
    marginBottom: 10,
    color: '#47a67f',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 64,
  },
});
