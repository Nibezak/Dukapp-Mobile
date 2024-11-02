import colors from './colors';
import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
    block: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 14,
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.lightGray,
        marginLeft: 50,
    },
    pillButton: {
        padding: 6,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
});
