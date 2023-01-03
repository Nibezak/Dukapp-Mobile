import { t } from "i18n-js";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import ButtonFilled from "./ButtonFilled";
import { useNavigation } from "@react-navigation/native";
export function ReceiptAnimation() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { width }]}>
            <Image source={require('../../assets/WelcomeAnimation/welcomeReceipt.png')} style={[styles.image, { width, resizeMode: 'contain' }]} />
            <View style={{ flex: 0.7, backgroundColor: "white" }}>
                <Text style={styles.title}>
                    Start by creating a Stock
                </Text>
                <Text style={styles.description}>
                    manage products in your stock, calculate income and revenue for you , and create receipts

                </Text>
                <View>
                    <ButtonFilled
                        onPress={() => navigation.navigate("New Item")}
                        color={"#47a67f"}
                    >
                        {t("welcome.create_item_in_stock")}
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
        flex: 1,
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