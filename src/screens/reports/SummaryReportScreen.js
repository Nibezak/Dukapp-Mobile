import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { t } from 'i18n-js';
import { Text, Title } from 'react-native-paper';
import { money, number } from '../../helpers/Numbers';
import { getSetting } from '../../models/AsyncStorage';
import RevenueBarChart from './RevenueBarChart';
import ReportService from './../../services/ReportService';

function RenderReportItem({ value, title, titleColor }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity>
        <View style={styles.rowText}>
          <Text style={styles.value}>{value}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function SummaryReportScreen() {
  const [currency, setCurrency] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

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
    { color: '#718096', title: 'Others', value: byCredit },
  ]);

  // Stock Summaries
  const [inStock, setInStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [fastMoving, setFastMoving] = useState(0);
  const [slowMoving, setSlowMoving] = useState(0);
  const [stockSummaries, setStockSummaries] = useState([
    { color: '#4ade80', title: 'In Stock ', value: inStock },
    { color: '#facc15', title: 'Low Stock', value: lowStock },
    { color: '#84cc16', title: 'Fast Moving', value: fastMoving },
    { color: '#fb923c', title: 'Slow Moving', value: slowMoving },
  ]);

  useEffect(() => {
    getSetting('app_default_currency').then(setCurrency);

    // Load data for the report
    refreshReportByDate(startDate, endDate);
  }, []);

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
      'other'
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
      (slowMoving) => (stockSummaries[3].value = slowMoving),
      startDate,
      endDate
    );
  }

  return (
    <View>
      <RevenueBarChart />

      <View style={{ marginTop: 14 }}>
        <Title style={{ paddingHorizontal: 7, color: '#718096', fontSize: 16 }}>
          {t('report.revenue_summary')}
        </Title>

        <View style={styles.row}>
          {revenueSummaries.map((item) => (
            <RenderReportItem
              title={item.title}
              value={money(item.value)}
              titleColor={item.color}
            />
          ))}
        </View>

        <Title style={styles.subHeader}>{t('report.payment_summary')}</Title>
        <View style={styles.row}>
          {paymentMethod.map((item) => (
            <RenderReportItem
              title={item.title}
              value={money(item.value)}
              titleColor={item.color}
            />
          ))}
        </View>

        <Title style={styles.subHeader}>{t('report.items_summary')}</Title>
        <View style={styles.row}>
          {stockSummaries.map((item) => (
            <RenderReportItem
              title={item.title}
              value={number(item.value)}
              titleColor={item.color}
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
    backgroundColor: '#f7fafc',
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
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
    color: '#4a5568',
  },
};
