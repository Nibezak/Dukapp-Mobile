import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ThemeContext } from '../../App';

/**
 * Suggestion button
 */
export default function SuggestionButton(props) {
  const { theme } = useContext(ThemeContext);
  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: theme.background }]}>
      <View style={[styles.view]}>
        <TouchableOpacity
          style={[
            styles.suggestionButton,
            { backgroundColor: theme.accent, borderBottomWidth: 0.3, borderColor: theme.text },
          ]}
          onPress={props.onPress}
        >
          <Text style={[styles.suggestionText, { color: theme.text }]}>{props.title}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  suggestionButton: {
    flexDirection: 'row',
    borderRadius: 10,
    border: 0.5,
    borderColor: '#f9fafb',
    marginHorizontal: 2,
    marginVertical: 1,
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
  },
  suggestionText: {
    fontWeight: '600',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  view: {
    padding: 3,
    // backgroundColor: '#f4f4f4',
  },
};
