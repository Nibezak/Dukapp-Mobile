import React from "react";
import { TextInput } from "react-native-paper";
import { useTheme } from "react-native-paper";

/**
 * Styles for the Components
 */

export default function InputText(props) {
  const { colors } = useTheme();
  return (
    <TextInput
      label={props.title}
      value={props.value}
      onChangeText={props.onChangeText}
      style={{ flex: 1, borderRadius: 3, backgroundColor: colors.textInput }}
      mode="outlined"
      onEndEditing={props.onEndEditing}
      ref={props.ref}
      autoFocus={props.autoFocus}
      defaultValue={props.defaultValue}
      underlineColorAndroid={props.underlineColorAndroid}
      keyboardType={props.keyboardType}
    />
  );
}
