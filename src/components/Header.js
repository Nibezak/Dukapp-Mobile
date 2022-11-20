import React from "react";
import { View, Text, StatusBar } from "react-native";

export default function Header(props) {
  return (
    <View style={styles.header}>
      <StatusBar backgroundColor="#4a5568" barStyle="light-content" />
      <View style={styles.headerChildren}>{props.children}</View>
    </View>
  );
}

const styles = {
  header: {
    height: 80,
    backgroundColor: "#4a5568",
    padding: 1,
  },
  headerChildren: {
    flex: 1,
    flexDirection: "row",
  },
};
