import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
    backgroundColor: "#fff",
  },
  styleItem: {},
  label: {
    flex: 1,
    alignSelf: "center",
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#2d3748",
  },
};

export default function InputSelect(props) {
  const { options } = props;
  /**
   * Condistionally Display the label
   * based on the title availability
   */
  function DisplayLabel() {
    if (props.title) {
      return <Text style={styles.label}>{props.title}</Text>;
    }

    return <></>;
  }

  return (
    <View
      style={{
        marginHorizontal: 15,
        flex: 1,
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
      }}
    >
      <DisplayLabel />
      <Picker {...props} style={styles.input} itemStyle={styles.input}>
        {options.map((option, index) => (
          <Picker.Item label={option.label} value={option.value} key={index} />
        ))}
      </Picker>
    </View>
  );
}
