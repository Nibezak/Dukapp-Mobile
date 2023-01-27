import React, { useContext, useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { verifyOTP } from "../api/VerifyPhone";
import { AuthContext } from "../context/AuthProvider";

export default function OTPInputView({ phoneNumber }) {

    const { login, isLoading } = useContext(AuthContext);

    // Set state for the PINS
    const [pinOneValue, setPinOneValue] = useState(null);
    const [pinTwoValue, setPinTwoValue] = useState(null);
    const [pinThreeValue, setPinThreeValue] = useState(null);
    const [pinFourValue, setPinFourValue] = useState(null);
    const [pinFiveValue, setPinFiveValue] = useState(null);
    const [pinSixValue, setPinSixValue] = useState(null);


    // Define the number of pin count
    const pinOne = useRef();
    const pinTwo = useRef();
    const pinThree = useRef();
    const pinFour = useRef();
    const pinFive = useRef();
    const pinSix = useRef();

    /**
     * Next input reference
     * @param {*} nextInput 
     * @param {*} textValue 
     */
    function goToNextInput(nextInput, textValue) {
        if (textValue.length > 0) {
            nextInput.current.focus();
        }
    }

    /**
     * handle Verification
     *
     * @param {string} code
     * @returns
     */
    async function handleOtpVerification(sixthPin) {

        const OTPcode = pinOneValue.toString() +
            pinTwoValue.toString() +
            pinThreeValue.toString() +
            pinFourValue.toString() +
            pinFiveValue.toString() +
            sixthPin.toString();


        verifyOTP(phoneNumber, OTPcode);
    }


    return (<View style={{ flexDirection: "row" }}>

        <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType={"number-pad"}
            ref={pinOne}
            onChangeText={(text) => {
                setPinOneValue(text);
                goToNextInput(pinTwo, text);
            }}
        />

        <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType={"number-pad"}
            ref={pinTwo}
            value={pinTwoValue}
            onChangeText={(text) => {
                setPinTwoValue(text);

                // Go to previous input
                if (text.length <= 0) {
                    return pinOne.current.focus();
                }

                goToNextInput(pinThree, text);
            }}

        />

        <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType={"number-pad"}
            ref={pinThree}
            onChangeText={(text) => {
                setPinThreeValue(text);
                // Go to previous input
                if (text.length <= 0) {
                    return pinTwo.current.focus();
                }

                goToNextInput(pinFour, text);
            }}
        />

        <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType={"number-pad"}
            ref={pinFour}
            onChangeText={(text) => {
                setPinFourValue(text);

                // Go to previous input
                if (text.length <= 0) {
                    return pinThree.current.focus();
                }

                goToNextInput(pinFive, text);
            }}
        />
        <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType={"number-pad"}
            ref={pinFive}
            onChangeText={(text) => {
                setPinFiveValue(text);

                // Go to previous input
                if (text.length <= 0) {
                    return pinFour.current.focus();
                }

                goToNextInput(pinSix, text);
            }}
        />

        <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType={"number-pad"}
            ref={pinSix}
            onChangeText={(text) => {
                setPinSixValue(text);
                const sixthPin = text;
                // Go to previous input
                if (text.length <= 0) {
                    return pinFive.current.focus();
                }

                // Verify the phone number
                handleOtpVerification(sixthPin);
            }}
        />
    </View>);
}

// Style The input
const styles = StyleSheet.create({
    input: {
        fontSize: 24,
        alignContent: "center",
        alignSelf: "center",
        marginHorizontal: 5,
        borderBottomWidth: 1,
        width: 45,
        height: 45,
        borderColor: 'rgba(226, 226, 226, 1)',
        borderWidth: 1,
        borderRadius: 2,
        textAlign: 'center',
        color: 'rgba(226, 226, 226, 1)',
    }
});