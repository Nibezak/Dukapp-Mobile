import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

export default function ButikeButton({ onPress, children, color, backgroundColor }) {
  const { buttonStyle, textStyle } = styles;
  const buttonColor = color == undefined ? '#2d3748' : color;
  const buttonBackgroundColor = color == undefined ? '#fff' : backgroundColor;


  return (
    <Button
      icon=""
      mode="outlined"
      style={[styles.buttonStyle, { borderColor: buttonColor, backgroundColor: buttonBackgroundColor }]}
      onPress={onPress}
    >
      <Text style={[textStyle, { color: buttonColor }]}>{children}</Text>
    </Button>
  );
}

const styles = {
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 50,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    maxHeight: 48,
    width: '100%',
  },
};
