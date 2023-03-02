import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { money } from "../../helpers/Numbers";
import { t } from "i18n-js";
import { getSetting } from "../../models/AsyncStorage";
/**
 * Render Customers in a list
 */
export default function RenderItem({ item, index, onPress }) {
  const navigation = useNavigation();
  const [currency, setCurrency] = useState(null);
  useEffect(() => {
    getSetting("app_default_currency").then(setCurrency);
  }, []);

  //  Change layout for the add action
  if (item.id === "add") {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("New Item")}>
        {/** Give options to add a new item */}
        <View
          style={[
            styles.row,
            {
              padding: 10,
              backgroundColor: "#f1f1f1",
              alignContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <MaterialIcons
            name="add"
            size={34}
            color="#15803d"
            style={[styles.avatar]}
          />

          <Text
            style={{
              fontSize: 18,
              alignSelf: "center",
              textAlign: "center",
              fontWeight: "700",
              color: "#15803d",
            }}
          >
            {t("item.new_item")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const isService = parseInt(item.is_service) === 1;
  const isLowStock = item.quantity < item.reorder_level;
  const noStock = item.quantity <= 0;

  return (

    <TouchableOpacity onPress={onPress} style={{ paddingVertical: 5, backgroundColor: "white" }}>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.names}>{item.name}</Text>
          <View style={{ flexDirection: "row", marginLeft: 3, padding: 1 }}>

            <Text
              style={[
                styles.details,
                {
                  padding: 3,
                  backgroundColor:
                    isLowStock && !isService ? "#fef9c3" : "#f0fdf4",
                  margin: 5,
                  color: isLowStock && !isService ? "#854d0e" : "#15803d",
                },
              ]}
            >
              {isService
                ? t("item.service")
                : t("item.in_stock") + item.quantity}

            </Text>

          </View>
        </View>
        <View style={styles.rowText}>
          <Text style={styles.details}>
            {t("item.sales_at")}
            {money(item.sale_price, currency)}
          </Text>
        </View>
        <Text>
          <MaterialIcons name="chevron-right" size={32} color="#47a67f" />
        </Text>
      </View>
    </TouchableOpacity >
  );
}
const styles = {
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 5,
    paddingHorizontal: 1,
    marginHorizontal: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e0",
    padding: 10,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rowText: {
    flex: 1,
  },
  details: {
    alignSelf: "flex-end",
    fontSize: 14,
    paddingVertical: 3,
    marginHorizontal: 7,

  },
  names: {
    fontWeight: "bold",
  },
};
