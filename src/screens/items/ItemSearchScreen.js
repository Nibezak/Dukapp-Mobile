import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { t } from "i18n-js";
import InputText from "../../components/InputText";
import ItemService from "../../services/ItemService";
import Header from "../../components/Header";
import RenderItem from "./RenderItem";

const AVATAR =
  "https://cdn4.vectorstock.com/i/1000x1000/16/38/add-item-icon-vector-16301638.jpg";

export default function ItemSearchScreen({ navigation }) {
  // Set the state
  const [items, setItems] = useState([]);
  const [itemsBuffer, setItemsBuffer] = useState([]);
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
    setItemsBuffer(items);
  }, []);

  /**
   * Handle Search
   */
  function handleSearch(text) {
    // 1. Update the state
    setSearchTerm(text.trim());

    if (itemsBuffer.length === 0) {
      setItemsBuffer(items);
    }

    const itemsToSearchFrom = itemsBuffer;

    // 2. Find items matching what the user typed
    //    and suggest the user these items
    let filteredItems = itemsToSearchFrom.filter((item) => {
      return item.name.toLowerCase().startsWith(text.trim().toLowerCase());
    });

    setItems(filteredItems);
  }

  /**
   * Refresh Suppliers from DB
   */
  async function refreshItems() {
    // Update Items STATE

    ItemService.getItems()
      .then((itemsFromDB) => {
        const updatedItems = [
          {
            id: "add",
            name: t("item.new_item"),
            description: t("item.new_item"),
            category: "add_new",
            reorder_level: 0,
            quantity: 0,
            cost_price: 0,
            sale_price: 0,
            is_service: 0,
          },
          ...itemsFromDB,
        ];
        setItems(updatedItems);
      })
      .catch((error) => {
        throw error;
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
        />

        <TouchableOpacity
          style={{ paddingRight: 1, marginTop: 10 }}
          onPress={() => {
            setSearchTerm("");
            handleSearch("");
          }}
        >
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
      </Header>

      <FlatList
        style={{ marginTop: 20 }}
        data={items}
        renderItem={renderItem}
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
