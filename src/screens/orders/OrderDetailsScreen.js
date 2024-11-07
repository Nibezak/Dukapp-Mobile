import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  InteractionManager,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
  ToastAndroid,
  Text,
} from 'react-native';
import { t } from 'i18n-js';
import SuggestionButton from '../../components/SuggestionButton';
import CustomerService from '../../services/CustomerService';
import { useFocusEffect } from '@react-navigation/native';
import RenderOrderLineItem from './RenderOrderLineItem';
import OrderService from '../../services/OrderService';
import ItemService from '../../services/ItemService';
import InputSend from '../../components/InputSend';
import { MaterialIcons } from '@expo/vector-icons';
import RenderPayment from './RenderPayment';
import Order from '../../models/Order';
import Item from '../../models/Item';
import NextButton from '../../components/NextButton';
import { ThemeContext } from '../../../App';
import { Theme } from '../../helpers/theme';

const windowHeight = Dimensions.get('window').height;

export default function OrderDetailsScreen({ navigation, route }) {
  const [order, setOrder] = useState(route.params.order);
  const [orderType, setOrderType] = useState(order.order_type);
  const [orderLineItems, setOrderLineItems] = useState(order.line_items);
  const [customer, setCustomer] = useState({ names: 'Guest' });
  const [typing, setTyping] = useState('');
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currency, setCurrency] = useState(null);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        refreshOrder();
      });
      return () => task.cancel();
    }, [])
  );

  useEffect(() => {
    if (order.status === 'complete') {
      navigation.navigate('Order Receipt', {
        order: order,
        customer: customer,
      });
    }
    navigation.setOptions({
      headerTitle:
        `${orderType.charAt(0).toUpperCase()} #${route.params.order.id}`,
      headerTintColor: theme.text,
      headerStyle: { backgroundColor: theme.accent },
    });
    updateNavRight();
    fetchItems();
    fetchCustomerData();
    refreshOrder();
  }, [order]);

  const updateNavRight = () => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.headerStatusText(theme)}>
            {route.params.order.status}
          </Text>
          <TouchableOpacity onPress={handleDeleteOrder} style={{ paddingRight: 20 }}>
            <MaterialIcons name="delete" size={24} color={theme.danger} />
          </TouchableOpacity>
        </View>
      ),
    });
  };

  const handleDeleteOrder = () => {
    Alert.alert(
      `Deleting Order #${order.id}`,
      `Are you sure you want to delete order #${order.id}?`,
      [
        { text: 'Cancel', onPress: () => { }, style: 'cancel' },
        { text: 'Delete', onPress: deleteOrder },
      ]
    );
  };

  const deleteOrder = () => {
    Order.destroy(order.id)
      .then(() => navigation.goBack())
      .then(() => ToastAndroid.show(t('welcome.order_deleted'), ToastAndroid.SHORT))
      .catch((error) => console.error(error.message));
  };

  const fetchCustomerData = async () => {
    if (!order.customer_supplier_id) return;
    try {
      const result = await CustomerService.find(order.customer_supplier_id);
      if (result.length > 0) setCustomer(result[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchItems = async () => {
    try {
      const fetchedItems = await ItemService.getItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshOrder = async () => {
    try {
      await OrderService.ordersWithItems(setOrder, orderType, order.id);
      fetchCustomerData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = async (orderItem, action) => {
    if (action === 'sale-more') {
      const stockItem = await Item.find(orderItem.itemId);
      if (stockItem.quantity <= 0) {
        return Alert.alert(
          `Stock of ${stockItem.name} insufficient`,
          `Remaining: ${stockItem.quantity}. Add more stock to proceed.`
        );
      }
    }
    updateOrderItemQuantity(orderItem, action);
  };

  const updateOrderItemQuantity = async (orderItem, action) => {
    try {
      await OrderService.updateOrderItem(orderItem, action);
      refreshOrder();
    } catch (error) {
      console.error(error);
    }
  };

  const sellNewItem = () => {
    navigation.navigate(`${t('screens.newItem')}`, {
      item_name: typing,
      order_id: order.id,
      action_type: 'add_product_and_sale',
      order_type: orderType,
    });
  };

  const handleTypingSuggestions = (text) => {
    setTyping(text);
    const matchedItems = items.filter((item) =>
      item.name.toLowerCase().startsWith(text.toLowerCase())
    );
    const newSuggestions = matchedItems.map((item) => ({
      ...item,
      suggestionType: 'product',
    }));
    setSuggestions(newSuggestions);
  };

  const saleSuggestion = async (suggestion) => {
    if (suggestion.suggestionType === 'product') {
      addItemFromSuggestion(suggestion);
    } else if (suggestion.suggestionType === 'add_customer') {
      navigation.navigate('Search Customer', { order: order });
    } else if (suggestion.suggestionType === 'add_payment') {
      navigation.navigate('Add Payment To Order', { order: order });
    }
  };

  const addItemFromSuggestion = async (item) => {
    const existingItem = orderLineItems.find((lineItem) => lineItem.item_id === item.id);
    if (existingItem) return handleQuantityChange(existingItem, `${orderType}-more`);

    const itemAttributes = {
      order_id: order.id,
      item_id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unit_cost_price: item.cost_price,
      unit_sales_price: item.sale_price,
      total: item.sale_price,
    };

    try {
      await OrderService.addItemToOrder(itemAttributes, orderType);
      refreshOrder();
      setTyping('');
      setSuggestions([]);
    } catch (error) {
      console.error(error);
    }
  };

  const renderOrderLineItem = useCallback(({ item }) => (
    <RenderOrderLineItem
      item={item}
      onPriceChange={(total) => handlePriceChange(total, item)}
      onReduceQuantity={() => handleQuantityChange(item, `${orderType}-less`)}
      onQuantityChange={(text) => handleQuantityManualChange(text, item)}
      onIncreaseQuantity={() => handleQuantityChange(item, `${orderType}-more`)}
    />
  ), [orderLineItems]);

  const handlePriceChange = async (total, item) => {
    const sanitizedTotal = parseFloat(total.replace(',', ''));
    if (isNaN(sanitizedTotal)) throw new Error(`${total} is not a valid number!`);

    await OrderService.setItemTotalManually(item, sanitizedTotal);
    refreshOrder();
  };

  const handleQuantityManualChange = async (quantity, item) => {
    const sanitizedQuantity = parseInt(quantity.replace(',', ''), 10);
    if (isNaN(sanitizedQuantity)) throw new Error(`${quantity} is not a valid number!`);

    await OrderService.setItemQuantityManually(item, sanitizedQuantity);
    refreshOrder();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <RenderPayment customer={customer} order={order} />
      <FlatList
        data={order.line_items}
        renderItem={renderOrderLineItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={() => navigation.navigate('Order Receipt', { order, customer })} />
      </View>
      {suggestions.length > 0 && typing.length > 0 && (
        <FlatList
          style={styles.suggestions}
          data={suggestions}
          renderItem={({ item }) => (
            <SuggestionButton
              title={item.name}
              onPress={() => saleSuggestion(item)}
              theme={theme}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <KeyboardAvoidingView behavior="height">
        <InputSend
          onChangeText={handleTypingSuggestions}
          onPress={sellNewItem}
          value={typing}
          placeholder={t('order.type_to_sell')}
          theme={theme}
          bottom={10}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStatusText: (theme) => ({
    paddingHorizontal: 14,
    marginRight: 14,
    borderRadius: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingVertical: 3,
    backgroundColor: theme.background,
    color: theme.text,
    elevation: 3,
  }),
  nextButtonContainer: {
    marginBottom: 10,
    paddingBottom: 5,
  },
  suggestions: {
    width: '100%',
    alignSelf: 'center',
    height: windowHeight / 2,
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#F5F5F4',
    paddingVertical: 10,
  },
});
