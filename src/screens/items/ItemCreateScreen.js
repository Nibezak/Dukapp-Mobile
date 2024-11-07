import React, { useContext, useEffect, useState } from 'react';
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
import OrderService from '../../services/OrderService';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '../../../App.js';
import ButtonFilled from '../../components/ButtonFilled.js';

const CreateItemScreen = ({ navigation, route }) => {
  const [isService, setIsService] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: theme.text,
      headerStyle: {
        backgroundColor: theme.accent,
      },
    });
  }, [theme]);

  const toggleServiceSwitch = () => setIsService(prevState => !prevState);

  const handleAddStock = async (item) => {
    const result = await ItemService.save(item);
    const itemId = result.insertId;

    if (route.params?.action_type === 'add_product_and_sale') {
      ItemService.find(itemId).then(item => {
        if (route.params?.order_id) {
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
          OrderService.quickSale(item[0], route.params.order_type);
        }
      });
    }

    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: theme.background }}>
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
            handleAddStock(item);
          }}
          validationSchema={isService ? serviceValidationSchema : normalValidationSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <>
              {/* <View style={styles.switchContainer}>
                <InputSwitch
                  onValueChange={toggleServiceSwitch}
                  value={isService}
                  title={t('item.is_item_service')}
                />
              </View> */}

              <FieldText
                value={values.name}
                title={t('item.name')}
                onBlur={handleBlur('name')}
                onChangeText={handleChange('name')}
                underlineColorAndroid="transparent"
                placeholder={t('item.name_placeholder')}
                errorMessage={errors.name ? t(`itemValidations.${errors.name}`) : ''}
              />

              <FieldText
                title={t('item.description')}
                onChangeText={handleChange('description')}
                value={values.description}
                onBlur={handleBlur('description')}
                underlineColorAndroid="transparent"
                placeholder={t('item.description_placeholder')}
                errorMessage={errors.description ? t(`itemValidations.${errors.description}`) : ''}
              />

              <FieldText
                title={t('item.category')}
                onChangeText={handleChange('category')}
                value={values.category}
                onBlur={handleBlur('category')}
                underlineColorAndroid="transparent"
                placeholder={t('item.category_placeholder')}
                errorMessage={errors.category ? t(`itemValidations.${errors.category}`) : ''}
              />

              {!isService && (
                <>
                  <FieldText
                    title={t('item.re_order_level')}
                    onChangeText={handleChange('reOrderLevel')}
                    value={values.reOrderLevel}
                    onBlur={handleBlur('reOrderLevel')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.re_order_level_placeholder')}
                    keyboardType="numeric"
                    errorMessage={errors.reOrderLevel ? t(`itemValidations.${errors.reOrderLevel}`) : ''}
                  />

                  <FieldText
                    title={t('item.quantity')}
                    onChangeText={handleChange('quantity')}
                    value={values.quantity}
                    onBlur={handleBlur('quantity')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.quantity_placeholder')}
                    keyboardType="numeric"
                    errorMessage={errors.quantity ? t(`itemValidations.${errors.quantity}`) : ''}
                  />

                  <FieldText
                    title={t('item.unit_cost_price')}
                    onChangeText={handleChange('unitPrice')}
                    value={values.unitPrice}
                    onBlur={handleBlur('unitPrice')}
                    underlineColorAndroid="transparent"
                    placeholder={t('item.unit_cost_price_placeholder')}
                    keyboardType="numeric"
                    errorMessage={errors.unitPrice ? t(`itemValidations.${errors.unitPrice}`) : ''}
                  />
                </>
              )}

              <FieldText
                title={t('item.unit_sale_price')}
                onChangeText={handleChange('salePrice')}
                value={values.salePrice}
                onBlur={handleBlur('salePrice')}
                underlineColorAndroid="transparent"
                placeholder={t('item.unit_sale_price_placeholder')}
                keyboardType="numeric"
                errorMessage={errors.salePrice ? t(`itemValidations.${errors.salePrice}`) : ''}
              />

              <View style={styles.buttonContainer}>
                <ButtonFilled
                  onPress={() => navigation.goBack()}
                  color={'#f59e0b'}
                  labelColor={theme.text}
                >
                  {t('common.cancel')}
                </ButtonFilled>
                <ButtonFilled
                  onPress={handleSubmit}
                  color={theme.primary}
                  labelColor={theme.text}
                >
                  {t('common.save')}
                </ButtonFilled>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default CreateItemScreen;
