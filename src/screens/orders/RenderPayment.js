import React from "react";
import { View } from "react-native";
import { money } from "../../helpers/Numbers";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18n-js";
import ButtonFilled from "../../components/ButtonFilled";
import { MaterialCommunityIcons } from "@expo/vector-icons";
/**
 * Render payment section
 */
export default function RenderPayment({ payment, customer, order }) {
  const navigation = useNavigation();

  const handleOnPressCustomer = () =>
    navigation.navigate("Search Customer", {
      order: order,
    });

  const handleOnPressPayment = () =>
    navigation.navigate("Add Payment To Order", {
      order: order,
    });

  return (
    <View style={{ flexDirection: "row" }}>
      {/* CUSTOMER SECTION */}
      <View style={{ flex: 1 }}>
        <ButtonFilled
          onPress={handleOnPressCustomer}
          color={"#a3a3a3"}
          labelColor={"#fafafa"}
        >
          <MaterialCommunityIcons name={"account"} size={16} />{" "}
          {t("order.customer_paid_by", {
            customer: customer.names,
          })}
        </ButtonFilled>
      </View>

      {/* PAYMENT METHOD SECTION */}
      <View style={{ flex: 1 }}>
        <ButtonFilled
          onPress={handleOnPressPayment}
          color={payment.method == "credit" ? "#facc15" : "#dcfce7"}
          labelColor={payment.method == "credit" ? "#0f172a" : "#14532d"}
        >
          {payment.title} {"-"} {money(payment.amount, payment.currency)}
        </ButtonFilled>
      </View>
    </View>
  );
}
