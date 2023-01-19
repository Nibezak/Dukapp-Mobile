import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { getNotificationInbox } from 'native-notify';
export default function NotificationInbox() {
    const [data, setData] = useState([]);
    const [showIsLoading, setShowIsLoading] = useState(true);
    useEffect(() => {
        Announcements().then(() => {
            setShowIsLoading(false)
        })
    }, []);

    async function Announcements() {
        let notifications = await getNotificationInbox(5821, 'VZzLGzSIMPpBmmQN0CMG2I');
        console.log("notifications: ", notifications);
        setData(notifications);
    }
    if (showIsLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
            </View>
        )
    }

    return (
        <View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.notification_id}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.container}>
                            <TouchableOpacity onPress={() => Linking.openURL(item.message)}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.date}>
                                    {item.date}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 10,
        marginHorizontal: 5,
        marginBottom: 10,
        paddingTop: 4,
        borderRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 14,
        color: "#0066ff",
        fontWeight: "normal",
        paddingVertical: 5
    },
    message: {
        marginVertical: 5,
        padding: 5,

    },
    date: {
        color: "gray"
    }
});