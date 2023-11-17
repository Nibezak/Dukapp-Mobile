import React from 'react';
import { View } from 'react-native';
import { money } from '../../helpers/Numbers';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import ButtonFilled from '../../components/ButtonFilled';
import { MaterialCommunityIcons } from '@expo/vector-icons';
/**
 * Render payment section
 */
export default function PurchaseOrderPayment({ order, customer }) {
    const navigation = useNavigation();

    const handleOnPressCustomer = () =>
        navigation.navigate('Search Customer', {
            order: order,
        });

    console.log('PAYMENTS');
    console.log(order.payments);

    const handleOnPressPayment = () =>
        navigation.navigate('Add Payment To Order', {
            order: order,
        });

    return (
        <View style={{ flexDirection: 'row' }}>
            {/* PAYMENT METHOD SECTION */}
            <View style={{ flex: 1 }}>
                <ButtonFilled
                    onPress={handleOnPressPayment}
                    color={order.payments[0].method == 'credit' ? '#facc15' : '#dcfce7'}
                    labelColor={order.payments[0].method == 'credit' ? '#0f172a' : '#14532d'}
                >
                    {order.payments[0].title} {'-'} {money(order.total, order.payments[0].currency)}
                </ButtonFilled>
            </View>
        </View>
    );
}
