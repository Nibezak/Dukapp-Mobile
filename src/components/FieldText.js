import React, { useContext } from 'react';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ThemeContext } from '../../App';

/**
 * Styles for the Components
 */

export default function FieldText(props) {
  const { colors } = useTheme();
  const { theme } = useContext(ThemeContext);
  return (
    <TextInput
      theme={{
        colors: {
          text: theme.text,
          // primary: theme.colorIcon,
          placeholder: theme.text,
          // background: theme.accent,
        },
      }}
      label={props.title}
      value={props.value}
      onChangeText={props.onChangeText}
      style={{
        flex: 1,
        width: '100%',
        marginHorizontal: 5,
        marginVertical: 10,
        paddingVertical: 1,
        color: theme.text,
        backgroundColor: theme.accent,
      }}
      textColor={theme.text}
      onBlur={props.onBlur}
      onEndEditing={props.onEndEditing}
      ref={props.ref}
      placeholderTextColor={theme.text}
      autoFocus={props.autoFocus}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      underlineColorAndroid={props.underlineColorAndroid}
      activeUnderlineColor={theme.colorIcon}
      keyboardType={props.keyboardType}
      editable={props.editable}
      selectTextOnFocus={props.selectTextOnFocus}
      selectionColor={theme.colorIcon}
    />
  );
}
