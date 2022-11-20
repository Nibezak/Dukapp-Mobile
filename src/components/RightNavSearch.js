import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MoreVerticalButton from "./MoreVerticalButton";
import SearchButton from "./SearchButton";

const styles = {
  rightNav: { flexDirection: "row" },
  searchButton: {},
};

export default function RightNavSearch(props) {
  return (
    <View style={styles.rightNav}>
      <SearchButton onPress={props.onPressSearch} style={styles.searchButton} />
      <MoreVerticalButton onPress={props.onPressSettings} />
    </View>
  );
}
