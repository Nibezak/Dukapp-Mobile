import { InteractionManager, ActivityIndicator, View, TouchableOpacity, Text, ScrollView, ToastAndroid, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import ReportService from './../../services/ReportService';
import { money, number } from '../../helpers/Numbers';
import { getSetting } from '../../models/AsyncStorage';
import { RenderReportItem } from './SummaryReportItem';
import RevenueBarChart from './RevenueBarChart';
import { Title, Button } from 'react-native-paper';
import { t } from 'i18n-js';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import OrderService from '../../services/OrderService';
import { WelcomeInsights } from '../../components/WelcomeInsights';

export default function SummaryReportScreen() {
  const [currency, setCurrency] = useState(null);
  const [orderType, setOrderType] = useState('sale');
  const [orders, setOrders] = useState([]);
  const [showLoading, setshowLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const navigation = useNavigation();

  // Date Picker
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  // Revenue summaries
  const [sales, setSales] = useState(0);
  const [profit, setProfit] = useState(0);
  const [onCredit, setOnCredit] = useState(0);
  const [revenueSummaries, setRevenueSummaries] = useState([
    { color: '#14b8a6', title: 'Sales', value: sales, route: 'Insights' },
    { color: '#4ade80', title: 'Profit', value: profit, route: 'Insights' },
    { color: '#f1c40f', title: 'On Credit', value: onCredit, route: 'Insights' },
  ]);

  // Payment method summaries
  const [byCash, setByCash] = useState(0);
  const [byMobile, setByMobile] = useState(0);
  const [byCredit, setByCredit] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState([
    { color: '#718096', title: 'By Cash', value: byCash, route: 'Stock' },
    { color: '#718096', title: 'By Mobile', value: byMobile, route: 'Insights' },
    { color: '#718096', title: 'Total ', value: byCredit, route: 'Insights' },
  ]);

  // Stock Summaries

  const [inStock, setInStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [fastMoving, setFastMoving] = useState(0);
  const [slowMoving, setSlowMoving] = useState(0);
  const [stockSummaries, setStockSummaries] = useState([
    { color: '#4ade80', title: 'In Stock ', value: inStock, route: 'Insights' },
    { color: '#fb923c', title: 'Low Stock', value: lowStock, route: 'Insights' },
    { color: '#84cc16', title: 'Fast going', value: fastMoving, route: 'Insights' },
    { color: '#facc15', title: 'Slow going', value: slowMoving, route: 'Insights' },
  ]);
  // Display on back button
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshReportByDate(startDate, endDate);
      });
    }, [startDate, endDate])
  );

  /** FORCE RERENDER ON STATE CHANGE */
  useCallback(() => {
    refreshReportByDate(startDate, endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    getSetting('app_default_currency').then(setCurrency);
    setHeader();
    refreshOrders();
    // Load data for the report
    refreshReportByDate(startDate, endDate);
  }, [startDate, endDate]);

  const keyExtractor = useCallback((index) => index.toString(), []);

  function setHeader() {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerRight: () => (
        <>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 10, marginHorizontal: 10 }}
            >
              <AntDesign name="minuscircleo" size={24} color="#718096" style={{ fontWeight: 'semibold' }} />
            </TouchableOpacity>
          </View>
        </>
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

  async function refreshOrders() {
    return OrderService.ordersWithItems(setOrders, orderType, null, 8).then(() => setshowLoading(false))
  }
  /**
   * Fetch report from database based on the date
   * @param {string} startDate
   * @param {string} endDate
   */
  function refreshReportByDate(startDate, endDate) {
    // 1. Refresh revenue reports
    ReportService.sales(
      (sales) => {
        revenueSummaries[0].value = sales;
      },
      startDate,
      endDate
    );
    ReportService.profit((profit) => (revenueSummaries[1].value = profit), startDate, endDate);
    ReportService.salesByPayment(
      (credit) => (revenueSummaries[2].value = credit),
      startDate,
      endDate,
      'credit'
    );

    // 2. Refresh payment reports
    ReportService.salesByPayment(
      (cashSales) => (paymentMethod[0].value = cashSales),
      startDate,
      endDate,
      'cash'
    );
    ReportService.salesByPayment(
      (mobileMoneySales) => (paymentMethod[1].value = mobileMoneySales),
      startDate,
      endDate,
      'mobile'
    );
    ReportService.salesByPayment(
      (otherSales) => (paymentMethod[2].value = otherSales),
      startDate,
      endDate,
      'All'
    );

    // 3. Refresh items/ inventory reports
    ReportService.inStockItems((AvailableStock) => (stockSummaries[0].value = AvailableStock));
    ReportService.lowStockItems((lowStock) => (stockSummaries[1].value = lowStock));
    ReportService.fastMovingStock(
      (fastMoving) => (stockSummaries[2].value = fastMoving),
      '2000-01-01',
      endDate
    );

    ReportService.slowMovingStock(
      (slowMoving) => {
        stockSummaries[3].value = slowMoving;

        // We have loaded all values. Let's hide the loading screen
        setshowLoading(false);
      },
      startDate,
      endDate
    );
  }

  const dayjs = require('dayjs');
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


  return (
    <View style={styles.container}>

      {orders.length === 0 ? (
        <WelcomeInsights />
      ) : (
        <>

          <View>

            <View style={[styles.datePicker, { flexDirection: 'row' }]}>
              {/* SECTION FOR DATE PICKER */}
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateSelector}>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Text style={{ color: '#718096', fontSize: 12 }}>Start Date</Text>
                </View>
                <Text style={styles.title}>{startDate.toString()}</Text>
              </TouchableOpacity>
              <Text style={[styles.title, { fontWeight: 'bold' }]}> {'-'} </Text>
              <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateSelector}>
                <View style={{ flexDirection: "row", justifyContent: "center", }}>
                  <Text style={{ color: '#718096', fontSize: 12 }}>End Date</Text>
                </View>
                <Text style={styles.title}>{endDate.toString()}</Text>
              </TouchableOpacity>
            </View>
            {showStartDatePicker && (
              <DateTimePicker
                value={new Date(startDate)}
                mode={'date'}
                maximumDate={new Date()}
                display={'default'}
                accentColor={'#718096'}
                onChange={(event, date) => {
                  /** Hide the start date */
                  setShowStartDatePicker(!showStartDatePicker)
                  /** Update the start date */
                  ToastAndroid.show('Choose end date to continue', ToastAndroid.SHORT);
                  setStartDate(date.toISOString().slice(0, 10))
                }}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={new Date(endDate)}
                mode={'d  ate'}
                display={'default'}
                accentColor={'#718096'}
                // Ensure This is always greator than start date
                minimumDate={new Date(startDate)}
                maximumDate={new Date()}
                onChange={(event, date) => {
                  /** Hide the end date */
                  setShowEndDatePicker(!showEndDatePicker);
                  /** Update the start date */
                  setEndDate(date.toISOString().slice(0, 10));
                }}
              />
            )}

            {/* END DATE PICKER SECTION */}
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                marginHorizontal: 10,
                borderRadius: 10,
                width: '100%',
                height: 500,
              }}
            >
              <ScrollView>
                <View style={{ backgroundColor: "white", marginRight: "1%", elevation: 30 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
                    <Text style={{ color: '#818096' }}>Summary</Text>
                  </View>
                  <View style={styles.row}>
                    {revenueSummaries.map((item, index) => (
                      <RenderReportItem
                        title={item.title}
                        value={money(item.value)}
                        titleColor={item.color}
                        key={keyExtractor(index)}
                        route={item.route}
                      />
                    ))}
                  </View>
                  <View
                    style={{
                      paddingVertical: 2,
                      paddingHorizontal: 2,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Title style={{ paddingHorizontal: 7, color: '#818096', fontSize: 12 }}>
                      {t('report.payment_summary')}
                    </Title>
                  </View>
                  <View style={styles.row}>
                    {paymentMethod.map((item, index) => (
                      <RenderReportItem
                        title={item.title}
                        value={money(item.value)}
                        titleColor={item.color}
                        key={keyExtractor(index)}
                        route={item.route}
                      />
                    ))}
                  </View>
                  <View
                    style={{
                      paddingVertical: 2,
                      paddingHorizontal: 2,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Title style={{ paddingHorizontal: 7, color: '#818096', fontSize: 12 }}>
                      {t('report.items_summary')}
                    </Title>
                  </View>
                  <View style={styles.row2}>
                    {stockSummaries.map((item, index) => (
                      <RenderReportItem
                        title={item.title}
                        value={number(item.value)}
                        titleColor={item.color}
                        route={item.route}
                        key={keyExtractor(index)}
                      />
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  subHeader: {
    paddingHorizontal: 7,
    color: '#718096',
    marginTop: 10,
    fontSize: 16,
  },
  rowText: {
    justifyContent: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    padding: 10,
    // backgroundColor: '#f7fafc',
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#718096',
  },
  dateSelector: {
    paddingHorizontal: 50,
    marginHorizontal: 5,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",

    marginVertical: 30,
    elevation: 5

  },
  value: {
    textAlign: 'center',
    fontWeight: 'semi-bold',
    fontSize: 16,
    alignSelf: 'center',
    color: '#4a5568',
  },
  datePicker: {

    justifyContent: "center"
  }
};
