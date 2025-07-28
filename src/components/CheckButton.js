import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function CheckButton({ onPress, children, color }) {
    useTheme;
    const { floatingButton, floatingButtonIcon } = styles;
    const buttonColor = color == undefined ? "#f7fafc" : color;

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
                onPress={onPress}
                style={[floatingButton, { borderColor: buttonColor }]}
            >
                <Text style={[floatingButtonIcon, { color: buttonColor }]}>
                    {/* <AntDesign name="check" size={24} color="#dcfce7" /> */}
                    <Feather name="check" size={24} color="#dcfce7" />
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    floatingButton: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        bottom: 10,
        backgroundColor: "#2d3748",
        borderRadius: 30,
        elevation: 4,
        marginTop: 15
    },
    floatingButtonIcon: {
        alignSelf: "center",
        fontSize: 40,
        color: "#bbf7d0",
    },
};
