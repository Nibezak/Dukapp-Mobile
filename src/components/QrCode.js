import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { QrCodeSvg, circleRenderer } from 'react-native-qr-svg';

const SIZE = 300;

export default function QrCode({ phoneNumber, orderTotal }) {
    const CONTENT = `tel:*182*1*1*${phoneNumber}*${orderTotal}#`; // Use both phone number and order total

    return (
        <View style={styles.root}>
            <View style={styles.content}>
                {/* <QrCodeSvg
                    style={styles.qr}
                    value={CONTENT}
                    frameSize={SIZE}
                    contentCells={5}
                    content={<Image
                        source={require('../../assets/dukapp-color.png')}
                        style={{ width: 45, height: 45, paddingVertical: 10 }}
                    />}
                    contentStyle={styles.box}
                /> */}
                <QrCodeSvg
                    style={styles.qr}
                    renderer={circleRenderer}
                    value={CONTENT}
                    frameSize={SIZE}
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
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 20,
    },
    qr: {
        padding: 15,
    },
});
