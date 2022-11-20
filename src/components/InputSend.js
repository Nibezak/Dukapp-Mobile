import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
        <MaterialIcons name="add" size={32} color="#16a34a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderColor: "#16a34a",
    borderTopWidth: 1,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 18,
    flex: 1,
  },
  saleButton: {
    alignSelf: "center",
    color: "#16a34a",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
  },
};
