import React, { useEffect, useCallback, useState } from "react";
import { View, FlatList, StyleSheet, Image, InteractionManager } from "react-native";
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
      headerTitle: () => (<Image source={require('./../../../assets/snack-icon.png')} style={{ width: 80, height: 80 }} />),
      headerTitleAlign: "left",
      headerRight: () => (
        <SettingsButton
          onPress={() => navigation.navigate("General Settings")}
        />
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

      <Title style={styles.title}>
        {t("welcome.today_insights")}
      </Title>
      <HomeSummary />
      <Divider style={{ padding: 2 }} />

      <Divider />
      {/** Main menu on welcome screen */}
      <View style={{ marginVertical: 10 }}>
        <HomeMenus />
      </View>

      <Title style={styles.title}>

        {orders.length > 0 ? t("welcome.last_5_orders") : ""}
      </Title>
      <View>

        <FlatList
          data={orders.slice(0, 5)}
          // Data.slice(0,4
          renderItem={renderOrder}
          keyExtractor={keyExtractor}
        />

      </View>

      <ButtonFilled

        onPress={() =>
          navigation.navigate("Orders", {
            order_type: "sale",
          })
        }
        color={"#05a82e"}
      >
        {t("welcome.place_an_order")}
      </ButtonFilled>
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
