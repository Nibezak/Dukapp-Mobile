import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { QrCodeSvg, circleRenderer } from 'react-native-qr-svg';

const SIZE = 300;

export default function QrCode({ phoneNumber, orderTotal }) {
    const CONTENT = `tel://${encodeURIComponent(`*182*1*1*${phoneNumber}*${orderTotal}#`)}`;

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
