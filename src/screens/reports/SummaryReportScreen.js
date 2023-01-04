import React, { useCallback, useEffect, useState } from 'react';
import { InteractionManager, ActivityIndicator, View } from 'react-native';
import { t } from 'i18n-js';
import { Title } from 'react-native-paper';
import { money, number } from '../../helpers/Numbers';
import { getSetting } from '../../models/AsyncStorage';
import RevenueBarChart from './RevenueBarChart';
import ReportService from './../../services/ReportService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RenderReportItem } from './SummaryReportItem';

export default function SummaryReportScreen() {
  const [currency, setCurrency] = useState(null);
  const [showLoading, setshowLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const navigation = useNavigation();
  // Revenue summaries
  const [sales, setSales] = useState(0);
  const [profit, setProfit] = useState(0);
  const [onCredit, setOnCredit] = useState(0);
  const [revenueSummaries, setRevenueSummaries] = useState([
    { color: '#14b8a6', title: 'Sales', value: sales },
    { color: '#4ade80', title: 'Profit', value: profit },
    { color: '#f1c40f', title: 'On Credit', value: onCredit },
  ]);

  // Payment method summaries
  const [byCash, setByCash] = useState(0);
  const [byMobile, setByMobile] = useState(0);
  const [byCredit, setByCredit] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState([
    { color: '#718096', title: 'By Cash', value: byCash },
    { color: '#718096', title: 'By Mobile', value: byMobile },
    { color: '#718096', title: 'All', value: byCredit },
  ]);

  // Stock Summaries

  const [inStock, setInStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [fastMoving, setFastMoving] = useState(0);
  const [slowMoving, setSlowMoving] = useState(0);
  const [stockSummaries, setStockSummaries] = useState([
    { color: '#4ade80', title: 'In Stock ', value: inStock, route: 'In Stock' },
    { color: '#facc15', title: 'Low Stock', value: lowStock, route: 'Low Stock' },
    { color: '#84cc16', title: 'Fast Moving', value: fastMoving, },
    { color: '#fb923c', title: 'Slow Moving', value: slowMoving, },
  ]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshReportByDate(startDate, endDate);

      });
    }, [])
  );

  useEffect(() => {
    getSetting('app_default_currency').then(setCurrency);

    // Load data for the report
    refreshReportByDate(startDate, endDate);
  }, [stockSummaries, paymentMethod, revenueSummaries]);

  const keyExtractor = useCallback((index) => index.toString(), []);
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
    <View>
      <RevenueBarChart />
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 10,
          marginHorizontal: 10,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            paddingVertical: 2,
            paddingHorizontal: 2,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Title style={{ paddingHorizontal: 7, color: '#818096', fontSize: 12 }}>
            {t('report.revenue_summary')}
          </Title>
        </View>
        <View style={styles.row}>
          {revenueSummaries.map((item) => (
            <RenderReportItem
              title={item.title}
              value={money(item.value)}
              titleColor={item.color}
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
        <View style={styles.row}>
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
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
    paddingHorizontal: 1,
    marginHorizontal: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e0',
    borderRadius: 100,
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
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#718096',
  },
  value: {
    textAlign: 'center',
    fontWeight: 'semi-bold',
    fontSize: 16,
    alignSelf: 'center',
    color: '#4a5568',
  },
};
