import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  InteractionManager,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { t } from "i18n-js";
import Metric from "../../components/Metric";
import HomeMetricService from "../../services/HomeMetricService";
import { money } from "../../helpers/Numbers";
import { getSetting } from "../../models/AsyncStorage";

export default function HomeSummary() {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [inStockItems, setInStockItems] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [currency, setCurrency] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshMetrics();
        retrieveSetting();
      });
    }, [])
  );

  useEffect(() => {
    refreshMetrics();
    retrieveSetting();
    getSetting("app_default_currency").then(setCurrency);
  }, []);

  /**
   * Fetch metrics from the DB
   */
  async function refreshMetrics() {
    HomeMetricService.todayRevenue(setTodayRevenue);
    HomeMetricService.todayProfit(setTodayProfit);
    HomeMetricService.inStockItems(setInStockItems);
    HomeMetricService.lowStockItems(setLowStockItems);
  }
  // retrieve the currency that was set by the user 
  function retrieveSetting() {
    getSetting("app_default_currency").then(setCurrency);
  }
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Metric
          number={money(todayRevenue, currency)}
          description={t("report.today_sales")}
          descriptionStyle={{ color: "#14b8a6" }}
          activeOpacity={0.9}
        />
        <Metric
          number={money(todayProfit, currency)}
          description={t("report.today_profit")}
          activeOpacity={0.9}
          descriptionStyle={{ color: "#10b981" }}
        />
        <Metric
          number={lowStockItems}
          description={t("report.low_stock_items")}
          descriptionStyle={{ color: "#d94818" }}
          activeOpacity={0.9}
        />
      </View>
    </>
  );
}
