import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { AntDesign } from '@expo/vector-icons'; // Import Ant Design icons
import { Feather } from '@expo/vector-icons'; // Import Feather icons

export default function ButtonFilled(props) {
  const renderIcon = () => {
    switch (props.children) {
      case "Cancel":
        return <AntDesign name="closecircle" size={24} color="#57534E" />;
      case "Save":
        return <AntDesign name="checkcircle" size={24} color="#059669" />;
      case "Delete":
        return <Feather name="trash" size={24} color="#DC2626" />;
      default:
        return null; // Do not render text if an icon is present
    }
  };

  const isAddButton = typeof props.children === "string" && props.children.startsWith("Add");

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isAddButton && styles.addButton,
        { borderColor: props?.borderColor ? props.borderColor : "transparent" },
      ]}
      onPress={props.onPress}
    >
      <View style={styles.content}>
        {renderIcon()}
        {props.children && (
          <Text style={[styles.buttonText, { color: isAddButton ? "#FFFFFF" : (props.labelColor || "#000") }]}>
            {props.children}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  button: {
    width: "50%",
    paddingVertical: 15, // Adjust vertical padding
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2, // Define border width
    backgroundColor: "transparent", // Transparent background
    marginHorizontal: 2,
    alignItems: "center", // Center content horizontally
  },
  addButton: {
    backgroundColor: "#059669", // Green background for "Add" button
    width: "100%", // Full width
    alignSelf: "center", // Center the button
  },
  content: {
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 8, // Add space between icon and text
  },
};
