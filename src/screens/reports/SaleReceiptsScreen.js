import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    InteractionManager,
    KeyboardAvoidingView,
    FlatList,
    Keyboard,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { t } from "i18n-js";
import InputSend from "../../components/InputSend";
import SuggestionButton from "../../components/SuggestionButton";
import ItemService from "../../services/ItemService";
import OrderService from "../../services/OrderService";
import RenderOrder from "../orders/RenderOrder";
import { ReceiptAnimation } from "../../components/ReceiptAnimation";
import RenderReceipt from "../orders/RenderReceipt";

const windowHeight = Dimensions.get('window').height;

// Constants
export default function SaleReceiptsScreen({ navigation, route }) {
    const [typing, setTyping] = useState("");
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState(route.params.order);
    const [orderType, setOrderType] = useState(route.params.order_type);
    const [customer, setCustomer] = useState({ names: "Guest " });
    const [lastOrder, setLastOrder] = useState({});
    const [items, setItems] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                // Expensive task
                refreshOrders();
                getItems();
            });
        }, [])
    );

    useEffect(() => {
        getItems();
        refreshOrders();
    }, [orderType]);

    /**
     * Fetch Orders
     */
    function refreshOrders() {
        OrderService.ordersWithItems(setOrders, orderType).then((results) => {
            setLastOrder(results[results.length - 1]);
        });
    }

    /**
     * Get Orders from DB
     */
    async function getItems() {
        ItemService.getItems().then(setItems).then(() => setShowLoading(false));
    }


    const renderOrder = useCallback((item) => (
        <RenderReceipt
            item={item}
            index={item.id}
            key={item.id}
        />
    ));


    const keyExtractor = useCallback((item, index) => index.toString(), []);

    if (showLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
            </View>
        );
    }
    /**
     * Render to the screen
     */
    return (
        <View style={[styles.container]} >
            {orders.length > 0 ? (
                <FlatList
                    inverted
                    style={{ bottom: 1 }}
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={keyExtractor}
                />
            ) : (
                <ReceiptAnimation />
            )}
            {/* Display order summary */}



        </View>
    );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    suggestions: {
        width: "95%",
        borderRadius: 3,
        alignSelf: "center",
        height: windowHeight / 2.5,
        position: 'absolute',
        bottom: 60,
        backgroundColor: "#fff",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f7fafc",
    },
    amount: {
        fontSize: 40,
        fontWeight: "800",
        paddingRight: 5,
    },
    itemName: {
        paddingRight: 5,
        flexGrow: 1,
        width: 30,
        fontWeight: "700",
    },
    itemDescription: {
        paddingRight: 10,
    },
    bottom: {
        backgroundColor: "#fff",
    },
});
