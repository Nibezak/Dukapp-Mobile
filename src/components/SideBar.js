import { AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getSetting } from "../models/AsyncStorage";



export default function SideBar() {
    useEffect(() => {
        retrieveSetting();
    })
    const SupplierIcon = (<MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#10b981" />)
    const ReportInsightsIcon = (<MaterialIcons name="insights" size={24} color="#10b981" />);
    const PurchasesIcon = (<AntDesign name="shoppingcart" size={24} color="#10b981" />);
    const ReceiptsIcon = (<FontAwesome5 name="receipt" size={24} color="#10b981" />);
    const ShareIcon = (<AntDesign name="sharealt" size={24} color="#10b981" />);
    const FeedBackIcon = (<MaterialIcons name="feedback" size={24} color="#10b981" />)
    const [selectedId, setSelectedId] = useState(null);
    const [businessName, setBusinessName] = useState(null);

    const listArrayItem = [
        { icon: SupplierIcon, title: 'Suppliers' },
        { icon: ReportInsightsIcon, title: 'Report Insights' },
        { icon: PurchasesIcon, title: 'Purchases' },
        { icon: ReceiptsIcon, title: 'Receipts' }
    ]

    const bottomListItems = [
        { icon: ShareIcon, title: 'Tell a Friend' },
        { icon: FeedBackIcon, title: 'Help and FeedBack' },
    ]
    const Item = ({ title, icon, handlePress, backgroundColor, color }) => (
        <TouchableOpacity onPress={handlePress} style={[styles.item, { backgroundColor: backgroundColor }]}>
            <View>
                <Text>{icon}</Text>
            </View>
            <Text style={[styles.title, { color: color }]}>{title}</Text>
        </TouchableOpacity>
    );
    const renderItem = ({ item }) => {
        const backgroundColor = item.title === selectedId ? "#6e3b6e" : "white";
        const color = item.title === selectedId ? 'white' : 'black';
        return (
            <Item
                onPress={() => setSelectedId(item.title)}
                title={item.title}
                backgroundColor={backgroundColor}
                textColor={color}
                icon={item.icon} />
        );
    }

    function retrieveSetting() {
        getSetting("business_name").then(setBusinessName);
    }
    return (

        <View style={{ flex: 1 }}>
            <View style={{ justifyContent: "center", flex: 0.3, paddingHorizontal: 20 }}>
                <Text style={{ fontWeight: "bold", fontSize: 20, marginLeft: 40, paddingBottom: 10 }}>{businessName}</Text>
                <Text style={{ fontSize: 18, marginTop: 5, color: "green" }}>{`6000 Products`}</Text>
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
        // padding: 20,
        backgroundColor: "",
        paddingVertical: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    title: {
        fontSize: 18,
        marginLeft: 20,
        paddingLeft: 20
    },
});