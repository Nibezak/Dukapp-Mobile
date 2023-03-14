import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { t } from 'i18n-js';
import { Formik } from 'formik';
import {
  serviceValidationSchema,
  normalValidationSchema,
} from '../../helpers/validation/itemValidation.js';
import FieldText from '../../components/FieldText';
import InputSwitch from '../../components/InputSwitch';
import Button from '../../components/Button';
import ItemService from '../../services/ItemService';
import OrderService from './../../services/OrderService';
import { ScrollView } from 'react-native-gesture-handler';

export default function CreateItemScreen({ navigation, route }) {
  // Product is Service?
  const [isService, setIsService] = useState(false);
  const toggleSwitch = () => setIsService((previousState) => !previousState);

  /**
   * Add new stock in the database
   */
  async function addStock(item) {
    // Store data in database
    const result = await ItemService.save(item);

    const item_id = result.insertId;

    // Redirect to previous screen after selling
    if (route.params?.action_type == 'add_product_and_sale') {
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
    <>
      <KeyboardAwareScrollView>
        <ScrollView>
          <Formik
            initialValues={{
              name: '',
              description: '',
              category: '',
              reOrderLevel: '',
              quantity: '',
              unitPrice: '',
              salePrice: '',
            }}
            onSubmit={(values) => {
              // Prepare data to save

              const item = {
                name: values.name,
                description: values.description,
                category: values.category,
                reorder_level: isService ? 0 : values.reOrderLevel,
                quantity: isService ? 0 : values.quantity,
                cost_price: isService ? 0 : values.unitPrice,
                sale_price: values.salePrice,
                is_service: isService,
              };
              addStock(item);
            }}
            validationSchema={isService ? serviceValidationSchema : normalValidationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderWidth: 1,
                    borderBottomColor: '#cbd5e0',
                  }}
                >
                  <InputSwitch
                    onValueChange={toggleSwitch}
                    value={isService}
                    title={t('item.is_item_service')}
                  />
                </View>
                <View style={styles.row}>
                  <FieldText
                    value={values.name}
                    title={t('item.name')}
                    onBlur={handleBlur('name')}
                    onChangeText={handleChange('name')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.name_placeholder')}
                  />
                </View>
                {errors.name && <Text style={{ color: 'red', marginLeft: 15 }}>{errors.name}</Text>}
                <View style={styles.row}>
                  <FieldText
                    title={t('item.description')}
                    onChangeText={handleChange('description')}
                    value={values.description}
                    onBlur={handleBlur('description')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.description_placeholder')}
                  />
                </View>
                {errors.description && (
                  <Text style={{ color: 'red', marginLeft: 15 }}>{errors.description}</Text>
                )}
                <View style={styles.row}>
                  <FieldText
                    title={t('item.category')}
                    onChangeText={handleChange('category')}
                    value={values.category}
                    onBlur={handleBlur('category')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.category_placeholder')}
                  />
                </View>
                {errors.category && (
                  <Text style={{ color: 'red', marginLeft: 15 }}>{errors.category}</Text>
                )}

                {/** Only display this section if this is not a service */}
                {isService ? (
                  <></>
                ) : (
                  <>
                    <View style={styles.row}>
                      <FieldText
                        title={t('item.re_order_level')}
                        onChangeText={handleChange('reOrderLevel')}
                        value={values.reOrderLevel}
                        onBlur={handleBlur('reOrderLevel')}
                        underlineColorAndroid="transparent"
                        placeholder={t('item.re_order_level_placeholder')}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.reOrderLevel && (
                      <Text style={{ color: 'red', marginLeft: 15 }}>{errors.reOrderLevel}</Text>
                    )}

                    <View style={styles.row}>
                      <FieldText
                        title={t('item.quantity')}
                        onChangeText={handleChange('quantity')}
                        value={values.quantity}
                        onBlur={handleBlur('quantity')}
                        underlineColorAndroid="transparent"
                        placeholder={t('item.quantity_placeholder')}
                        keyboardType="numeric"
                      />
                    </View>

                    {errors.quantity && (
                      <Text style={{ color: 'red', marginLeft: 15 }}>{errors.quantity}</Text>
                    )}

                    <View style={styles.row}>
                      <FieldText
                        title={t('item.unit_cost_price')}
                        onChangeText={handleChange('unitPrice')}
                        value={values.unitPrice}
                        onBlur={handleBlur('unitPrice')}
                        underlineColorAndroid="transparent"
                        placeholder={t('item.unit_cost_price_placeholder')}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.unitPrice && (
                      <Text style={{ color: 'red', marginLeft: 15 }}>{errors.unitPrice}</Text>
                    )}
                  </>
                )}
                {/** END OF NON SERVICE PRODUCT */}
                <View style={styles.row}>
                  <FieldText
                    title={t('item.unit_sale_price')}
                    onChangeText={handleChange('salePrice')}
                    value={values.salePrice}
                    onBlur={handleBlur('salePrice')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.unit_sale_price_placeholder')}
                    keyboardType="numeric"
                  />
                </View>
                {errors.salePrice && (
                  <Text style={{ color: 'red', marginLeft: 15 }}>{errors.salePrice}</Text>
                )}

                <View style={styles.row}>
                  <Button
                    onPress={() => navigation.goBack()}
                    color={'#f1f1f1'}
                    backgroundColor={'#f59e0b'}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button onPress={handleSubmit} color={'#f1f1f1'} backgroundColor={'#47a67f'}>
                    {t('common.save')}
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
}

/**
 * Styles for the
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
});
