import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { t } from "i18n-js";
import InputText from "../../components/InputText";
import InputTextDisabled from "../../components/InputTextDisabled";
import InputSwitch from "../../components/InputSwitch";
import Button from "../../components/Button";
import ItemService from "../../services/ItemService";
import OrderService from "../../services/OrderService";
import FieldText from "../../components/FieldText";

export default function EditItemScreen({ navigation, route }) {
  // Define state
  const [item, setItem] = useState(route.params.item);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category);
  const [reOrderLevel, setReorderLevel] = useState(item.reorder_level);
  const [quantity, setQuantity] = useState(item.quantity);
  const [unitPrice, setUnitPrice] = useState(item.cost_price);
  const [salePrice, setSalePrice] = useState(item.sale_price);

  // Product is Service?
  const [isService, setIsService] = useState(item.is_service == 1); // Convert 1 to true and 0 to false
  const toggleSwitch = () => setIsService((previousState) => !previousState);

  useEffect(() => {
    if (route.params?.item_name) {
      // Selling new item, do something with `route.params.item_name`
      setName(route.params.item_name);
    }
    updateNavRight();
  }, []);

  function updateNavRight() {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSaleItem} style={{ paddingRight: 20 }}>
          <Text style={{ color: "#10b981", fontWeight: "bold" }}>
            {t("item.sale")}
          </Text>
        </TouchableOpacity>
      ),
    });
  }
  /**
   * Handle Sale of currently viewed item
   *
   */
  async function handleSaleItem() {
    OrderService.quickSale(item, "sale").then((result) => {
      ToastAndroid.show(
        t("item.item_is_sold", { item_name: item.name }),
        ToastAndroid.SHORT
      );
    });
  }

  /**
   * Add new stock in the database
   */
  async function handleSaveItem() {
    // Prepare data to save
    let itemToUpdate = item;

    itemToUpdate.name = name;
    itemToUpdate.description = description;
    itemToUpdate.category = category;
    itemToUpdate.reorder_level = isService ? 0 : reOrderLevel;
    itemToUpdate.quantity = isService ? 0 : quantity;
    itemToUpdate.cost_price = isService ? 0 : unitPrice;
    itemToUpdate.sale_price = salePrice;
    itemToUpdate.is_service = isService;

    // Store data in database
    const lastItemId = await ItemService.save(itemToUpdate);

    // 3. Go back to the previous screen
    navigation.goBack();
  }

  /**
   * Delete Item from DB
   */
  async function handleDeleteItem() {
    ItemService.destroy(item);
    navigation.goBack();
  }

  /**
   * Render to the screen
   */
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 10,
          paddingRight: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#cbd5e0",
          color: "#cbd5e0",
        }}
      >
        <InputSwitch
          onValueChange={toggleSwitch}
          value={isService}
          title={t("item.is_item_service")}
        />
      </View>

      <View style={styles.row}>
        <FieldText
          title={t("item.name")}
          value={name}
          onChangeText={setName}
          underlineColorAndroid="transparent"
          placeholder={t("item.name_placeholder")}
        />
      </View>

      <View style={styles.row}>
        <FieldText
          title={t("item.description")}
          value={description}
          onChangeText={setDescription}
          underlineColorAndroid="transparent"
          placeholder={t("item.description")}
        />
      </View>

      <View style={styles.row}>
        <FieldText
          title={t("item.category")}
          value={category}
          onChangeText={setCategory}
          underlineColorAndroid="transparent"
          placeholder={t("item.category_placeholder")}
        />
      </View>

      {/** Only display this section if this is not a service */}
      {isService ? (
        <></>
      ) : (
        <>
          <View style={styles.row}>
            <FieldText
              title={t("item.re_order_level")}
              value={reOrderLevel.toString()}
              onChangeText={setReorderLevel}
              underlineColorAndroid="transparent"
              placeholder={t("item.re_order_level_placeholder")}
              keyboardType="numeric"
            />
            <InputTextDisabled
              title={t("item.quantity")}
              value={quantity.toString()}
              onChangeText={setQuantity}
              underlineColorAndroid="transparent"
              placeholder={t("item.quantity_placeholder")}
              keyboardType="numeric"
            />
          </View>
        </>
      )}
      <View style={styles.row}>
        {isService ? (
          <></>
        ) : (
          <>
            <FieldText
              title={t("item.unit_cost_price")}
              value={unitPrice.toString()}
              onChangeText={setUnitPrice}
              underlineColorAndroid="transparent"
              placeholder={t("item.unit_cost_price_placeholder")}
              keyboardType="numeric"
            />
          </>
        )}
        {/** END OF NON SERVICE PRODUCT */}

        <FieldText
          title={t("item.unit_sale_price")}
          value={salePrice.toString()}
          onChangeText={setSalePrice}
          underlineColorAndroid="transparent"
          placeholder={t("item.unit_sale_price_placeholder")}
          keyboardType="numeric"
        />
      </View>

      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Button onPress={handleDeleteItem} color={"#dc2626"}>
          {t("common.delete")}
        </Button>
        <Button onPress={handleSaveItem} color={"#15803d"}>
          {t("common.save")}
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
    marginVertical: 5,
    marginHorizontal: 20,
  },
});
