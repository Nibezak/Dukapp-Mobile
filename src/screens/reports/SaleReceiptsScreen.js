import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ItemService from '../../services/ItemService';
import OrderService from '../../services/OrderService';
import { ReceiptAnimation } from '../../components/ReceiptAnimation';
import RenderReceipt from '../orders/RenderReceipt';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const windowHeight = Dimensions.get('window').height;

// Constants
export default function SaleReceiptsScreen({ navigation, route }) {
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState(route.params.order_type);
  const [items, setItems] = useState([]);
  const [setLastOrder, setsetLastOrder] = useState();
  const [showLoading, setShowLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshOrders();
        getItems().then(() => setShowLoading(false));
      });
    }, [])
  );

  useEffect(() => {
    getItems();
    refreshOrders();
    setHeader()
  }, [orderType]);

  /**
   * Fetch Orders
   */

  /**
   * Get Orders from DB
   */
  function setHeader() {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 10, marginHorizontal: 10, }}>
          <AntDesign name="minuscircleo" size={24} color="#718096" style={{ fontWeight: "semibold" }} />
        </TouchableOpacity>
      ),
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
  async function getItems() {
    ItemService.getItems()
      .then(setItems);
  }

  function refreshOrders() {
    OrderService.ordersWithItems(setOrders, orderType).then((results) => {
      setLastOrder(results[results.length - 1]);
    });
  }

  const renderOrder = useCallback((item) => (
    <RenderReceipt item={item} index={item.id} key={item.id} />
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

  /**
   * Render to the screen
   */
  return (
    <View style={[styles.container]}>
      {orders.length > 0 ? (
        <FlatList
          inverted
          style={{ bottom: 1 }}
          data={orders}
          renderItem={renderOrder}
          keyExtractor={keyExtractor}
        />
      ) : (
        <ReceiptAnimation />
      )}
      {/* Display order summary */}
    </View>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  suggestions: {
    width: '95%',
    borderRadius: 3,
    alignSelf: 'center',
    height: windowHeight / 2.5,
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc',
  },
  amount: {
    fontSize: 40,
    fontWeight: '800',
    paddingRight: 5,
  },
  itemName: {
    paddingRight: 5,
    flexGrow: 1,
    width: 30,
    fontWeight: '700',
  },
  itemDescription: {
    paddingRight: 10,
  },
  bottom: {
    backgroundColor: '#fff',
  },
});
