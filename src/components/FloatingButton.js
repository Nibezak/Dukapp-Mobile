import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function FloatingButton({ onPress, children, color }) {
  useTheme;
  const { floatingButton, floatingButtonIcon } = styles;
  const buttonColor = color == undefined ? "#f7fafc" : color;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[floatingButton, { borderColor: buttonColor }]}
    >
      <Text style={[floatingButtonIcon, { color: buttonColor }]}>
        <MaterialIcons name="add" size={32} color="#dcfce7" />
      </Text>
    </TouchableOpacity>
  );
}

const styles = {
  floatingButton: {
    position: "absolute",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#2d3748",
    borderRadius: 30,
    elevation: 4,
  },
  floatingButtonIcon: {
    alignSelf: "center",
    fontSize: 40,
    color: "#bbf7d0",
  },
};
