import React, { useState, useEffect } from "react";
import { View, Text, Picker, StyleSheet } from "react-native";
import OrderService from "../../services/OrderService";
import Button from "../../components/Button";
import FieldText from "../../components/FieldText";
import InputSelect from "../../components/InputSelect";
import { getSetting } from "../../models/AsyncStorage";
import { t } from "i18n-js";
import InputText from "../../components/FieldText";
import { unixHourStamp, unixMinuteStamp, unixTimeStamp } from "../../helpers/Dates";

var paymentOptions = [
  { value: "cash", label: "Cash" },
  { value: "mobile_mtn_momo", label: "MTN MoMo" },
  { value: "mobile_airtel_money", label: "Airtel Money" },
  { value: "mobile_mpesa", label: "M-Pesa" },
  { value: "credit", label: "Credit" },
  { value: "others", label: "Others" },
];

export default function OrderPaymentScreen({ navigation, route }) {
  const [order, setOrder] = useState(route.params.order);
  const orderPayment = route.params.order.payments[0];

  const [amount, setAmount] = useState(order.total);
  const [method, setMethod] = useState(orderPayment.method);
  const [title, setTitle] = useState(orderPayment.title);
  const [currency, setCurrency] = useState(orderPayment.currency);
  const [selectedValue, setSelectedValue] = useState(orderPayment.method);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Payment - Order #" + order.id,
    });

    getSetting("app_default_currency").then(setCurrency);
  }, []);

  function handleSetMethod(value, index) {
    const paymentOption = paymentOptions[index];
    setMethod(paymentOption.value);
    setTitle(paymentOption.label);
  }

  /**
   * Handle Add order to payment functionality
   */
  async function handleAddPayment() {
    let payments = [
      {
        method: method,
        title: title,
        transaction_id: "P" + unixTimeStamp(),
        amount: amount,
        currency: currency,
        date_paid: ` ${unixHourStamp()}:${unixMinuteStamp()}`,
      },
    ];

    await OrderService.addPaymentToOrder(order.id, payments);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <InputSelect
          testID={"payment-option-selection"}
          mode={"dropdown"}
          title={"Payment Method"}
          selectedValue={method}
          style={{ height: 150, width: 150 }}
          onValueChange={(itemValue, itemIndex) =>
            handleSetMethod(itemValue, itemIndex)
          }
          options={paymentOptions}
        />
      </View>
      <View style={styles.row}>
        <FieldText
          defaultValue={order.total.toString()}
          title={"the about amount in " + currency + " Currency"}
          // onChangeText={setAmount}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          editable={false}
          selectTextOnFocus={false}
        />
      </View>
      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Button onPress={() => navigation.goBack()} color={"#f1f1f1"} backgroundColor={'#f59e0b'}>
          {"Cancel"}
        </Button>
        <Button onPress={handleAddPayment} color={"#f1f1f1"} backgroundColor={'#47a67f'}>
          {"Save"}
        </Button>
      </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 30
  },
  amount: {
    fontSize: 14,
    fontWeight: "800",
    paddingRight: 5,
  },
  itemName: {
    paddingRight: 5,
    flexGrow: 1,
    width: 30,
  },
  itemDescription: {
    paddingRight: 10,
  },
});
