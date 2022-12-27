import React from "react";
import { View, Text, StatusBar } from "react-native";

export default function Header(props) {
  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerChildren}>{props.children}</View>
    </View>
  );
}

const styles = {
  header: {
    height: 50,
    backgroundColor: "#f1f1f1",
    padding: 1,
    marginBottom: 10
  },
  headerChildren: {
    flex: 1,
    flexDirection: "row",
  },
};
