import React, { useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../App';

export default function Metric({
  number,
  description,
  activeOpacity = 0.7,
  onPress,
  titleStyle,
  descriptionStyle,
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.buttonStyle, { borderColor: theme.borderColor }]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={[styles.title, titleStyle, { color: theme.text }]}>{number}</Text>
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Styles for the Metric component
 */
const styles = StyleSheet.create({
  row: {
    alignContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  rowText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#4a5568',
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 1,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',

  },

  buttonStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: 'transparent', // Remove shadow elevation
  },
});
