import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, ToastAndroid, TouchableOpacity, Alert } from 'react-native';
import { t } from 'i18n-js';
import InputTextDisabled from '../../components/InputTextDisabled';
import InputSwitch from '../../components/InputSwitch';
import Button from '../../components/Button';
import { Formik } from 'formik';
import {
  serviceValidationSchema,
  normalValidationSchema,
} from '../../helpers/validation/itemValidation.js';
import ItemService from '../../services/ItemService';
import OrderService from '../../services/OrderService';
import FieldText from '../../components/FieldText';
import Item from '../../models/Item';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemeContext } from '../../../App';
import ButtonFilled from '../../components/ButtonFilled';

export default function EditItemScreen({ navigation, route }) {
  // Define state
  const [item, setItem] = useState(route.params.item);
  const { theme } = useContext(ThemeContext);

  // Product is Service?
  const [isService, setIsService] = useState(item.is_service == 1); // Convert 1 to true and 0 to false
  const toggleSwitch = () => setIsService((previousState) => !previousState);

  useEffect(() => {
    if (route.params?.item_name) {
      // Selling new item, do something with `route.params.item_name`
      setName(route.params.item_name);
    }
    updateNavRight();
  }, [theme]);

  function updateNavRight() {
    navigation.setOptions({
      headerTintColor: theme.text,
      headerStyle: {
        backgroundColor: theme.accent,
      },
      headerRight: () => (
        <>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={handleSaleItem}
              style={{ paddingRight: 20, marginHorizontal: 20, marginVertical: 3 }}
            >
              <Text style={{ color: theme.text, fontWeight: 'bold' }}>{t('item.sale')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteButton} style={{ paddingRight: 20 }}>
              <MaterialIcons name="delete" size={24} color={theme.danger} />
            </TouchableOpacity>
          </View>
        </>
      ),
    });
  }
  /**
   * Handle Sale of currently viewed item
   *
   */
  async function handleSaleItem() {
    if (item.quantity <= 0) {
      Alert.alert(
        'The Stock of : ' + item.name + ' is insuffient #',
        'The remaining quantity is : ' +
          item.quantity +
          ' Please Add more stock to be able to sell',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'CANCEL',
          },
        ]
      );
      return;
    }
    OrderService.quickSale(item, 'sale').then((result) => {
      ToastAndroid.show(t('item.item_is_sold', { item_name: item.name }), ToastAndroid.SHORT);
    });
  }
  function handleDeleteButton() {
    Alert.alert(
      'Deleting Item : ' + item.name,
      'Are you sure you want to Delete Item # ' + item.name + '?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'CANCEL',
        },
        { text: 'DELETE', onPress: () => deleteThisOrder(), style: 'destructive' },
      ]
    );
  }

  function deleteThisOrder() {
    /** Pass order to be deleted */
    Item.destroy(item.id)
      .then((result) => {
        return navigation.goBack();
      })
      .then(() => {
        ToastAndroid.show('Item has been Delete', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Add new stock in the database
   */
  async function handleSaveItem(itemToUpdate) {
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 10,
            paddingRight: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#cbd5e0',
            color: '#cbd5e0',
          }}
        >
          <InputSwitch
            onValueChange={toggleSwitch}
            value={isService}
            title={t('item.is_item_service')}
          />
        </View>
        <ScrollView>
          <Formik
            initialValues={{
              name: item.name,
              description: item.description,
              category: item.category,
              reOrderLevel: item.reorder_level,
              quantity: item.quantity,
              unitPrice: item.cost_price,
              salePrice: item.sale_price,
            }}
            onSubmit={(values) => {
              // Prepare data to save
              let itemToUpdate = item;

              itemToUpdate.name = values.name;
              itemToUpdate.description = values.description;
              itemToUpdate.category = values.category;
              itemToUpdate.reorder_level = isService ? 0 : values.reOrderLevel;
              itemToUpdate.quantity = isService ? 0 : values.quantity;
              itemToUpdate.cost_price = isService ? 0 : values.unitPrice;
              itemToUpdate.sale_price = values.salePrice;
              itemToUpdate.is_service = isService;
              handleSaveItem(itemToUpdate);
            }}
            validationSchema={isService ? serviceValidationSchema : normalValidationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <>
                <View style={styles.row}>
                  <FieldText
                    title={t('item.name')}
                    value={values.name}
                    onBlur={handleBlur('name')}
                    onChangeText={handleChange('name')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.name_placeholder')}
                  />
                </View>
                {errors.name && <Text style={{ fontSize: 10, color: 'red' }}>{errors.name}</Text>}

                <View style={styles.row}>
                  <FieldText
                    title={t('item.description')}
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.description')}
                  />
                </View>
                {errors.description && (
                  <Text style={{ fontSize: 10, color: 'red' }}>{errors.description}</Text>
                )}

                <View style={styles.row}>
                  <FieldText
                    title={t('item.category')}
                    value={values.category}
                    onChangeText={handleChange('category')}
                    onBlur={handleBlur('category')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.category_placeholder')}
                  />
                </View>
                {errors.category && (
                  <Text style={{ fontSize: 10, color: 'red' }}>{errors.category}</Text>
                )}

                {/** Only display this section if this is not a service */}
                {isService ? (
                  <></>
                ) : (
                  <>
                    <View style={styles.row}>
                      <FieldText
                        title={t('item.re_order_level')}
                        value={values.reOrderLevel.toString()}
                        onChangeText={handleChange('reOrderLevel')}
                        onBlur={handleBlur('reOrderLevel')}
                        underlineColorAndroid="transparent"
                        placeholder={t('item.re_order_level_placeholder')}
                        placeholderTextColor={theme.text}
                        keyboardType="numeric"
                      />
                      <FieldText
                        title={t('item.quantity')}
                        value={values.quantity.toString()}
                        onChangeText={handleChange('quantity')}
                        onBlur={handleBlur('quantity')}
                        underlineColorAndroid="transparent"
                        placeholder={t('item.quantity_placeholder')}
                        placeholderTextColor={theme.text}
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
                        title={t('item.unit_cost_price')}
                        value={values.unitPrice.toString()}
                        onChangeText={handleChange('unitPrice')}
                        onBlur={handleBlur('unitPrice')}
                        underlineColorAndroid="transparent"
                        placeholder={t('item.unit_cost_price_placeholder')}
                        placeholderTextColor={theme.text}
                        keyboardType="numeric"
                      />
                    </>
                  )}
                  {/** END OF NON SERVICE PRODUCT */}

                  <FieldText
                    title={t('item.unit_sale_price')}
                    value={values.salePrice.toString()}
                    onChangeText={handleChange('salePrice')}
                    onBlur={handleBlur('salePrice')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.unit_sale_price_placeholder')}
                    placeholderTextColor={theme.text}
                    keyboardType="numeric"
                  />
                </View>
                <View
                  style={{
                    marginLeft: 25,
                  }}
                >
                  {errors.quantity && (
                    <Text style={{ fontSize: 13, color: theme.danger }}>{errors.quantity}</Text>
                  )}
                  {errors.reOrderLevel && (
                    <Text style={{ fontSize: 13, color: theme.danger }}>{errors.reOrderLevel}</Text>
                  )}
                  {errors.unitPrice && (
                    <Text style={{ fontSize: 13, color: theme.danger }}>{errors.unitPrice}</Text>
                  )}
                  {errors.salePrice && (
                    <Text style={{ fontSize: 13, color: theme.danger }}>{errors.salePrice}</Text>
                  )}
                </View>

                <View style={[styles.row, { borderBottomWidth: 0 }]}>
                  {/* <Button onPress={handleDeleteItem} color={'#f1f1f1'} backgroundColor='#ef4444'>
            {t('common.delete')}
          </Button> */}
                  <View style={{ width: '50%' }}>
                    <ButtonFilled
                      onPress={handleSubmit}
                      color={theme.primary}
                      labelColor={theme.text}
                    >
                      {t('common.save')}
                    </ButtonFilled>
                  </View>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAwareScrollView>
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 20,
  },
});
