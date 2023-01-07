import { useEffect, useState } from 'react';
import { t } from 'i18n-js';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReportService from '../../services/ReportService';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { getSetting } from '../../models/AsyncStorage';

export function ByCashScreen() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [currency, setCurrency] = useState(null)
    /** Upon the screen load, fetch orders paid by cash */
    useEffect(() => {
        getOrderPaidByCash();
        retrieveSetting();
    }, []);

    /**
     * Fetch orders by payment method
     */
    async function getOrderPaidByCash() {
        ReportService.getSaleOrdersByPayment('cash')
            .then(setOrders)
            .then(() => setShowLoading(false));
    }

    async function retrieveSetting() {
        getSetting('app_default_currency').then(setCurrency);
    }
    /**
     * Show the activity indicator as long as the items are being fetched.
     * This improves user experience by showing a loader.
     */
    if (showLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
            </View>
        );
    }

    /** Display orders with cash payment */
    return (
        <ScrollView style={[styles.container, { width }]}>
            {orders.map((order, index) => {
                return (
                    <View style={styles.box}>
                        <Text>  S#{order.id} Coffe Late</Text>
                        <Feather name="check-circle" size={13} color="#47a67f" > Complete <Feather name="check-circle" size={13} color="#47a67f" /> </Feather>
                        <Text style={{ color: "#47a67f", fontFamily: "Roboto-Bold" }}>  {currency} {order.total}</Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    box: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingVertical: 20,
        marginVertical: 10,
        borderRadius: 5,
        elevation: 2,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        alignSelf: 'center',
        marginBottom: 10,
        color: '#47a67f',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: 5,
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',
    },
    description: {
        fontSize: 16,
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64,
    },
});