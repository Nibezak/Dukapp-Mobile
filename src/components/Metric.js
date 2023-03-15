import React from 'react';
import { useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../App';

export default function Metric({
  number,
  description,
  activeOpacity,
  onPress,
  titleStyle,
  descriptionStyle,
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.buttonStyle, { backgroundColor: theme.accent }]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={[styles.title, { color: theme.text }]}>{number}</Text>
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  row: {
    alignContent: 'center',
    flexDirection: 'row',
    padding: 2,
  },
  rowText: {
    flex: 1,
  },
  description: {
    justifyContent: 'center',
    fontSize: 14,
    color: '#4a5568',
    alignSelf: 'center',
  },
  title: {
    color: '#4a5568',
    fontSize: 15,
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonStyle: {
    flex: 1,
    borderRadius: 13,
    // borderColor: "gray",
    marginHorizontal: 3,
    marginVertical: 3,
    padding: 5,
    margin: 1,
    // backgroundColor: '#fff',
  },
});
