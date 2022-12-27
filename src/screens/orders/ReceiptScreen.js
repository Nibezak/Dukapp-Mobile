import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ZigzagView from "react-native-zigzag-view";
import { MaterialIcons } from "@expo/vector-icons";
import { t } from "i18n-js";
import { AuthContext } from "../../context/AuthProvider";
import { number } from "../../helpers/Numbers";
import CustomerService from "../../services/CustomerService";
import { getSetting } from "../../models/AsyncStorage";


export default function ReceiptScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const order = route.params.order;
  const payment = order.payments[0];
  const [customer, setCustomer] = useState(route.params?.customer);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    // update nav
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => alert("Printing To Be Activated")}
            style={{ paddingRight: 20 }}
          >
            <MaterialIcons name="print" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert("Sharing To Be Activated")}
            style={{ paddingRight: 20 }}
          >
            <MaterialIcons name="share" size={24} />
          </TouchableOpacity>
        </View>
      ),
    });

    // Fetch Customer
    getOrderCustomer();

    retrieveSetting();
  }, []);

  /**
   * Retrieve Settings
   */
  function retrieveSetting() {
    getSetting("business_name").then(setBusinessName);
    getSetting("contact_address").then(setAddress);
    getSetting("contact_phone").then(setPhone);
    getSetting("app_default_currency").then(setCurrency);
  }

  /**
   * Get Customer By Id
   */
  async function getOrderCustomer() {
    if (order.customer_supplier_id === 0) {
      // Nothing to do if there is no customer or
      // supplier
      return;
    }

    // Find Customer for this order and attach to the order
    CustomerService.find(order.customer_supplier_id)
      .then((result) => {
        setCustomer(result[0]);
      })
      .catch((error) => {
        throw error;
      });
  }

  return (
    <View>
      <ZigzagView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <Text>Powered by Dukapp <MaterialIcons name="copyright" size={15} color="black" /></Text>
        {/** RECEIPT HEADER */}
        <View style={styles.shopDetailsContainer}>
          <Text style={styles.shopName}>{businessName}</Text>
          <Text style={styles.shopAddress}>{address}</Text>
          <Text style={styles.shopAddress}>
            {t("receipt.telephone")}
            {phone}
          </Text>
        </View>

        {/** ORDER DETAILS */}
        <View style={styles.orderDetails}>
          <Text style={styles.receiptNumber}>#Invoice-number: {order.id}</Text>
        </View>

        {/** CUSTOMER DETAILS */}
        <View style={styles.customerContainer}>
          <Text style={styles.customerText}>
            {order.order_type === "sale"
              ? t("receipt.customer")
              : t("receipt.supplier")}
            {customer.names}
          </Text>
        </View>

        {/** PAYMENT DETAILS */}
        <View style={styles.paymentsContainer}>
          <Text style={styles.paymentTitle}>
            {t("receipt.payment")}
            {payment.title}
          </Text>
        </View>
        <View style={styles.paymentsContainer}>
          <Text style={styles.paymentTitle}>
            {t("receipt.date")}
            {order.created_at}
          </Text>
        </View>

        {/** ORDER LINE ITEMS */}
        <View style={styles.itemContainer}>
          {/** HEADERS */}
          <View style={styles.itemHeader}>
            <Text style={styles.itemNameHeader}> {t("receipt.item_name")}</Text>
            <Text style={styles.itemAmountHeader}>
              {t("receipt.amount", { currency: currency })}
            </Text>
          </View>

          {/** ITEM LINES */}
          {order.line_items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name}
                {" x "} {item.quantity}
              </Text>
              <Text style={styles.itemAmount}>{number(item.total)}</Text>
            </View>
          ))}

          {/** FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.totalLabel}> {t("receipt.total")}</Text>
            <Text style={styles.totalAmount}>{number(order.total)}</Text>
          </View>
        </View>
      </ZigzagView>
    </View>
  );
}

const styles = StyleSheet.create({
  shopDetailsContainer: {
    marginTop: 20
  },
  shopName: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    color: "#4a5568",
  },
  customerContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  customerText: { color: "#4a5568" },
  date: {
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    color: "#4a5568",
  },
  receiptNumber: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    margin: 20,
    color: "#4a5568",
  },
  paymentsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  paymentTitle: {
    fontSize: 16,
    color: "#4a5568",
  },
  paymentAmount: {
    paddingLeft: 10,
    fontSize: 16,
    color: "#14532d",
  },
  shopAddress: {
    fontSize: 15,
    padding: 5,
    textAlign: "center",
    color: "#4a5568",
  },
  itemContainer: {
    marginTop: 30,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#cbd5e0",
    borderBottomWidth: 1,
  },
  itemNameHeader: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row",
    color: "#4a5568",
  },
  itemAmountHeader: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#4a5568",
  },
  itemRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#4a5568",
  },
  itemName: {
    fontSize: 15,
    color: "#4a5568",
  },
  itemAmount: {
    fontSize: 15,
    textDecorationStyle: "solid",
    color: "#4a5568",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#cbd5e0",
    marginTop: 15,
    paddingTop: 10,
    fontSize: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a5568",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a5568",
  },
});
