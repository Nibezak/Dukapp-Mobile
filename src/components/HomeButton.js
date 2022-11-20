import React from "react";
import { Button, useTheme } from "react-native-paper";

export default function HomeButton({ color, icon, onPress, title }) {
  const { colors } = useTheme();

  return (
    <Button
      icon={icon}
      mode="outlined"
      onPress={onPress}
      style={{
        flex: 1,
        margin: 2,
        padding: 5,
        borderWidth: 1,
        borderColor:  colors.primary,
      }}
      color={color ? color : colors.primary}
    >
      {title}
    </Button>
  );
}
