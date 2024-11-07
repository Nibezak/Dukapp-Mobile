import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QrCodeSvg, circleRenderer } from 'react-native-qr-svg';

const SIZE = 300;

// Function to convert numbers to letters based on the phone keypad mapping
const convertNumbersToLetters = (input) => {
    const numberToLetterMap = {
        '0': ['0'],             // No mapping for '0'
        '1': ['1'],             // No mapping for '1'
        '2': ['A', 'B', 'C'],   // Maps '2' to 'A', 'B', 'C'
        '3': ['D', 'E', 'F'],   // Maps '3' to 'D', 'E', 'F'
        '4': ['G', 'H', 'I'],   // Maps '4' to 'G', 'H', 'I'
        '5': ['J', 'K', 'L'],   // Maps '5' to 'J', 'K', 'L'
        '6': ['M', 'N', 'O'],   // Maps '6' to 'M', 'N', 'O'
        '7': ['P', 'Q', 'R', 'S'], // Maps '7' to 'P', 'Q', 'R', 'S'
        '8': ['T', 'U', 'V'],   // Maps '8' to 'T', 'U', 'V'
        '9': ['W', 'X', 'Y', 'Z']  // Maps '9' to 'W', 'X', 'Y', 'Z'
    };

    return input.split('').map(char => {
        const letters = numberToLetterMap[char] || [char]; // Default to the character if no mapping
        return letters[Math.floor(Math.random() * letters.length)]; // Randomly select a letter
    }).join('');
};

export default function QrCode({ phoneNumber, orderTotal }) {
    const ios = `tel://${encodeURIComponent(`*182*1*1*${phoneNumber}*${orderTotal}#`)}`;

    // Convert phoneNumber and orderTotal to strings and then replace numbers with letters
    const androidPhoneNumber = convertNumbersToLetters(phoneNumber.toString());
    const androidOrderTotal = convertNumbersToLetters(orderTotal.toString());

    const CONTENT = `tel://${encodeURIComponent(`*1TB*1*1*${androidPhoneNumber}*${androidOrderTotal}#`)}`;

    return (
        <View style={styles.root}>
            <View style={styles.content}>
                <QrCodeSvg
                    style={styles.qr}
                    renderer={circleRenderer}
                    value={CONTENT}
                    frameSize={SIZE}
                    dotColor="#059669"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
    },
    payText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#059669',
    },
});
