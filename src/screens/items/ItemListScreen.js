import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import FloatingButton from "../../components/FloatingButton";
import ItemService from "../../services/ItemService";
import SearchButton from "../../components/SearchButton";
import RenderItem from "./RenderItem";
import { number } from "../../helpers/Numbers";
import { t } from "i18n-js";

//const AVATAR =
//'https://cdn4.vectorstock.com/i/1000x1000/16/38/add-item-icon-vector-16301638.jpg';

export default function ItemListScreen({ navigation }) {
  // Set the state
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshItems();
      });
    }, [])
  );

  useEffect(() => {
    refreshItems();
  }, []);

  /**
   * Refresh Suppliers from DB
   */
  async function refreshItems() {
    //
    ItemService.getItems().then(setItems);
    // Set the header with search and settings
    setHeaderRight();
  }

  /**
   * Set Header Right
   */
  function setHeaderRight() {
    navigation.setOptions({
      headerTitle: t("item.items_header"),
      headerLeft: () => (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <SearchButton onPress={() => navigation.navigate("Item Search")} />
      ),
    });
  }

  const renderItem = useCallback(({ item }) => (
    <RenderItem
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

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={6}
      />
      <FloatingButton onPress={() => navigation.navigate("New Item")} />
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
    borderBottomColor: "#e2e8f0",
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
    alignSelf: "flex-start",
    fontSize: 14,
  },
  names: {
    fontWeight: "bold",
    paddingRight: 10,
  },
});
