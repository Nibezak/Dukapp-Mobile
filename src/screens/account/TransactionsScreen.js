
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
export function TransactionsScreen() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    useEffect(() => {
        setHeader();
    }, [])

    function setHeader() {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 10, marginHorizontal: 10, }}>
                    <AntDesign name="minuscircleo" size={24} color="#718096" style={{ fontWeight: "semibold" }} />
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <AntDesign
                    name="menuunfold"
                    size={24}
                    color="#47a67f"
                    onPress={() => navigation.openDrawer()}
                    style={{ paddingLeft: 10 }}
                />
            ),
        });

    }
    return (
        <View style={[styles.container, { width }]}>

            <View style={[styles.card]}>
                <Text style={{ color: '#64748B', fontSize: 16, }}>
                    Your Balance
                </Text>

                <Text style={{ color: '#10b981', fontSize: 26, marginVertical: 10 }}>
                    RWF: 625,000
                </Text>
                <View style={{ marginVertical: 5, paddingVertical: 1 }}>
                    <Text style={{ color: '#64748B', fontSize: 16, marginBottom: 10 }}>
                        Nibeza N. Kevin
                    </Text>
                    <Text style={{ color: '#64748B', fontSize: 14, backgroundColor: "#47a67f", width: "50%", color: "white", fontWeight: "bold", paddingVertical: 2, paddingHorizontal: 10, borderRadius: 20 }}>
                        +250791903386
                    </Text>
                </View>
            </View>

            <View style={[styles.activities]}>
                <Text style={{ color: '#64748B', fontSize: 16, marginHorizontal: 10 }}>
                    Transaction Activities
                </Text>
                <View style={[styles.activitesCard]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#64748B" }}>29 July 2022</Text>
                        <Text style={{ color: "#64748B", fontSize: 12 }}>09:05 PM</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5, paddingVertical: 5 }}>
                        <Text style={{ fontSize: 14, color: "#64748B" }}>MIcheal Gray </Text>
                        <View style={{ marginTop: 5, flexDirection: "row" }}>
                            <AntDesign name="caretup" size={12} color="#11E05B" style={{ marginTop: 5 }} />
                            <Text style={{ fontSize: 14, marginHorizontal: 10, color: "#64748B" }}>RWF: 20,000</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.activitesCard]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#64748B" }}>28 July 2022</Text>
                        <Text style={{ color: "#64748B", fontSize: 12 }}>00:25 PM</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5, paddingVertical: 5 }}>
                        <Text style={{ fontSize: 14, color: "#64748B" }}> Lambert Paul</Text>
                        <View style={{ marginTop: 5, flexDirection: "row" }}>
                            <AntDesign name="caretdown" size={12} color="#F43F5E" style={{ marginTop: 5 }} />
                            <Text style={{ fontSize: 14, marginHorizontal: 10, color: "#64748B" }}>RWF: 10,000</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.activitesCard]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#64748B" }}>28 July 2022</Text>
                        <Text style={{ color: "#64748B", fontSize: 12 }}>11:00 PM</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5, paddingVertical: 5 }}>
                        <Text style={{ fontSize: 16, color: "#64748B" }}>Nicky Larson </Text>
                        <View style={{ marginTop: 5, flexDirection: "row" }}>
                            <AntDesign name="caretup" size={12} color="#11E05B" style={{ marginTop: 5 }} />
                            <Text style={{ fontSize: 14, marginHorizontal: 10, color: "#64748B" }}>RWF: 155,000</Text>
                        </View>
                    </View>
                </View>


                <View style={[styles.activitesCard]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#64748B" }}>28 July 2022</Text>
                        <Text style={{ color: "#64748B", fontSize: 12 }}>08:32 PM</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5, paddingVertical: 5 }}>
                        <Text style={{ fontSize: 16, color: "#64748B" }}>Bill Cosby </Text>
                        <View style={{ marginTop: 5, flexDirection: "row" }}>
                            <AntDesign name="caretup" size={12} color="#11E05B" style={{ marginTop: 5 }} />
                            <Text style={{ fontSize: 14, marginHorizontal: 10, color: "#64748B" }}>RWF: 77,000</Text>
                        </View>
                    </View>
                </View>


                <View style={[styles.activitesCard]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#64748B" }}>29 July 2022</Text>
                        <Text style={{ color: "#64748B", fontSize: 12 }}>09:05 PM</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5, paddingVertical: 5 }}>
                        <Text style={{ fontSize: 16, color: "#64748B" }}>Kayitesi Adeline </Text>
                        <View style={{ marginTop: 5, flexDirection: "row" }}>
                            <AntDesign name="caretup" size={12} color="#11E05B" style={{ marginTop: 5 }} />
                            <Text style={{ fontSize: 14, marginHorizontal: 10, color: "#64748B" }}>RWF: 400,000</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{
                flexDirection: "row", justifyContent: "center", bottom: 5, position: "absolute", right: 50
            }}>
                <Text style={{ color: '#64748B', fontSize: 10, fontWeight: "bold" }}>
                    In this section we only read your SMS to determine the balance.
                </Text>
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
        // backgroundColor: 'white',
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
    },
    card: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        height: "25%",
        backgroundColor: "white",

    },
    activities: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 15,
        height: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 5
    },
    activitesCard: {
        marginVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 0.4,
        borderBottomColor: "#94A3B8",
        paddingBottom: 5

    }
});