import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager,
  KeyboardAvoidingView,
  FlatList,
  Keyboard,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import InputSend from '../../components/InputSend';
import SuggestionButton from '../../components/SuggestionButton';
import ItemService from '../../services/ItemService';
import OrderService from './../../services/OrderService';
import RenderOrder from './RenderOrder';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { ToastAndroid } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../../../firebase';
import { ThemeContext } from '../../../App';

const windowHeight = Dimensions.get('window').height;

// Constants
export default function OrderScreen({ navigation, route }) {
  const [typing, setTyping] = useState('');
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const [showIsLoading, setShowIsLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);

  /** Fix the undefined order_type error */
  const orderType = route.order_type == undefined ? 'sale' : routeParams.order_type;
  // const orderType = 'sale'
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshOrders();
        getItems();
      });
    }, [])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    getItems();
    refreshOrders();
    resetToDefaultSuggestion();
    setHeader();
    tracker();
  }, [orderType, theme]);

  // track screen on google analytics
  async function tracker() {
    Analytics.setUserId(user.email);
    Analytics.logEvent('users', {
      user: user.email,
      screen: 'screens',
      navigation: 'Order Screen',
    });
  }
  /**
   * Fetch Orders
   */
  function refreshOrders() {
    OrderService.ordersWithItems(setOrders, orderType)
      .then((results) => {
        setLastOrder(results[results.length - 1]);
      })
      .then(() => setShowIsLoading(false));
  }

  function setHeader() {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: theme.text,
      },
      headerStyle: {
        backgroundColor: theme.accent,
      },
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
  /**
   * Get Orders from DB
   */
  async function getItems() {
    ItemService.getItems().then(setItems);
  }

  /**
   * sellItem
   */
  async function sellNewItem() {
    // 1. Redirect to add new item Screen
    navigation.navigate('New Item', {
      item_name: typing,
      action_type: 'add_product_and_sale',
      order_type: orderType,
    });
    // 2. Store Item and redirect back to Sale after

    // Clear the input text
    setTyping('');
  }

  /**
   * Add product or item from suggestion
   */
  async function saleFromSuggestion(item) {
    /** Prevent having negative balance */
    if (item.quantity <= 0) {
      Alert.alert(
        'The Stock of : ' + item.name + ' is insuffient #',
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

    // 1. Record the order in the database
    OrderService.quickSale(item, orderType)
      .then((results) => {
        // load the order because sometimes the query is long
        setOrderLoading(true);
        // 2. Refresh order list
        refreshOrders();
        setOrderLoading(false);
        // 3. Hide Keyboard
        Keyboard.dismiss();

        // 4. Clear the input text
        setTyping('');

        // 5. Reset suggestions
        resetToDefaultSuggestion();

        ToastAndroid.show('Order Successfully Made', ToastAndroid.SHORT);
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Reset to Default Suggestion
   */
  function resetToDefaultSuggestion() {
    setSuggestions([]);
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

    // 1. Make a quick new sale
    if (type === 'product') {
      await saleFromSuggestion(suggestion);
      return;
    }

    //////////////////////////////////////////////////
    // For us to reach here, it means we have orders //
    // and shop manager wants to add either payment //
    // or the customer to the last order, and       //
    // this is only possible when we have at        //
    // least 1 order sold in this shop             //
    /////////////////////////////////////////////////

    if (orders.length < 1) {
      throw 'Please sale before add proceeding';
    }

    // 0. Get latest order ID to assign the payment
    //    or the customer or partner to

    const lastOrder = orders[orders.length - 1];

    /**
     * Perform smart action based on the suggested
     * Button the user pressed on the screen
     */
    // 1. Add a Customer
    if (type === 'add_customer') {
      navigation.navigate('New Customer', {
        order: lastOrder,
      });
    }

    // 2. Add a payment
    if (type === 'add_payment') {
      navigation.navigate('Add Payment To Order', {
        order: lastOrder,
      });
    }
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

  const renderSuggestion = useCallback(({ item }) => {
    return (
      <SuggestionButton title={item.name} onPress={() => saleSuggestion(item)} theme={theme} />
    );
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  if (showIsLoading) {
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Display order summary */}
      <FlatList
        inverted
        style={{ bottom: 1 }}
        data={orders}
        renderItem={renderOrder}
        keyExtractor={keyExtractor}
      />
      {orderLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15 }}>
          <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
        </View>
      ) : (
        <></>
      )}
      {/**Suggestion to simplify order entry */}
      {/* Only show suggestion when user has entered something to search */}
      {(suggestions.length > 0 && typing.length > 0) > 0 ? (
        <FlatList
          style={[styles.suggestions, { backgroundColor: theme.accent }]}
          data={suggestions}
          renderItem={renderSuggestion}
          pagingEnabled={true}
          keyExtractor={keyExtractor}
        />
      ) : (
        <></>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled>
        {/**Quick sale */}
        <InputSend
          style={{ bottom: 140, backgroundColor: theme.accent }}
          onChangeText={handleTypingSuggestions}
          onPress={sellNewItem}
          value={typing}
          placeholder={'Quick sale'}
          theme={theme}
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
    borderRadius: 3,
    alignSelf: 'center',
    height: windowHeight,
    position: 'relative',
    marginTop: 10,
    elevation: 15,
    flex: 1,
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
