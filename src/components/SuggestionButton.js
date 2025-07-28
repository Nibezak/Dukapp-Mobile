import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemeContext } from '../../App';

/**
 * Suggestion button
 */
export default function SuggestionButton(props) {
  const { theme } = useContext(ThemeContext);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.view}>
        <TouchableOpacity
          style={[
            styles.suggestionButton,
            {
              borderColor: theme.text,
              backgroundColor: 'transparent'
            },
          ]}
          onPress={props.onPress}
        >
          <Text style={[styles.suggestionText, { color: theme.text }]}>{props.title}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  suggestionButton: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1, // Changed to 'borderWidth' for better visibility
    marginHorizontal: 2,
    marginVertical: 5, // Increased margin for better spacing
    paddingVertical: 12, // Adjusted padding for a better touch target
    alignItems: 'center', // Center items vertically
  },
  suggestionText: {
    fontWeight: '600',
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center', // Center text
  },
  view: {
    padding: 5, // Increased padding for better aesthetics
  },
});
