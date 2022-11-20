import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

export default function ButikeButton({ onPress, children, color }) {
  const { buttonStyle, textStyle } = styles;
  const buttonColor = color == undefined ? "#2d3748" : color;

  return (
    <Button
      icon=""
      mode="outlined"
      style={[styles.buttonStyle, { borderColor: buttonColor }]}
      onPress={onPress}
    >
      <Text style={[textStyle, { color: buttonColor }]}>{children}</Text>
    </Button>
  );
}

const styles = {
  buttonStyle: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderRadius: 2,
    marginHorizontal: 1,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
};
