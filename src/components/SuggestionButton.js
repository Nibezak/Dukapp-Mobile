import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

/**
 * Suggestion button
 */
export default function SuggestionButton(props) {
  return (
    <TouchableOpacity style={styles.suggestionButton} onPress={props.onPress}>
      <Text style={styles.suggestionText}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  suggestionButton: {
    flexDirection: "row",
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "#f9fafb",
    marginHorizontal: 1.5,
    marginVertical: 1,
    paddingVertical: 10,
  },
  suggestionText: {
    color: "#2d3748",
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 2,
  },
};
