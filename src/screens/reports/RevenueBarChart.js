import { useFocusEffect } from "@react-navigation/native";
import { t } from "i18n-js";
import React, { useCallback, useEffect, useState } from "react";
import { View, Dimensions, Text, InteractionManager } from "react-native";
import { BarChart, LineChart, ProgressChart } from "react-native-chart-kit";
import { Title } from "react-native-paper";
import Metric from "../../components/Metric";
import ReportService from "../../services/ReportService";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#f7fafc",
  backgroundGradientFrom: "#f7fafc",
  backgroundGradientTo: "#f7fafc",
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(247, 250, 252, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
  style: {
    borderRadius: 1,
  },
  propsForDots: {
    r: "3",
    stroke: "#10b981",
  },
  useShadowColorFromDataset: true, // optional
};

const graphStyles = {
  padding: 2,
  paddingVertical: 1,
  margin: 8,
  borderRadius: 16,

};

export default function RevenueBarChart() {
  const [inStock, setInStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [reportDays, setReportDays] = useState(7);
  const [dataSets, setDataSets] = useState({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    profits: [0, 0, 0, 0, 0, 0, 0],
  });

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshChart();
      });
    }, [])
  );

  useEffect(() => {

    refreshChart();
  }, []);

  async function refreshChart() {
    ReportService.lastSevenDaysProfit(setDataSets, 7);
    ReportService.inStockItems(setInStock);
    ReportService.lowStockItems(setLowStock);
  }

  // Chart data
  const barData = {
    labels: dataSets.days,
    datasets: [
      {
        data: dataSets.profits,
        color: (opacity = 9) => `rgba(16, 185, 129, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <>
      <View>
        {/* <Title style={{ alignSelf: "center", color: "#718096" }}>
          {t("report.weekly_summary")}
        </Title> */}
        <LineChart
          style={{
            margin: 8,
            borderRadius: 10,
            elevation: 5
          }}
          data={barData}
          width={screenWidth}
          height={280}
          chartConfig={chartConfig}
          formatYLabel={(value) => formatNumber(value)}
          bezier
        />
        {/* 
        <ProgressChart
          data={[0.4, 0.6, 0.8]}
          width={Dimensions.get('window').width - 16}
          height={220}
          chartConfig={{
            backgroundColor: '#f7fafc',
            backgroundGradientFrom: '#f7fafc',
            backgroundGradientTo: '#f7fafc',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(226, 226, 226, 1)`,
            // color: (opacity = 1) => `rgba(247, 250, 252, ${opacity})`,

            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        /> */}
        {/* <BarChart
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                data: [20, 45, 28, 80, 99, 43],
              },
            ],
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          yAxisLabel={'Rs'}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        /> */}
      </View>
    </>
  );
}
