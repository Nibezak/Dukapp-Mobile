import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import { Canvas, Group } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BarPath from '../../components/BarPath';
import XAxisText from '../../components/XAxisText';
import AnimatedText from '../../components/AnimatedText';
import { data } from '../../database/Data';

import * as d3 from 'd3';
import { Theme } from '../../helpers/theme';
import { AntDesign, Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../../App';

const RevenueBarChart = ({ orders, renderOrder, keyExtractor }) => {
  const { width } = useWindowDimensions();
  const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

  const barWidth = 28;
  const graphMargin = 20;

  const canvasHeight = 250;
  const canvasWidth = width;
  const graphHeight = canvasHeight - graphMargin;
  const graphWidth = width;
  const [selectedDay, setSelectedDay] = useState('Total');
  const selectedBar = useSharedValue(null);
  const selectedValue = useSharedValue(0);
  const progress = useSharedValue(0);
  const { theme } = useContext(ThemeContext);

  // x domain
  const xDomain = data.map(dataPoint => dataPoint.label);

  // range of the x scale
  const xRange = [0, graphWidth];

  // Create the x scale
  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  // y domain
  const yDomain = [0, d3.max(data, (yDataPoint) => yDataPoint.value)];

  // range of the y scale
  const yRange = [0, graphHeight];

  // Create the y scale
  const y = d3.scaleLinear().domain(yDomain).range(yRange);

  // Animate the bar heights by updating the progress value
  useEffect(() => {
    progress.value = withTiming(1, { duration: 1000 });
    selectedValue.value = withTiming(totalValue, { duration: 1000 });
  }, [progress, selectedValue, totalValue]);

  const touchHandler = (e) => {
    // Get the x and y coordinates of the touch
    const touchX = e.nativeEvent.locationX;
    const touchY = e.nativeEvent.locationY;

    // Calculate the index of the touched bar based on touchX and x axis step
    const index = Math.floor((touchX - barWidth / 2) / x.step());

    // if the index is within the bounds of the data array
    if (index >= 0 && index < data.length) {
      const { label, value, day } = data[index];

      // Check if the touch is within the bounds of the touched bar
      if (
        touchX > x(label) - barWidth / 2 &&
        touchX < x(label) + barWidth / 2 &&
        touchY > graphHeight - y(value) &&
        touchY < graphHeight
      ) {
        selectedBar.value = label;
        setSelectedDay(day);
        selectedValue.value = withTiming(value);
      } else {
        selectedBar.value = null;
        setSelectedDay('Total');
        selectedValue.value = withTiming(totalValue);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <AnimatedText selectedValue={selectedValue} theme={theme.text} />
        <View style={styles.revenueView}>
          <Text style={[styles.textSteps, { color: "#718096" }]}>{selectedDay} Revenue</Text>
          <Feather name="more-horizontal" size={24} color={theme.primary} />
        </View>
      </View>
      <Canvas
        onTouchStart={touchHandler}
        style={{ width: canvasWidth, height: canvasHeight, marginTop: 20 }}>
        {data.map((dataPoint, index) => (
          <Group key={index}>
            <BarPath
              progress={progress}
              x={x(dataPoint.label)}
              y={y(dataPoint.value)}
              barWidth={barWidth}
              graphHeight={graphHeight}
              label={dataPoint.label}
              selectedBar={selectedBar}
            />
            <XAxisText
              x={x(dataPoint.label)}
              y={canvasHeight}
              text={dataPoint.label}
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
    backgroundColor: Theme.background,
  },
  recentItems: {
    flex: 1, // Fill available space
    marginTop: 10, // Margin on top
    marginBottom: 40, // Margin at the bottom
    borderRadius: 8, // Optional rounded corners
  },
  textContainer: {

    justifyContent: 'center',
    marginHorizontal: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  textTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 28,
    color: '#111111',
  },
  textSteps: {
    fontFamily: 'Roboto-Regular',
    fontSize: 19,
    marginTop: 1,
  },
  revenueView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5, // Increase padding to add more space
  },
  playButton: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 10, // Additional spacing on the left of the second text
  },
});
