import React, { useContext } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../../App';
export default function InputSend(props) {
  const { bottom } = props;
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.accent, marginBottom: bottom ? bottom : 55 },
      ]}
    >
      <TextInput
        value={props.value}
        style={[styles.input, { color: theme.text }]}
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        placeholderTextColor={theme.text}
        onChangeText={props.onChangeText}
      />

      <TouchableOpacity onPress={props.onPress} style={styles.saleButton}>
        <FontAwesome name="plus" size={24} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row',
    padding: 2,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  input: {
    height: 40,
    paddingHorizontal: 15,
    fontSize: 18,
    flex: 1,
  },
  saleButton: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    marginRight: 5,
  },
};
