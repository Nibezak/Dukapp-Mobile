import { t } from "i18n-js";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import ButtonFilled from "../../components/ButtonFilled";
import { useNavigation } from "@react-navigation/native";
export function FastGoingScreen() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { width }]}>
            <Text>Hello Mobile</Text>
        </View>
    )



}

const styles = StyleSheet.create({

    title: {
        fontSize: 28,
        fontWeight: '800',
        alignSelf: "center",
        marginBottom: 10,
        color: "#47a67f",
        textAlign: 'center'

    },
    container: {
        flex: 1,
        paddingHorizontal: 5,
    },
    image: {
        flex: 0.7,
        justifyContent: "center"

    },
    description: {
        fontSize: 16,
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64
    }
});