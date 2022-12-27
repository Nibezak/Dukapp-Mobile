import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import FloatingButton from "../../components/FloatingButton";
import CustomerService from "../../services/CustomerService";
import RenderCustomer from "./RenderCustomer";
import Header from "../../components/Header";
import InputText from "../../components/InputText";
import { t } from "i18n-js";
import OrderService from "../../services/OrderService";

export default function CustomerSearchScreen({ navigation, route }) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [customersBuffer, setCustomersBuffer] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshCustomers();
      });
    }, [])
  );

  useEffect(() => {
    refreshCustomers;
  }, []);

  async function refreshCustomers() {
    CustomerService.getCustomers().then((dbCustomers) => {
      const customersFromDB = [
        {
          id: "add_customer",
          names: "add_customer",
          phone: "add_customer",
          email: "add_customer",
          address: "add_customer",
          note: "add_customer",
        },
        ...dbCustomers,
      ];

      setCustomers(customersFromDB);
    });
  }

  /**
   * Handle Search
   */
  function handleSearch(text) {
    // 1. Update the state
    setSearchTerm(text.trim());

    if (customersBuffer.length === 0) {
      setCustomersBuffer(customers);
    }

    const customersToSearchFrom = customersBuffer;

    // 2. Find customers matching what the user typed
    //    and suggest the user these customers
    let filteredCustomers = customersToSearchFrom.filter((customer) => {
      return customer.names.toLowerCase().startsWith(text.trim().toLowerCase());
    });

    setCustomers(filteredCustomers);
  }

  /**
   *
   * @param {customer} customer
   */
  async function handleCustomerSelected(customer) {
    // Search came from the order, add customer to the order
    // and redirect back
    if (route.params?.order) {
      await OrderService.addCustomerToOrder(route.params.order.id, customer.id);
      return navigation.goBack();
    }

    //
    navigation.navigate("Edit Customer", {
      customer: customer,
    });
  }

  /**
   * Render Customers in a list
   */
  const renderCustomer = useCallback(({ item }) => (
    <RenderCustomer
      item={item}
      index={item.id}
      key={item.id}
      onPress={() => handleCustomerSelected(item)}
    />
  ));

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <Header>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 10, marginTop: 10, marginRight: 20 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <InputText
          value={searchTerm}
          autoFocus={true}
          onChangeText={handleSearch}
          placeholder={t("common.search_placeholder")}
          style={{ borderBottomWidth: 0, color: "#f2f2f2" }}
          placeholderTextColor={"#f2f2f2"}
        />

        <TouchableOpacity
          style={{ paddingRight: 10, marginTop: 10 }}
          onPress={() => {
            setSearchTerm("");
            handleSearch("");
          }}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </Header>
      <FlatList
        style={{ marginTop: 20 }}
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={6}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
