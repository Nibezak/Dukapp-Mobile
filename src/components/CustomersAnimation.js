import { t } from "i18n-js";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import ButtonFilled from "./ButtonFilled";
import { useNavigation } from "@react-navigation/native";
export function CustomersAnimation() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { width }]}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Image source={require('../../assets/WelcomeAnimation/WelcomeCustomers.png')} style={[styles.image, { width, resizeMode: 'contain' }]} />
                <Text style={styles.title}>
                    Keep your Customers
                </Text>
                <Text style={styles.description}>
                    Stay in Touch with your customers by keeping them in your notebook
                </Text>
                <View>
                    <ButtonFilled
                        onPress={() => navigation.navigate("New Customer")}
                        color={"#47a67f"}
                    >
                        Create a Customer
                    </ButtonFilled>
                </View>
            </View>

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
        justifyContent: "center",

    },
    description: {
        fontSize: 16,
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64
    }
});