import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getSetting } from "../models/AsyncStorage";
import { useNavigate } from "@reach/router";
import { useNavigation } from "@react-navigation/native";

export default function SideBar() {
    useEffect(() => {
        retrieveSetting();
    })
    const SupplierIcon = (<MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#10b981" />)
    const ReportInsightsIcon = (<MaterialIcons name="insights" size={24} color="#10b981" />);
    const PurchasesIcon = (<AntDesign name="shoppingcart" size={24} color="#10b981" />);
    const ReceiptsIcon = (<FontAwesome5 name="receipt" size={24} color="#10b981" />);
    const ShareIcon = (<AntDesign name="sharealt" size={24} color="#10b981" />);
    const FeedBackIcon = (<MaterialIcons name="feedback" size={24} color="#10b981" />);

    const [selectedId, setSelectedId] = useState(null);
    const [businessName, setBusinessName] = useState(null);
    const [currency, setCurrency] = useState(null);

    const listArrayItem = [
        { icon: SupplierIcon, title: 'Suppliers', route: 'Supplier List' },
        { icon: ReportInsightsIcon, title: 'Report Insights', route: 'Insights' },
        { icon: PurchasesIcon, title: 'Purchases', route: '' },
        { icon: ReceiptsIcon, title: 'Receipts', route: 'Order Receipt' }
    ]

    const bottomListItems = [
        { icon: ShareIcon, title: 'Tell a Friend' },
        { icon: FeedBackIcon, title: 'Help and FeedBack' },
    ]

    const navigation = useNavigation();

    const Item = ({ title, icon, onPress, backgroundColor, color }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor: backgroundColor }]}>
            <View>
                <Text style={{ color: color }}>{icon}</Text>
            </View>
            <Text style={[styles.title, { color: color }]}>{title}</Text>
        </TouchableOpacity>
    );
    function navigate(item) {
        setSelectedId(item.title)
        navigation.navigate(item.route)
    }
    const renderItem = ({ item }) => {
        const backgroundColor = item.title === selectedId ? "#47a67f" : "white";
        const color = item.title === selectedId ? 'white' : 'black';
        return (
            <Item
                onPress={() => navigate(item)}
                title={item.title}
                backgroundColor={backgroundColor}
                color={color}
                icon={item.icon} />
        );
    }

    function retrieveSetting() {
        getSetting("business_name").then(setBusinessName);
        getSetting("app_default_currency").then(setCurrency);
    }
    return (

        <View style={{ flex: 1 }}>
            <View style={{ justifyContent: "center", flex: 0.25, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                    <Image source={require('./../../assets/snack-icon.png')} style={{ width: 120, height: 70 }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                    <Text style={{ color: "#62656b", fontWeight: "bold", fontSize: 15 }}>Shop name:</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, color: "#47a67f" }}>{businessName}</Text>
                </View>
            </View>
            <View style={{ flex: 0.55 }}>
                <FlatList
                    data={listArrayItem}
                    renderItem={renderItem}
                />
            </View>
            <View style={{ flex: 0.35 }}>
                <FlatList
                    data={bottomListItems}
                    renderItem={renderItem}
                />
            </View>
        </View >

    )

}
const styles = StyleSheet.create({
    item: {
        padding: 20,
        backgroundColor: "",
        paddingVertical: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: "row",
        justifyContent: "flex-start",
        borderRadius: 30

    },
    title: {
        fontSize: 18,
        marginLeft: 20,
        paddingLeft: 20
    },
});