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
import { numberFromString, number } from '../../helpers/Numbers';
import RenderOrderLineItem from './RenderOrderLineItem';
import OrderService from '../../services/OrderService';
import ItemService from '../../services/ItemService';
import InputSend from '../../components/InputSend';
import { MaterialIcons } from '@expo/vector-icons';
import RenderPayment from './RenderPayment';
import Order from '../../models/Order';
import Item from '../../models/Item';
import { isFirstDayOfMonth } from 'date-fns';
import NextButton from '../../components/NextButton';
import { ThemeContext } from '../../../App';
import { Theme } from '../../helpers/theme';

// Retrieve user windows height
const windowHeight = Dimensions.get('window').height;

export default function OrderDetailsScreen({ navigation, route }) {
  const [order, setOrder] = useState(route.params.order);
  const [orderType, setOrderType] = useState(order.order_type);
  const [orderLineItems, setOrderLineItems] = useState(order.line_items);
  const [customer, setCustomer] = useState({ names: 'Guest ' });
  const [typing, setTyping] = useState('');
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currency, setCurrency] = useState(null);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshOrder();
      });
    }, [])
  );
  useEffect(() => {
    // Update the order detail nav
    if (order.status === 'complete') {
      navigation.navigate('Order Receipt', {
        order: order,
        customer: customer,
      });
    }
    navigation.setOptions({
      headerTitle:
        orderType.substr(0, 4).charAt(0).toUpperCase() + ' #' + route.params.order.id.toString(),
      headerTintColor: theme.text,
      headerStyle: { backgroundColor: theme.accent },
    });
    updateNavRight();

    // Get Items for suggestions
    getItems();

    //  Get order Customer

    getOrderCustomer();

    //  Remove payment option if customer paid
    resetToDefaultSuggestion();

    // Fetch order from the database

    refreshOrder();
  }, []);

  /**
   * Method to update the top right navitation
   */
  function updateNavRight() {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              paddingHorizontal: 14,
              backgroundColor: theme.background,
              marginRight: 14,
              borderRadius: 10,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: theme.text,
              opacity: 0.8,
              paddingVertical: 3,
              elevation: 3,
            }}
          >
            {route.params.order.status}
          </Text>

          {/* Show delete button */}
          <TouchableOpacity onPress={handleDeleteButton} style={{ paddingRight: 20 }}>
            <MaterialIcons name="delete" size={24} color={theme.danger} />
          </TouchableOpacity>
        </View>
      ),
    });
  }

  /**
   * Handle Delete button, but start by confirming with the user
   * of the application before proceeding
   */
  function handleDeleteButton() {
    Alert.alert(
      'Deleting Order #' + order.id,
      'Are you sure you want to delete order #' + order.id + '?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'CANCEL',
        },
        { text: 'DELETE', onPress: () => deleteThisOrder() },
      ]
    );
  }

  /**
   * Method to destroy the order from the database
   */
  function deleteThisOrder() {
    /** Pass order to be deleted */
    Order.destroy(order.id)
      .then((result) => {
        return navigation.goBack();
      })
      .then(() => {
        ToastAndroid.show(t('welcome.order_deleted'), ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Get Customer By Id
   */
  async function getOrderCustomer() {
    if (order.customer_supplier_id === 0) {
      // Nothing to do if there is no customer or
      // supplier
      return;
    }

    // Find Customer for this order and attach to the order
    CustomerService.find(order.customer_supplier_id)
      .then((result) => {
        if (result.length > 0) {
          setCustomer(result[0]);
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Handle Quantity Changes
   */
  async function handleQuantityChange(orderItem, action) {
    /** Preventing selling more than what is in the stock */
    if (action === 'sale-more') {
      /** 1. Get the this item stock */
      return Item.find(orderItem.itemId).then((stockItem) => {
        /** 2. If the stock is lesser than what we are adding, then don't allow it to proceed */
        if (stockItem.quantity <= 0) {
          return Alert.alert(
            'The Stock of : ' + stockItem.name + ' is insuffient #',
            'The remaining quantity is : ' +
            stockItem.quantity +
            ' Please Add more stock to be able to sell',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'CANCEL',
              },
            ]
          );
        }

        /** We have enough stock, let's update */
        return updateOrderLineItemQuantity(orderItem, action);
      });
    }

    /** We reached here because the action does not demand to check if the stock is enough */
    return updateOrderLineItemQuantity(orderItem, action);
  }

  /**
   * Updates order line item quantity
   *
   * @returns promise
   */
  async function updateOrderLineItemQuantity(orderItem, action) {
    /** We have enough stock, let's update it */
    OrderService.updateOrderItem(orderItem, action).then(() => {
      // Refresh the order details page
      refreshOrder();
    });
  }

  /**
   * sellItem
   */
  async function sellNewItem() {
    // 1. Redirect to add new item Screen
    navigation.navigate(`${t('screens.newItem')}`, {
      item_name: typing,
      order_id: order.id,
      action_type: 'add_product_and_sale',
      order_type: orderType,
    });
  }

  /**
   * Get orders
   */
  async function refreshOrder() {
    OrderService.ordersWithItems(setOrder, orderType, order.id).then((result) => {
      // 1. Update the customer
      getOrderCustomer();
    });
  }

  /**
   * Get Orders from DB
   */
  async function getItems() {
    ItemService.getItems().then(setItems);
  }

  /**
   * Handle Typing
   */
  function handleTypingSuggestions(text) {
    // 1. Set entered text
    setTyping(text);
    const itemsToSearchFrom = items;
    // 2. Find items matching what the user typed
    //    and suggest the user these items
    let newSuggestions = itemsToSearchFrom.filter((item) => {
      return item.name.toLowerCase().startsWith(text.toLowerCase());
    });

    // 3. If there found, let the user know
    // and show Add new product button
    newSuggestions = newSuggestions === null ? [] : newSuggestions;

    // 4. Transform items to allow the suggestion engine
    //    to know what to do when the item is pressed
    newSuggestions = newSuggestions.map((item) => {
      return {
        ...item,
        suggestionType: 'product',
      };
    });

    // Update Suggestions
    setSuggestions(newSuggestions);
  }
  /**
   * Make sales from suggestions
   */
  async function saleSuggestion(suggestion) {
    const suggestionTypes = ['add_customer', 'add_payment', 'change_order_type', 'product'];

    const type = suggestion.suggestionType;

    // Ensure we can process known types
    if (!suggestionTypes.includes(type)) {
      throw 'Suggestion Type unknown:' + type;
    }

    // 0. Get latest order ID to assign the payment
    //    or the customer or partner to

    // 1. Add a normal product
    if (type === 'product') {
      addItemFromSuggestion(suggestion);
    }

    /**
     * Perform smart action based on the suggested
     * Button the user pressed on the screen
     */
    // 1. Add a Customer
    if (type === 'add_customer') {
      navigation.navigate('Search Customer', {
        order: order,
      });
    }

    // 2. Add a payment
    if (type === 'add_payment') {
      navigation.navigate('Add Payment To Order', {
        order: order,
      });
    }
  }

  /**
   * Add product or item from suggestion
   */
  async function addItemFromSuggestion(item) {
    /** Prevent having negative balance by checking if the item has enough*/
    if (item.quantity <= 0) {
      Alert.alert(
        'The Stock of ' + item.name + ' is insuffient #',
        'The remaining quantity is : ' +
        item.quantity +
        ' Please Add more stock to be able to sell',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'CANCEL',
          },
        ]
      );
      return;
    }

    // 1. If item exists, then increase it's quantity
    // Instead of adding it as a new product
    const existingItem = orderLineItems.find((itemLine) => itemLine.item_id == item.id);

    // This item found in the card increase its quantity
    if (existingItem !== undefined) {
      return handleQuantityChange(existingItem, orderType + '-more');
    }

    // 2. Add new Item to the order, it does not exists
    //   in this order. We reached here because the
    //   item does not exist in the current order
    const itemAttributes = {
      order_id: order.id,
      item_id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unit_cost_price: item.cost_price,
      unit_sales_price: item.sale_price,
      total: 1 * item.sale_price,
    };

    OrderService.addItemToOrder(itemAttributes, orderType).then((result) => {
      refreshOrder();
    });

    // // 4. Clear the input text
    setTyping('');

    // 5. Reset suggestions
    resetToDefaultSuggestion();
  }

  /**
   * Reset to Default Suggestion
   */
  function resetToDefaultSuggestion() {
    setSuggestions([]);
  }

  /**
   * Manually update order price item
   *
   */
  async function handlePriceManualChange(customTotal, itemToUpdate) {
    /** To proceed if this is not a number */
    const sanitizedTotal = parseFloat(customTotal.replace(',', ''));

    if (isNaN(sanitizedTotal)) {
      throw customTotal + ' is not a valid number!';
    }

    var cleanCustomTotal = Math.abs(sanitizedTotal);

    OrderService.setItemTotalManually(itemToUpdate, cleanCustomTotal).then((result) => {
      // Refresh the entire order
      refreshOrder();
    });
  }

  /**
   * Handle Quantity Manual Change
   */
  async function handleQuantityManualChange(customQuantity, itemToUpdate) {
    /** Prevent having negative balance by
     * checking if the item has enough
     */
    if (customQuantity > itemToUpdate.quantity) {
      /** 1. Find the difference in quantity */
      const difference = customQuantity - itemToUpdate.quantity;

      /** 2. Get the current available stock */
      Item.find(itemToUpdate.item_id).then((stockItem) => {
        /** 2. If the stock is lesser than what we are adding, then don't allow it to proceed */
        if (stockItem.quantity <= difference) {
          const message =
            'Not enough quantity for ' + stockItem.name + ' Remaining:' + stockItem.quantity;

          alert(message);
          /** Stop the program since an error occured */
          throw message;
        }
      });
    }

    /** To proceed if this is not a number */
    const sanitizedTotal = parseFloat(parseFloat(customQuantity.replace(',', '')));
    if (isNaN(sanitizedTotal)) {
      throw customQuantity + ' is not a valid number!';
    }

    var cleanCustomTotal = Math.abs(sanitizedTotal);
    OrderService.setItemQuantityManually(itemToUpdate, cleanCustomTotal);

    refreshOrder();
  }

  function handleReceipt() {
    navigation.navigate('Order Receipt', {
      order: order,
      customer: customer,
    });
  }

  const renderOrderLineItem = useCallback(({ item }) => {
    return (
      <RenderOrderLineItem
        item={item}
        onPriceChange={(total) => handlePriceManualChange(total, item)}
        onReduceQuantity={() => handleQuantityChange(item, orderType + '-less')}
        onChangingQuantity={(text) => handleQuantityManualChange(text, item)}
        onIncreaseQuantity={() => handleQuantityChange(item, orderType + '-more')}
      />
    );
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/** Order Payment*/}
      <RenderPayment customer={customer} order={order} />

      {/** Order customer */}

      {/** Order items */}
      <FlatList
        data={order.line_items}
        renderItem={renderOrderLineItem}
        keyExtractor={keyExtractor}
      />
      <View style={{ marginBottom: 10, paddingBottom: 5 }}>
        <NextButton onPress={handleReceipt} />
      </View>

      {/**Suggestion to simplify order entry */}
      {/* Only show suggestion when user has entered something to search */}
      {(suggestions.length > 0 && typing.length > 0) > 0 ? (
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
          pagingEnabled={true}
          keyExtractor={keyExtractor}
        />
      ) : (
        <></>
      )}
      <KeyboardAvoidingView behavior="height" enabled={true}>
        {/** Allow Items Search Entry */}
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

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  suggestions: {
    width: '95%',
    alignSelf: 'center',
    height: windowHeight / 3,
    position: 'absolute',
    bottom: 40,
    backgroundColor: Theme.accent,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemName: {
    fontWeight: 'bold',
    paddingRight: 10,
    paddingVertical: 10,
  },
  itemDescription: {
    paddingRight: 10,
  },
});
