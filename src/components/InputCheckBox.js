import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";

export default function InputCheckBox(props) {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={props.onValueChange}
    >
      <Checkbox
        value={props.value}
        onValueChange={props.onValueChange}
        style={styles.checkbox}
      />
      <Text style={styles.label}>{props.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
