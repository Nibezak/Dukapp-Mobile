import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const styles = {
  search: {
    paddingRight: 10,
    paddingLeft: 10,
  },
};

export default function SearchButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.search, props.style]}
    >
      <MaterialIcons name="search" size={30} color="#1f2937" />
    </TouchableOpacity>
  );
}
