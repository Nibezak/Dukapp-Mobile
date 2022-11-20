import React from 'react';
import { StyleSheet, Switch, Text, TextInput } from 'react-native';

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
  /**
   * Condistionally Display the label
   * based on the title availability
   */
  function DisplayLabel() {
    if (props.title) {
      return (
        <Text style={styles.label}>
          {props.title}
        </Text>
      );
    }

    return <></>;
  }

  return (
    <>
      <DisplayLabel />
      <Switch
        style={styles.switch}
        trackColor={{ false: '#767577', true: '#cbd5e0' }}
        thumbColor={props.value ? '#16a34a' : '#f4f3f4'}
        ios_backgroundColor="#cbd5e0"
        onValueChange={props.onValueChange}
        value={props.value}
      />
    </>
  );
}
