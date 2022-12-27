import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { t } from "i18n-js";
import FieldText from "../../components/FieldText";
import InputSwitch from "../../components/InputSwitch";
import Button from "../../components/Button";
import ItemService from "../../services/ItemService";
import OrderService from "./../../services/OrderService";

export default function CreateItemScreen({ navigation, route }) {
  // Define state
  const [name, setName] = useState(route.params?.item_name);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [reOrderLevel, setReorderLevel] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [items, setItems] = useState([]);

  // Product is Service?
  const [isService, setIsService] = useState(false);
  const toggleSwitch = () => setIsService((previousState) => !previousState);

  /**
   * Add new stock in the database
   */
  async function addStock() {
    // Prepare data to save
    const item = {
      name: name,
      description: description,
      category: category,
      reorder_level: isService ? 0 : reOrderLevel,
      quantity: isService ? 0 : quantity,
      cost_price: isService ? 0 : unitPrice,
      sale_price: salePrice,
      is_service: isService,
    };

    // Store data in database
    const result = await ItemService.save(item);

    const item_id = result.insertId;

    // Redirect to previous screen after selling
    if (route.params?.action_type == "add_product_and_sale") {
      // 1. Get last Item added to the DB
      ItemService.find(item_id).then((item) => {
        // 2. After retrieving the last created item,then
        // Attempt to make a sale on the same item
        if (route.params?.order_id) {
          // Order exists, add this item to the order
          const itemAttributes = {
            order_id: route.params.order_id,
            item_id: item.id,
            name: item.name,
            description: item.description,
            quantity: 1,
            unit_cost_price: item.cost_price,
            unit_sales_price: item.sale_price,
            total: item.quantity * item.sale_price,
          };

          OrderService.addItemToOrder(itemAttributes, route.params.order_type);
        } else {
          // This is a new order, make a quick sale
          OrderService.quickSale(item[0], route.params.order_type);
        }
      });
    }

    // 3. Go back to the previous screen
    navigation.goBack();
  }

  /**
   * Render to the screen
   */
  return (

    <KeyboardAwareScrollView
      style={{ backgroundColor: '#4c69a5' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 10,
          paddingRight: 10,
          borderWidth: 1,
          borderBottomColor: "#cbd5e0",
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
          value={name}
          title={t("item.name")}
          onChangeText={setName}
          underlineColorAndroid="transparent"
          placeholder={t("item.name_placeholder")}
        />
      </View>
      <View style={styles.row}>
        <FieldText
          title={t("item.description")}
          onChangeText={setDescription}
          underlineColorAndroid="transparent"
          placeholder={t("item.description_placeholder")}
        />
      </View>
      <View style={styles.row}>
        <FieldText
          title={t("item.category")}
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
          </View>

          <View style={styles.row}>
            <FieldText
              title={t("item.quantity")}
              value={quantity.toString()}
              onChangeText={setQuantity}
              underlineColorAndroid="transparent"
              placeholder={t("item.quantity_placeholder")}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <FieldText
              title={t("item.unit_cost_price")}
              value={unitPrice.toString()}
              onChangeText={setUnitPrice}
              underlineColorAndroid="transparent"
              placeholder={t("item.unit_cost_price_placeholder")}
              keyboardType="numeric"
            />
          </View>
        </>
      )}
      {/** END OF NON SERVICE PRODUCT */}
      <View style={styles.row}>
        <FieldText
          title={t("item.unit_sale_price")}
          onChangeText={setSalePrice}
          underlineColorAndroid="transparent"
          placeholder={t("item.unit_sale_price_placeholder")}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <Button onPress={() => navigation.goBack()} color={"#f59e0b"}>
          {t("common.cancel")}
        </Button>
        <Button onPress={addStock} color={"#15803d"}>
          {t("common.save")}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
  },
});
