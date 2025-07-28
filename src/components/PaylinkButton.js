import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function PaylinkButton({ onPress, color }) {
    const { floatingButton, floatingButtonContent, buttonText } = styles;
    const buttonColor = color == undefined ? "#f7fafc" : color;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[floatingButton, { borderColor: buttonColor }]}
        >
            <View style={floatingButtonContent}>
                <AntDesign name="qrcode" size={24} color="#dcfce7" />
                <Text style={[buttonText, { color: buttonColor }]}>Open Paylink</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = {
    floatingButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2d3748",
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginVertical: 10,
        width: "50%",
    },
    floatingButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8, // Spacing between icon and text
    },
};
