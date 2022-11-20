import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingsButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <MaterialIcons name="settings" size={26} color="#4a5568" />
    </TouchableOpacity>
  );
}
