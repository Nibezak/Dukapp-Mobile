import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import ZigzagView from 'react-native-zigzag-view';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import { AuthContext } from '../../context/AuthProvider';
import { money, number } from '../../helpers/Numbers';
import CustomerService from '../../services/CustomerService';
import { getSetting } from '../../models/AsyncStorage';
import * as Print from 'expo-print';
import { useFocusEffect } from '@react-navigation/native';

export default function ReceiptScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const order = route.params.order;
  const payment = order.payments[0];
  const [customer, setCustomer] = useState(route.params?.customer);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [tin, setTin] = useState(null);
  const [email, setEmail] = useState(null);
  const [person, setPerson] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        retrieveSetting();
      });
    }, [])
  );

  useEffect(() => {
    // update nav
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={printReceipt} style={{ paddingRight: 20 }}>
            <MaterialIcons name="print" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert('Sharing To Be Activated')}
            style={{ paddingRight: 20 }}
          >
            <MaterialIcons name="share" size={24} color={'#47a67f'} />
          </TouchableOpacity>
        </View>
      ),
    });

    // Fetch Customer
    getOrderCustomer();
    retrieveSetting();
  }, [customer]);

  /**
   * Retrieve Settings
   */
  function retrieveSetting() {
    getSetting('business_name').then(setBusinessName);
    getSetting('contact_address').then(setAddress);
    getSetting('contact_phone').then(setPhone);
    getSetting('app_default_currency').then(setCurrency);
    getSetting('TIN').then(setTin);
    getSetting('contact_person').then(setPerson);
    getSetting('contact_email').then(setEmail);
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
        setCustomer(result[0]);
        showLoading(false);
      })
      .catch((error) => {
        throw error;
      });
  }

  const dayjs = require('dayjs');
  const date = order.created_at;

  /**
   * Render items per order
   *
   * @returns html string
   */
  function renderInvoiceItemsHtml() {
    return order.line_items.map((item, index) => {
      return `<tr class="item">
                      <td colspan="2">${item.name}</td>
                      <td>x ${item.quantity}</td>
                      <td>${money(item.total)}</td>
                  </tr>`;
    });
  }

  const receiptPdfhtml = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <style>
    .invoice-box {
      max-width: 800px;
      margin: auto;
      padding: 30px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      font-size: 16px;
      line-height: 24px;
      font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
      color: #555;
    }
    
    .invoice-box table {
      width: 100%;
      line-height: inherit;
      text-align: left;
    }
    
    .invoice-box table td {
      padding: 5px;
      vertical-align: top;
    }
    
    .invoice-box table tr td:nth-child(n + 2) {
      text-align: right;
    }
    
    .invoice-box table tr.top table td {
      padding-bottom: 20px;
    }
    
    .invoice-box table tr.top table td.title {
      font-size: 45px;
      line-height: 45px;
      color: #333;
    }
    
    .invoice-box table tr.information table td {
      padding-bottom: 40px;
    }
    
    .invoice-box table tr.heading td {
      background: #eee;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }
    
    .invoice-box table tr.details td {
      padding-bottom: 20px;
    }
    
    .invoice-box table tr.item td {
      border-bottom: 1px solid #eee;
    }
    
    .invoice-box table tr.item.last td {
      border-bottom: none;
    }
    
    .invoice-box table tr.item input {
      padding-left: 5px;
    }
    
    .invoice-box table tr.item td:first-child input {
      margin-left: -5px;
      width: 100%;
    }
    
    .invoice-box table tr.total td:nth-child(2) {
      border-top: 2px solid #eee;
      font-weight: bold;
    }
    
    .invoice-box input[type="number"] {
      width: 60px;
    }
    
    @media only screen and (max-width: 600px) {
      .invoice-box table tr.top table td {
        width: 100%;
        display: block;
        text-align: center;
      }
    
      .invoice-box table tr.information table td {
        width: 100%;
        display: block;
        text-align: center;
      }
    }
    
    /** RTL **/
    .rtl {
      direction: rtl;
      font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
        sans-serif;
    }
    
    .rtl table {
      text-align: right;
    }
    
    .rtl table tr td:nth-child(2) {
      text-align: left;
    }
    
    </style>
    <body style="text-align: center;">
    <div class="invoice-box">
    <table cellpadding="0" cellspacing="0">
      <tr class="top">
        <td colspan="4">
          <table>
            <tr>
              <td class="title">
                <img src="https://pbs.twimg.com/profile_images/1499441965762547712/V7a_I9qV_400x400.jpg" style="width:30%; max-width:300px;">
              </td>

              <td>
                Invoice #: S0D${order.id}<br> Created: ${dayjs(date).format(
    'DD MMM YYYY'
  )}<br> Time: ${dayjs(date).format('h:mm A')}
              </td>
            </tr>
          </table>
        </td>
      </tr>
  
      <tr class="information">
        <td colspan="4">
          <table>
            <tr>
              <td>
                ${businessName}.<br> ${address}<br> 
                ${tin}<br>
              Customer:   ${customer.names}
              </td>
  
              <td>
                ${phone}}<br> ${person}<br> ${email}
              </td>
            </tr>
          </table>
        </td>
      </tr>
  
      <tr class="heading">
        <td colspan="3">Payment Method</td>
        <td>${payment.title} #</td>
      </tr>
  
      <tr class="details">
        <td colspan="3">Invoice #: S0D${order.id}</td>
        <td style="color: #47a67f; font-weight: semibold; font-size: large">COMPLETED</td>
      </tr>

      <thead>
      
      </thead>
      <tr class="heading">
        <td colspan="2">Item</td>
        <td>Quantity</td>
        <td>Price</td>
      </tr>
      ${renderInvoiceItemsHtml()}
      <tr class="total">
        <td colspan="3"></td>
        <td style="font-weight: bold"> Total: ${number(order.total)}</td>
      </tr>
    </table>
  </div>
    </body>
  </html>
  `;

  /**
   * Print receipt in PDF format
   */
  async function printReceipt() {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      receiptPdfhtml,
    });
  }

  return (
    <View>
      <ZigzagView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <Image
          source={require('./../../../assets/snack-icon.png')}
          style={{ width: 120, height: 100 }}
        />

        {/** RECEIPT HEADER */}
        <View style={styles.shopDetailsContainer}>
          <Text style={styles.shopName}>{businessName}</Text>
          <Text style={styles.shopAddress}>{address}</Text>
          <Text style={styles.shopAddress}>
            {t('receipt.telephone')}
            {phone}
          </Text>
        </View>

        {/** ORDER DETAILS */}
        <View style={styles.orderDetails}>
          <Text style={styles.receiptNumber}>#Invoice-number: {order.id}</Text>
        </View>

        {/** CUSTOMER DETAILS */}
        <View style={styles.customerContainer}>
          <Text style={styles.customerText}>
            {order.order_type === 'sale' ? t('receipt.customer') : t('receipt.supplier')}
            {customer.names}
          </Text>
        </View>

        {/** PAYMENT DETAILS */}
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

        {/** ORDER LINE ITEMS */}
        <View style={styles.itemContainer}>
          {/** HEADERS */}
          <View style={styles.itemHeader}>
            <Text style={styles.itemNameHeader}> {t('receipt.item_name')}</Text>
            <Text style={styles.itemAmountHeader}>
              {t('receipt.amount', { currency: currency })}
            </Text>
          </View>

          {/** ITEM LINES */}
          {order.line_items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name}
                {' x '} {item.quantity}
              </Text>
              <Text style={styles.itemAmount}>{number(item.total)}</Text>
            </View>
          ))}

          {/** FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.totalLabel}> {t('receipt.total')}</Text>
            <Text style={styles.totalAmount}>{number(order.total)}</Text>
          </View>
          <View></View>
        </View>
      </ZigzagView>
    </View>
  );
}

const styles = StyleSheet.create({
  shopDetailsContainer: {
    marginTop: 20,
  },
  shopName: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
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
  receiptNumber: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    margin: 20,
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
  shopAddress: {
    fontSize: 15,
    padding: 5,
    textAlign: 'center',
    color: '#4a5568',
  },
  itemContainer: {
    marginTop: 30,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#cbd5e0',
    borderBottomWidth: 1,
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
  itemRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#4a5568',
  },
  itemName: {
    fontSize: 15,
    color: '#4a5568',
  },
  itemAmount: {
    fontSize: 15,
    textDecorationStyle: 'solid',
    color: '#4a5568',
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
});
