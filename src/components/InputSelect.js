import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../App';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    width: '90%',
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 10,
    opacity: 0.9,
    width: '100%', // Make the label full width
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%', // Make the picker container full width
  },
  picker: {
    height: 44,
    fontSize: 16,
    width: '100%', // Make the picker full width
  },
});

export default function InputSelect(props) {
  const { options, title } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {title && (
        <Text style={[styles.label, { opacity: 0.8 }]}>
          {title}
        </Text>
      )}
      <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
        <Picker
          {...props}
          style={[styles.picker, { backgroundColor: theme.accent, color: theme.text }]}
          dropdownIconColor={theme.text}
        >
          {options.map((option, index) => (
            <Picker.Item
              label={option.label}
              value={option.value}
              key={index}
              style={{ color: theme.text }}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}
