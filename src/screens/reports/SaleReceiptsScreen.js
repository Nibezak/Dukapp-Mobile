import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ItemService from '../../services/ItemService';
import OrderService from '../../services/OrderService';
import { ReceiptAnimation } from '../../components/ReceiptAnimation';
import RenderReceipt from '../orders/RenderReceipt';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeContext } from '../../../App';

const windowHeight = Dimensions.get('window').height;

// Constants
export default function SaleReceiptsScreen({ navigation, route }) {
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState(route.params.order_type);
  const [items, setItems] = useState([]);
  const [setLastOrder, setsetLastOrder] = useState();
  const [showLoading, setShowLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

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
    setHeader();
  }, [orderType, theme]);

  /**
   * Fetch Orders
   */

  /**
   * Get Orders from DB
   */
  function setHeader() {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: theme.accent,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 10, marginHorizontal: 10 }}
        >
          <AntDesign
            name="minuscircleo"
            size={24}
            color={theme.primary}
            style={{ fontWeight: 'semibold' }}
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <AntDesign
          name="menuunfold"
          size={24}
          color={theme.primary}
          onPress={() => navigation.openDrawer()}
          style={{ paddingLeft: 10 }}
        />
      ),
    });
  }
  async function getItems() {
    ItemService.getItems().then(setItems);
  }

  function refreshOrders() {
    OrderService.ordersWithItems(setOrders, orderType).then((results) => {
      setLastOrder(results[results.length - 1]);
    });
  }

  const renderOrder = useCallback((item) => (
    <View style={{ flex: 0.5, marginHorizontal: 2 }}>
      <RenderReceipt item={item} index={item.id} key={item.id} />
    </View>
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

  /**
   * Render to the screen
   */
  return (
    <View style={{ marginVertical: 10 }}>
      {orders.length > 0 ? (
        <FlatList
          style={{ bottom: 1 }}
          data={orders}
          renderItem={renderOrder}
          keyExtractor={keyExtractor}
          numColumns={2}
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
