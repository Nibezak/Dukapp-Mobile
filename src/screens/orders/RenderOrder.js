import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { t } from "i18n-js";
import { money } from "../../helpers/Numbers";
import { useNavigation } from "@react-navigation/native";
import { getSetting } from "../../models/AsyncStorage";

export default function RenderOrder({ item }) {
  const navigation = useNavigation();
  const order = item.item;
  const payment = order.payments[0];

  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    getSetting("app_default_currency").then(setCurrency);
  }, []);

  const handlerLongClick = () => {
    //handler for Long Click
    alert('Are you sure your want to delete this Item?');
  };

  return (
    <TouchableOpacity
      onLongPress={handlerLongClick}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("Order Details", {
          order: order,
        })
      }
    >
      <View style={styles.row}>
        <Text style={styles.orderNumberColumn}>
          {order.order_type.substr(0, 1).toUpperCase()}
          {"#" + order.id}
        </Text>
        <Text style={styles.itemNameColumn} numberOfLines={2}>
          {order.line_items.length === 1
            ? order.line_items[0].name
            : t("order.items", { count: order.line_items.length })}
        </Text>
        <View style={styles.itemPriceColumn}>
          <Text style={[styles.amount]}>{money(order.total, currency)}</Text>
          <Text
            style={[
              styles.paymentMethod,
              {
                color: payment.method == "credit" ? "#f1c40f" : "#10b981",
              },
            ]}
          >
            {payment.title?.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>


  );
}

const styles = {
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    paddingHorizontal: 1,
    marginHorizontal: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e0",
  },
  amount: {
    fontSize: 14,
  },
  itemName: {
    paddingRight: 5,
    flexGrow: 1,
    width: 25,
  },
  orderNumberColumn: {
    flex: 1,
    color: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  itemNameColumn: {
    flex: 3,
    marginHorizontal: 5,
  },
  itemPriceColumn: {
    flex: 4,
    flexDirection: "row",
  },
  paymentMethod: {
    flex: 1,
    marginRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
  },
  rightArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
};
