import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import InputText from "../../components/InputText";
import FloatingButton from "../../components/FloatingButton";
import SupplierService from "../../services/SupplierService";
import RightNavSearch from "../../components/RightNavSearch";
import { SupplierAnimation } from "../../components/SupplierAnimation";

const AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkz2csrDxNULWyTj-K3rbpC0E8SG2qLZg8gA&usqp=CAU";

export default function CustomerListScreen({ navigation }) {
  const [suppliers, setSuppliers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshSuppliers();
      });
    }, [])
  );

  useEffect(() => {
    refreshSuppliers();
  }, []);

  /**
   * Refresh Suppliers from DB
   */
  async function refreshSuppliers() {
    SupplierService.getSuppliers().then((suppliers) => {
      setSuppliers(suppliers);
      console.log(suppliers);
    });

    setHeaderRight();
  }

  /**
   * Set Header Right
   */
  function setHeaderRight() {
    navigation.setOptions({
      headerTitle: "Suppliers",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
        >
          <AntDesign name="menuunfold" size={24} color="green" onPress={() => navigation.openDrawer()} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <RightNavSearch onPressSearch={activateSearch} style={{ width: 100 }} />
      ),
    });
  }
  /**
   * Filter Items
   */
  function searchSuppliers(text) {
    const itemsToSearchFrom = suppliers;
    let filtered = itemsToSearchFrom.filter((item) => {
      return item.name.toLowerCase().includes(text.toLowerCase());
    });

    // If the input is empty then display all
    // Items from Database
    if (text === "") {
      refreshSuppliers();
    }
  }

  /**
   * Activate Search
   */
  function activateSearch() {
    navigation.setOptions({
      headerTitle: () => (
        <InputText
          autoFocus={true}
          placeholder={"Search..."}
          onChangeText={searchSuppliers}
          style={{ color: "#f7fafc" }}
          placeholderTextColor={"#f7fafc"}
        />
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={refreshSuppliers}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingRight: 13 }}
          onPress={refreshSuppliers}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }

  /**
   * Render Customers in a list
   */
  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Edit Supplier", {
            supplier: item,
          })
        }
      >
        <View style={styles.row}>
          <Image style={styles.avatar} source={{ uri: AVATAR }} />
          <View style={styles.rowText}>
            <Text style={styles.names}>{item.company_name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
          <View style={styles.rowText}>
            <Text style={styles.phone}>{item.address}</Text>
          </View>
          <Text>
            <MaterialIcons name="chevron-right" size={32} color="#a0aec0" />
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {suppliers.length > 0 ? (
        <>
          <FlatList
            data={suppliers}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <FloatingButton onPress={() => navigation.navigate("New Supplier")}>
            {"+"}
          </FloatingButton>
        </>
      ) : (
        <SupplierAnimation />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  phone: {
    fontSize: 14,
  },
  names: {
    fontWeight: "bold",
    paddingRight: 10,
  },
});
