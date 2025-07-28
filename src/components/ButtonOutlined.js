import React, { Component } from "react";
import { TouchableOpacity, Text } from "react-native";

export default function ButtonOutlined(props) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: props?.color ? props.color : "#2d3748" },
            ]}
            onPress={props.onPress}
        >
            <Text
                style={[
                    styles.buttonText,
                    { color: props?.labelColor ? props.labelColor : "#fff" },
                ]}
            >
                {props.children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = {
    button: {
        // width: "98%",
        paddingHorizontal: 40,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#2d3748",
        shadowColor: "rgba(0,0,0,0.4)",
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 3,
        flexShrink: 4,
        marginTop: 20
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        flexShrink: 3,
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
    },
};
