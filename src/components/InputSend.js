import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
export default function InputSend(props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={props.value}
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
      />

      <TouchableOpacity onPress={props.onPress} style={styles.saleButton}>
        <FontAwesome name="send" size={24} color="#47a67f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderColor: "#cfd8dc",
    borderTopWidth: 1,
    padding: 2,
    margin: 10,
    borderRadius: 20,
  },
  input: {
    height: 40,
    paddingHorizontal: 15,
    fontSize: 18,
    flex: 1,
  },
  saleButton: {
    alignSelf: "center",
    color: "#16a34a",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    marginRight: 5
  },
};
