import React from 'react';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

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
      style={{
        flex: 1,
        maxHeight: "100%",
        borderRadius: 3,
        alignSelf: 'stretch',
        marginHorizontal: 5,
        marginVertical: 5,
        paddingVertical: 1,
        backgroundColor: colors.textInput,
      }}

      onEndEditing={props.onEndEditing}
      ref={props.ref}
      autoFocus={props.autoFocus}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      underlineColorAndroid={props.underlineColorAndroid}
      keyboardType={props.keyboardType}
    />
  );
}
