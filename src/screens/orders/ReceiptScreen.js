import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  InteractionManager,
  StyleSheet,
  FlatList,
  Dimensions,
  ToastAndroid,
  ScrollView,
  Image,
  Text,
  Alert,
} from 'react-native';
import { t } from 'i18n-js';
import CustomerService from '../../services/CustomerService';
import { useFocusEffect } from '@react-navigation/native';
import { money, number } from '../../helpers/Numbers';
import OrderService from '../../services/OrderService';
import ItemService from '../../services/ItemService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ReceiptOrderItems from './ReceiptOrderItems';
import ZigzagView from 'react-native-zigzag-view';
import { getSetting } from '../../models/AsyncStorage';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import CheckButton from '../../components/CheckButton';
import * as Analytics from 'expo-firebase-analytics';
import { ThemeContext } from '../../../App';
import PaylinkButton from '../../components/PaylinkButton';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import QrCode from '../../components/QrCode';

// Retrieve user windows height
const windowHeight = Dimensions.get('window').height;

export default function ReceiptScreen({ navigation, route }) {
  const [order, setOrder] = useState(route.params.order);
  const ref = useRef();
  const payment = order?.payments[0];
  const [orderType, setOrderType] = useState(order.order_type);
  const [customer, setCustomer] = useState({ names: 'Guest ' });
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState([]);
  const [businessName, setBusinessName] = useState([]);
  const [phone, setPhone] = useState([]);
  const [email, setEmail] = useState([]);
  const [tin, setTin] = useState([]);
  const [person, setPerson] = useState([]);
  const [currency, setCurrency] = useState(null);
  const { theme } = useContext(ThemeContext);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ['100%'];

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
    navigation.setOptions({
      headerTitle:
        orderType.substr(0, 4).charAt(0).toUpperCase() + ' #' + route.params.order.id.toString(),
    });
    updateNavRight();

    // Get Items for suggestions
    getItems();

    // Get order Customer
    getOrderCustomer();

    // Fetch app settings
    retrieveSetting();
    // Fetch order from the database
    refreshOrder();
  }, []);

  function updateNavRight() {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.accent,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              ref.current.capture().then((uri) => {
                console.log('capture receipt uri ', uri);
                setImageUri(uri);
              });
            }}
            style={{ paddingRight: 20 }}
          >
            <MaterialCommunityIcons
              name="fit-to-screen"
              size={24}
              color="#47a67f"
              onPress={captureAndShareReceipt}
              onLongPress={() =>
                ToastAndroid.show('Share receipt on other platforms', ToastAndroid.SHORT)
              }
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }

  function captureAndShareReceipt() {
    ref.current.capture().then((uri) => {
      console.log('file uri ', uri);
      Sharing.shareAsync('file://' + uri);
    }).catch((error) => console.error('Oops, snapshot failed', error));
  }

  async function getOrderCustomer() {
    if (order.customer_supplier_id === 0) return;
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

  async function retrieveSetting() {
    getSetting('business_name').then(setBusinessName);
    getSetting('contact_address').then(setAddress);
    getSetting('contact_phone').then(setPhone);
    getSetting('app_default_currency').then(setCurrency);
    getSetting('TIN').then(setTin);
    getSetting('contact_person').then(setPerson);
    getSetting('contact_email').then(setEmail);
  }

  async function refreshOrder() {
    OrderService.ordersWithItems(setOrder, orderType, order.id).then(() => {
      getOrderCustomer();
    });
  }

  async function getItems() {
    ItemService.getItems().then(setItems);
  }

  const dayjs = require('dayjs');
  const date = payment.date_paid;

  const ReceiptItems = useCallback(({ item }) => {
    return <ReceiptOrderItems item={item} />;
  }, []);

  async function handleCheckout() {
    if (order.status === 'pending') {
      Alert.alert(
        'Are you sure you want to checkout ? ',
        'This action is irreversible. Once you check out , you may not check back in!',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'CANCEL',
          },
          { text: 'Checkout', onPress: () => checkout() },
        ]
      );
    } else {
      navigation.goBack();
    }
  }

  async function handlePaylink() {
    bottomSheetModalRef.current?.present();
  }

  async function checkout() {
    Analytics.logEvent('checkout', {
      shop: businessName,
      method: 'checkout',
    });
    OrderService.addComplete(order.id).then(() => {
      navigation.navigate('Order Sale').then(() => {
        ToastAndroid.show('Checkout complete', ToastAndroid.SHORT);
      });
    });
  }

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={[styles.container]}>
      <ScrollView>
        <View>
          <ViewShot
            options={{
              fileName: `S0D-${order.id} Invoice statement`,
              format: 'png',
              quality: 1.0,
            }}
            style={{ backgroundColor: '#f1f1f1' }}
            ref={ref}
          >
            <ZigzagView style={{ padding: 4 }}>
              <Image
                source={require('./../../../assets/dukapp-color.png')}
                style={{ width: 50, height: 50, marginHorizontal: 30, marginTop: 10 }}
              />
              <View style={styles.shopDetailsContainer}>
                <Text style={styles.shopName}>{businessName}</Text>
                <Text style={styles.shopAddress}>{address}</Text>
                <Text style={styles.shopAddress}>{phone}</Text>
                <Text style={styles.shopAddress}>{email}</Text>
              </View>

              <View style={styles.orderContainer}>
                <View style={styles.orderDetails}>
                  <Text style={styles.receiptNumber}># {payment.transaction_id}</Text>
                </View>

                <View style={styles.customerContainer}>
                  <Text style={styles.customerText}>
                    {order.order_type === 'sale' ? t('receipt.customer') : t('receipt.supplier')}
                    {customer.names}
                  </Text>
                </View>

                <View style={styles.paymentsContainer}>
                  <Text style={styles.paymentTitle}>
                    {t('receipt.payment')}
                    {payment.title}
                  </Text>
                </View>
                <View style={styles.paymentsContainer}>
                  <Text style={styles.paymentTitle}>
                    {t('receipt.date')}
                    {order.created_at}
                  </Text>
                </View>
              </View>

              <View style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemNameHeader}> {t('receipt.item_name')}</Text>
                  <Text style={styles.itemAmountHeader}>
                    {t('receipt.amount', { currency: currency })}
                  </Text>
                </View>
                <FlatList
                  data={order.line_items}
                  renderItem={ReceiptItems}
                  keyExtractor={keyExtractor}
                />

                <View style={styles.footer}>
                  <Text style={styles.totalLabel}> {t('receipt.total')}</Text>
                  <Text style={styles.totalAmount}>{number(order.total)}</Text>
                </View>
              </View>

              <Text style={styles.poweredByText}>
                POWERED BY DUKAPP
              </Text>
            </ZigzagView>
          </ViewShot>
        </View>
      </ScrollView>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{
            backgroundColor: theme.accent,
            padding: 0,
            borderTopColor: theme.colorIcon,
          }}
          handleIndicatorStyle={{ backgroundColor: theme.colorIcon }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Text style={{ color: theme.text, opacity: 0.7, fontSize: 14 }}>
              Scan the Qr Code to Pay
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <QrCode phoneNumber={phone} orderTotal={order.total} />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <View style={styles.buttonRow}>
        <PaylinkButton onPress={handlePaylink} />
        <CheckButton onPress={handleCheckout} />
      </View>
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 8, // Optional margin around the row
  },
  poweredByText: {
    textAlign: 'center', // Center the text
    paddingVertical: 10, // Add vertical padding
    paddingHorizontal: 15, // Add horizontal padding
    fontSize: 14, // Adjust font size as needed
    color: "gray", // Use the theme's text color
    fontWeight: '800', // Use a lighter font weight for a minimal look
    backgroundColor: 'transparent', // Ensure the background is transparent
  },
  orderContainer: {
    paddingHorizontal: 30,
  },
  shopDetailsContainer: {
    marginTop: 20,
  },
  shopName: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: '#4a5568',
  },
  shopAddress: {
    fontSize: 15,
    padding: 5,
    textAlign: 'center',
    color: '#4a5568',
  },
  itemName: {
    fontWeight: 'bold',
    paddingRight: 10,
    paddingVertical: 10,
  },
  itemDescription: {
    paddingRight: 10,
  },
  receiptNumber: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    margin: 20,
    color: '#4a5568',
  },
  customerContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  customerText: { color: '#4a5568' },
  date: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    color: '#4a5568',
  },

  paymentsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  paymentTitle: {
    fontSize: 16,
    color: '#4a5568',
  },
  paymentAmount: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#14532d',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#cbd5e0',
    marginTop: 15,
    paddingTop: 10,
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  itemContainer: {
    marginTop: 30,
    padding: 30,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#cbd5e0',
    borderBottomWidth: 0.3,
    padding: 5,
    marginBottom: 3,
  },
  itemNameHeader: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    color: '#4a5568',
  },
  itemAmountHeader: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#4a5568',
  },
});
