import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, FlatList, Dimensions, InteractionManager } from 'react-native';
import { Canvas, Group } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as d3 from 'd3';
import { ThemeContext } from '../../../App';
import ReportService from '../../services/ReportService'; // Assuming this now has lastSevenDaysSales

import BarPath from '../../components/BarPath';
import XAxisText from '../../components/XAxisText';
import AnimatedText from '../../components/AnimatedText';
import { getSetting } from '../../models/AsyncStorage';

const screenWidth = Dimensions.get('window').width;

const dayMapping = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const RevenueBarChart = ({ startDate, endDate, orders, renderOrder, keyExtractor }) => {
  const { width } = useWindowDimensions();


  // Initializing state for days and sales (replaces "profits")
  const [dataSets, setDataSets] = useState({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sales: [0, 0, 0, 0, 0, 0, 0],
  });

  // Calculate the total sales for the week (adjusting from profits)
  const totalSales = dataSets.sales.reduce((acc, cur) => acc + (cur === 0 ? 0 : cur), 0);
  const [selectedDay, setSelectedDay] = useState(`This week`);
  const selectedBar = useSharedValue(null);
  const selectedValue = useSharedValue(totalSales);
  const progress = useSharedValue(0);
  const { theme } = useContext(ThemeContext);
  const [currency, setCurrency] = useState(null);

  const barWidth = 25;
  const graphMargin = 20;
  const canvasHeight = 250;
  const graphHeight = canvasHeight - graphMargin;
  const graphWidth = width;

  // X and Y scales for d3 (uses dataSets.sales instead of profits)
  const xDomain = dataSets.days;
  const xRange = [0, graphWidth];
  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  const yDomain = [0, d3.max(dataSets.sales.map(value => (value === 0 ? 0 : value)))];
  const yRange = [0, graphHeight];
  const y = d3.scaleLinear().domain(yDomain).range(yRange);

  // Update chart when component is in focus or dates change
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        refreshChart();
      });
      return () => task.cancel();
    }, [startDate, endDate])
  );

  useEffect(() => {
    refreshChart();
    getSetting('app_default_currency').then(setCurrency);
  }, [startDate, endDate]);

  // Call lastSevenDaysSales to update sales data (replaces lastSevenDaysProfit)
  async function refreshChart() {
    ReportService.lastSevenDaysSales(setDataSets, 7); // Fetches sales data
    progress.value = withTiming(1, { duration: 1000 });
    selectedValue.value = withTiming(totalSales, { duration: 1000 });
  }

  // Adjusted helper function to get display sales instead of profits
  const getDisplaySales = () => {
    return dataSets.sales.map(value => (value === 0 ? 0 : value)); // Maps 0 to 5 as user prefers
  };

  // Touch event handler to update selected day and sales value
  const touchHandler = (e) => {
    const touchX = e.nativeEvent.locationX;
    const touchY = e.nativeEvent.locationY;
    const index = Math.floor((touchX - barWidth / 2) / x.step());

    if (index >= 0 && index < dataSets.days.length) {
      const label = dataSets.days[index];
      const value = getDisplaySales()[index]; // Uses sales instead of profits

      if (
        touchX > x(label) - barWidth / 2 &&
        touchX < x(label) + barWidth / 2 &&
        touchY > graphHeight - y(value) &&
        touchY < graphHeight
      ) {
        selectedBar.value = label;
        setSelectedDay(label);
        selectedValue.value = withTiming(totalSales); // Animates the selected sales value
      } else {
        selectedBar.value = null;
        setSelectedDay(`This Week's`);
        selectedValue.value = withTiming(value); // Animates the total sales
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.revenueView}>
          <Text style={[styles.textSteps, { color: '#718096' }]}>
            {dayMapping[selectedDay] || `This week`}'s sales {/* Updated label to show Sales */}
          </Text>
        </View>
        {/* Display selected sales value */}
        <View >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AnimatedText selectedValue={selectedValue} theme={theme.text} />
          </View>
        </View>

      </View>
      <Canvas
        onTouchStart={touchHandler}
        style={{ width: screenWidth, height: canvasHeight, marginTop: 20 }}>
        {dataSets.days.map((label, index) => (
          <Group key={index}>
            <BarPath
              progress={progress}
              x={x(label)}
              y={y(getDisplaySales()[index])} // Draws bars using sales data
              barWidth={barWidth}
              graphHeight={graphHeight}
              label={label}
              selectedBar={selectedBar}
            />
            <XAxisText
              x={x(label)}
              y={canvasHeight}
              text={label}
              selectedBar={selectedBar}
            />
          </Group>
        ))}
      </Canvas>
      <View style={styles.recentItems}>
        <FlatList
          data={orders.slice(0, 5)}
          renderItem={renderOrder}
          keyExtractor={keyExtractor}
          nestedScrollEnabled
          horizontal={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default RevenueBarChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },

  recentItems: {
    flex: 1,
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 8,
  },
  textContainer: {
    marginTop: -20,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  textTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 28,
    color: '#111111',
  },
  textSteps: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    textTransform: 'uppercase',
    marginTop: -10,
    fontWeight: 'semibold'
  },
  revenueView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

});
