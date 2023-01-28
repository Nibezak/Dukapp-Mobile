import React from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

/**
 * Styles for the Components
 */
const styles = {
    switch: {
        paddingTop: 4,
        paddingHorizontal: 2,
        flex: 1,
        marginBottom: 0,
    },
    label: {
        paddingTop: 8,
        marginTop: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'gray',
        fontWeight: '400',
    },
};

export default function ShowPassword(props) {
    /**
     * Condistionally Display the label
     * based on the title availability
     */
    function DisplayLabel() {
        if (props.title) {
            return (
                <Text style={styles.label}>
                    {props.title}
                </Text>
            );
        }

        return <></>;
    }

    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 30 }}>
                <DisplayLabel />
                <Switch
                    style={styles.switch}
                    trackColor={{ false: '#767577', true: '#cbd5e0' }}
                    thumbColor={props.value ? '#16a34a' : '#f4f3f4'}
                    ios_backgroundColor="#cbd5e0"
                    onValueChange={props.onValueChange}
                    value={props.value}
                />
            </View>
        </>
    );
}
