import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../App';

/**
 * Styles for the Components
 */
const styles = {
  input: {
    flex: 1,
    margin: 2,
    fontSize: 16,
    borderBottomWidth: 1,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  styleItem: {},
  label: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#2d3748',
  },
};

export default function InputSelect(props) {
  const { options } = props;
  const { theme } = useContext(ThemeContext);
  /**
   * Condistionally Display the label
   * based on the title availability
   */
  function DisplayLabel() {
    if (props.title) {
      return <Text style={[styles.label, { color: theme.text, opacity: 0.8 }]}>{props.title}</Text>;
    }

    return <></>;
  }

  return (
    <View
      style={{
        marginHorizontal: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
      }}
    >
      <DisplayLabel />
      <Picker
        {...props}
        style={[styles.input, { backgroundColor: theme.accent, color: theme.text }]}
        itemStyle={[styles.input, { backgroundColor: theme.accent, color: theme.text }]}
        dropdownIconColor={theme.text}
      >
        {options.map((option, index) => (
          <Picker.Item
            label={option.label}
            value={option.value}
            key={index}
            style={{ backgroundColor: theme.accent, color: theme.text }}
          />
        ))}
      </Picker>
    </View>
  );
}
