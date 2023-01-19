import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";

/**
 * Suggestion button
 */
export default function SuggestionButton(props) {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.view}>
        <TouchableOpacity style={styles.suggestionButton} onPress={props.onPress}>
          <Text style={styles.suggestionText}>{props.title}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  suggestionButton: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#f9fafb",
    marginHorizontal: 1.5,
    marginVertical: 1,
    paddingVertical: 10,
    backgroundColor: "#f1f1f1"
  },
  suggestionText: {
    color: "#2d3748",
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 2,
  },
  scrollView: {
    padding: 3,
    backgroundColor: "#f4f4f4"
  },
};
