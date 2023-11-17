import React, { useContext } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { ThemeContext } from '../../App';

export default function NextButton({ onPress, children, color }) {
  useTheme;
  const { floatingButton, floatingButtonIcon } = styles;
  const { theme } = useContext(ThemeContext);
  const buttonColor = color === undefined ? theme.accent : color;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[floatingButton, { borderColor: buttonColor, backgroundColor: buttonColor }]}
    >
      <Text style={[floatingButtonIcon]}>
        <AntDesign name="arrowright" size={24} color={theme.text} />
      </Text>
    </TouchableOpacity>
  );
}

const styles = {
  floatingButton: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#2d3748',
    borderRadius: 30,
    elevation: 4,
  },
  floatingButtonIcon: {
    alignSelf: 'center',
    fontSize: 40,
    color: '#bbf7d0',
  },
};
