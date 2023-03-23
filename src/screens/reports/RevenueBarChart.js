import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Dimensions, InteractionManager } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { ThemeContext } from '../../../App';
import ReportService from '../../services/ReportService';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#f7fafc',
  backgroundGradientFrom: '#f7fafc',
  backgroundGradientTo: '#f7fafc',
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(247, 250, 252, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
  style: {
    borderRadius: 1,
  },
  propsForDots: {
    r: '4',
    stroke: '#10b981',
  },
  useShadowColorFromDataset: false, // optional
};

const graphStyles = {
  padding: 2,
  paddingVertical: 1,
  margin: 8,
  borderRadius: 16,
};

export default function RevenueBarChart({ startDate, endDate }) {
  const [inStock, setInStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [reportDays, setReportDays] = useState(7);
  const { theme } = useContext(ThemeContext);
  const [dataSets, setDataSets] = useState({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
    console.log(startDate, endDate);
    ReportService.lastSevenDaysProfit(setDataSets, 7);
  }

  // Chart data
  const barData = {
    labels: dataSets.days,
    datasets: [
      {
        data: dataSets.profits,
        color: (opacity = 9) => `rgba(16, 180, 128, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return (
    <>
      <View style={{ alignItems: 'center' }}>
        {/* <LineChart
          style={{
            margin: 8,
            borderRadius: 10,
            elevation: 5,
          }}
          data={barData}
          width={screenWidth}
          height={280}
          chartConfig={chartConfig}
          formatYLabel={(value) => formatNumber(value)}
          bezier
        /> */}
        <BarChart
          data={barData}
          width={Dimensions.get('window').width - 16}
          // hidePointsAtIndex={[0]}
          //   segments={10}
          height={300}
          fromZero={true}
          withInnerLines={false}
          showBarTops={false}
          flatColor={true}
          showValuesOnTopOfBars={false}
          withHorizontalLabels={false}
          chartConfig={{
            // sty
            formatTopBarValue: (value) => formatNumber(value),
            fillShadowGradientToOpacity: 0.1,
            fillShadowGradientFromOpacity: 0.9,
            backgroundGradientFrom: theme.accent,
            backgroundGradientTo: theme.accent,
            barRadius: 10,
            barPercentage: 0.5,
            decimalPlaces: 0,
            color: (opacity = 0) => `rgba(16, 180, 128, ${opacity})`,
            propsForBackgroundLines: {
              strokeDasharray: '10',
            },
            propsForLabels: {
              fontSize: 10,
              fill: theme.text,
            },
          }}
          style={{
            marginVertical: 2,
            borderRadius: 10,
            elevation: 5,

          }}
        />
      </View>
    </>
  );
}
