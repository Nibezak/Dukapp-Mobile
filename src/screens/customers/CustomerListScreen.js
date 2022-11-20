import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, InteractionManager, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import FloatingButton from "../../components/FloatingButton";
import CustomerService from "../../services/CustomerService";
import RenderCustomer from "./RenderCustomer";

export default function CustomerListScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);

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

  /**
   * Get DB customers
   */
  async function refreshCustomers() {
    CustomerService.getCustomers().then(setCustomers);
  }

  /**
   * Render Customers in a list
   */
  const renderItem = useCallback(({ item }) => (
    <RenderCustomer
      item={item}
      index={item.id}
      key={item.id}
      onPress={() =>
        navigation.navigate("Edit Customer", {
          customer: item,
        })
      }
    />
  ));

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={customers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={6}
      />
      <FloatingButton onPress={() => navigation.navigate("New Customer")}>
        <MaterialIcons name="person-add-alt" size={32} />
      </FloatingButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
