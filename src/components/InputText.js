import React from 'react';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

/**
 * Styles for the Components
 */

export default function InputText(props) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    div: {
      width: '100%',
      paddingTop: 20,
      paddingBottom: 10,
    },
    input: {
      width: '75%',
      height: 45,
      // flex: 1,
      // borderRadius: 3,
      // backgroundColor: colors.textInput
    },
  });
  return (
    <View style={styles.div}>
      <TextInput
        label={props.title}
        value={props.value}
        onChangeText={props.onChangeText}
        style={styles.input}
        onEndEditing={props.onEndEditing}
        ref={props.ref}
        autoFocus={props.autoFocus}
        defaultValue={props.defaultValue}
        activeUnderlineColor={props.activeUnderlineColor}
        underlineColorAndroid={props.underlineColorAndroid}
        keyboardType={props.keyboardType}
        // placeholder="Type something here"
      />
    </View>
    // <View style={styles.div}>
    //   <TextInput

    //             style={styles.input}
    //              placeholder="Type something here" />
    // </View>
  );
}
