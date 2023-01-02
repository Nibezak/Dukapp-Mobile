import React, { useEffect, useCallback, useState } from "react";
import { View, FlatList, StyleSheet, Image, InteractionManager, Text, TouchableWithoutFeedback } from "react-native";
import HomeSummary from "./HomeSummary";
import HomeMenus from "./HomeMenus";
import SettingsButton from "../../components/SettingsButton";
import { t } from "i18n-js";
import RenderOrder from "../orders/RenderOrder";
import OrderService from "../../services/OrderService";
import { useFocusEffect } from "@react-navigation/native";
import ButtonFilled from "../../components/ButtonFilled";
import { Title, Divider } from "react-native-paper";
import order from "../../translations/en/order";
import RevenueBarChart from "../reports/RevenueBarChart";
import { AntDesign } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { TouchableOpacity } from "react-native-gesture-handler";
import { WelcomeAnimation } from "../../components/WelcomeAnimation";
/**
 * Screen component
 */
export default function WelcomeScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState("sale");

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshOrders();
      });
    }, [])
  );

  useEffect(() => {
    setHeader();
    refreshOrders();
  }, []);

  function setHeader() {
    navigation.setOptions({
      headerTitle: () => (<Image source={require('./../../../assets/snack-icon.png')} style={{ width: 120, height: 100 }} />),
      headerTitleAlign: "center",
      headerLeft: () => (
        <AntDesign name="menuunfold" size={24} color="green" onPress={() => navigation.openDrawer()} style={{ paddingLeft: 10 }} />
      ),
    });
  }

  // Fetch Orders
  async function refreshOrders() {
    return OrderService.ordersWithItems(setOrders, orderType, null, 8);
  }



  const renderOrder = useCallback((item) => (
    <RenderOrder
      item={item}
      index={item.id}
      key={item.id}
      onPress={() =>
        navigation.navigate("Edit Item", {
          item: item,
        })
      }
    />
  ));

  const keyExtractor = useCallback((item, index) => index.toString(), []);


  return (
    <View style={styles.container}>
      {/** Welcome Section of the screen */}
      {orders.length > 0 ? (
        <>
          <Title style={styles.title}>
            {t("welcome.today_insights")}
          </Title>
          <HomeSummary />

          <RevenueBarChart />
          <Title style={styles.title}>

            {orders.length > 0 ? t("welcome.last_4_orders") : ""}
          </Title>
          <View>

            <FlatList
              data={orders.slice(0, 5)}
              // Data.slice(0,4
              renderItem={renderOrder}
              keyExtractor={keyExtractor}
            />

          </View>

        </>
      ) : (
        <WelcomeAnimation />
      )}

      {/* <ButtonFilled

        onPress={() =>
          navigation.navigate("Orders", {
            order_type: "sale",
          })
        }
        color={"#008000"}
      >
        {t("welcome.place_an_order")}
      </ButtonFilled>  */}
      {/* <Text style={{
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 3,
        padding: 5,
        textDecorationLine: 'underline',
        color: "green"
      }}>
        View More
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {},
  title: {
    fontSize: 16,
    alignSelf: "center",
    color: "#718096",
    textTransform: 'uppercase'

  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
});
