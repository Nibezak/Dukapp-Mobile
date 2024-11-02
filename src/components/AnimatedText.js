import { View } from 'react-native';
import React from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { Canvas, Text, useFont } from '@shopify/react-native-skia';

const AnimatedText = ({ selectedValue, theme }) => {
    const font = useFont(require('../../assets/fonts/Roboto-Bold.ttf'), 40);

    const animatedText = useDerivedValue(() => {
        return `${Math.round(selectedValue.value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`; // Format with commas and two decimal places
    });

    if (!font) {
        return <View />;
    }

    const fontSize = font.measureText('0');

    return (
        <Canvas style={{ height: fontSize.height + 40 }}>
            <Text
                text={animatedText.value} // Accessing formatted value
                font={font}
                color={theme}
                y={fontSize.height + 10}
            />
        </Canvas>
    );
};

export default AnimatedText;
