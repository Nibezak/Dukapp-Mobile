import React, { useContext } from 'react';
import { StyleSheet, Switch, Text, TextInput } from 'react-native';
import { ThemeContext } from '../../App';

/**
 * Styles for the Components
 */
const styles = {
  switch: {
    paddingTop: 4,
    paddingHorizontal: 2,
    flex: 1,
    marginBottom: 0,
  },
  label: {
    paddingTop: 8,

    paddingHorizontal: 10,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '700',
  },
};

export default function InputSwitch(props) {
  const { theme } = useContext(ThemeContext);
  /**
   * Condistionally Display the label
   * based on the title availability
   */
  function DisplayLabel() {
    if (props.title) {
      return <Text style={[styles.label, { color: theme.text, opacity: 0.7 }]}>{props.title}</Text>;
    }

    return <></>;
  }

  return (
    <>
      <DisplayLabel />
      <Switch
        style={styles.switch}
        trackColor={{ false: theme.colorIcon, true: theme.colorIcon }}
        thumbColor={props.value ? theme.primary : '#f4f3f4'}
        ios_backgroundColor="#cbd5e0"
        onValueChange={props.onValueChange}
        value={props.value}
      />
    </>
  );
}
