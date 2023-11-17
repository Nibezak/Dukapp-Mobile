import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18n-js";
import HomeButton from "../../components/HomeButton";

export default function HomeMenus() {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.row}>
        <HomeButton
          title={t('order.orders_sales')}
          description={t('order.orders_description')}
          color={'#10b981'}
          onPress={() =>
            navigation.navigate(`${t('screens.orders')}`, {
              order_type: 'sale',
            })
          }
          icon={'cart-arrow-up'}
        />
        <HomeButton
          title={t('order.orders_purchases')}
          description={t('order.orders_description')}
          activeOpacity={0.9}
          color={'#14b8a6'}
          onPress={() =>
            navigation.navigate(`${t('screens.orders')}`, {
              order_type: 'purchase',
            })
          }
          icon={'cart-plus'}
        />
      </View>

      <View style={styles.row}>
        <HomeButton
          title={t('customer.customers')}
          description={t('customer.customers_description')}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Customers List')}
          icon={'account-group'}
        />
        <HomeButton
          title={t('supplier.suppliers')}
          description={t('supplier.suppliers_description')}
          onPress={() => navigation.navigate('Supplier List')}
          icon={'truck-check'}
        />
      </View>
      <View style={styles.row}>
        <HomeButton
          title={t('item.items')}
          description={t('item.items_description')}
          onPress={() => navigation.navigate('Items List')}
          icon={'format-list-checkbox'}
        />
        <HomeButton
          title={t('report.reports')}
          description={t('report.reports_description')}
          onPress={() => navigation.navigate('Insights')}
          icon={'chart-bar-stacked'}
        />
      </View>
      <View style={styles.row}></View>
    </View>
  );
}

const styles = {
  row: {
    flexDirection: "row",
  },
};
