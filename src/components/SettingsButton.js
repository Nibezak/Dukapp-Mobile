import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingsButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ marginRight: 10 }}>
      {/* <MaterialIcons name="settings" size={26} color="#4a5568" /> */}
      <MaterialIcons name="cast-connected" size={24} color="black" />
    </TouchableOpacity>
  );
}
