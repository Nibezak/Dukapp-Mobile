import React, { useEffect, useCallback, useState, useContext, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  InteractionManager,
} from 'react-native';
import HomeSummary from './HomeSummary';
import { t } from 'i18n-js';
import RenderOrder from '../orders/RenderOrder';
import OrderService from '../../services/OrderService';
import { useFocusEffect } from '@react-navigation/native';
import { Title, ActivityIndicator } from 'react-native-paper';
import RevenueBarChart from '../reports/RevenueBarChart';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { WelcomeAnimation } from '../../components/WelcomeAnimation';
import { getSetting } from '../../models/AsyncStorage';
import { AuthContext } from '../../context/AuthProvider';

import {
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import { Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
/**
 * Screen component
 */
export default function WelcomeScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState('sale');
  const [showLoading, setShowLoading] = useState(true);
  const [currency, setCurrency] = useState('RWF');
  const { user } = useContext(AuthContext);
  const { database, setDatabase } = useState('');
  const [text, setText] = useState('');
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["38%", "48%"];

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshOrders();
      });
    }, [])
  );

  useEffect(() => {
    setHeader();
    retrieveCurrency()
    refreshOrders();
  }, []);

  function setHeader() {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require('./../../../assets/snack-icon.png')}
          style={{ width: 120, height: 100 }}
        />
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <AntDesign
          name="menuunfold"
          size={24}
          color="#47a67f"
          onPress={() => navigation.openDrawer()}
          style={{ paddingLeft: 10 }}
        />
      ),

      headerRight: () => (
        <>
          <View style={{ flexDirection: "row" }}>
            <AntDesign name="shoppingcart"
              size={24}
              color="#47a67f"
              onPress={() =>
                navigation.navigate("Purchase Orders", {
                  order_type: "purchase",
                })
              }
              style={{ paddingRight: 10, marginTop: 5 }}
            />
            <MaterialIcons
              name="feedback"
              size={24}
              color="#47a67f"
              onPress={handleFeedback}
              style={{ paddingRight: 10, paddingTop: 1, marginHorizontal: 10, marginTop: 5 }} />
          </View>
        </>
      ),
    });
  }

  function handleFeedback() {

    bottomSheetModalRef.current?.present()
  }

  // Fetch Orders
  async function refreshOrders() {
    return OrderService.ordersWithItems(setOrders, orderType, null, 8).then(() => setShowLoading(false))
  }
  function retrieveCurrency() {
    getSetting("app_default_currency").then(setCurrency);
  }

  /**
   * Render an order item.
   */
  const renderOrder = useCallback((item) => (
    <RenderOrder
      item={item}
      index={item.id}
      key={item.id}
      onPress={() =>
        navigation.navigate('Edit Item', {
          item: item,
        })
      }
    />
  ));

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  /**
   * Show the activity indicator as long as the items are being fetched.
   * This improves user experience by showing a loader.
   */
  if (showLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ margin: 8 }} size="small" color="gray" />
      </View>
    );
  }

  // If we reach here it means that the list of customers has finished loading
  return (
    <View style={styles.container}>
      {/** Welcome Section of the screen */}

      {orders.length === 0 ? (
        <WelcomeAnimation />
      ) : (
        <>
          <Title style={styles.title}>{t('welcome.today_insights')}</Title>
          <HomeSummary />
          <Title style={styles.sales}>{'Last 7 Days Sales'}</Title>
          <RevenueBarChart />
          <Title style={styles.sales}>{'Recent Sales'}</Title>
          <FlatList
            data={orders.slice(0, 5)}
            renderItem={renderOrder}
            keyExtractor={keyExtractor}
            nestedScrollEnabled
          />
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              backgroundStyle={{ backgroundColor: "#F4F4F5", padding: 10, elevation: 5, borderTopColor: "#D4D4D8", borderTopWidth: 1 }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <Text style={{ color: "gray", fontSize: 14 }}>
                  Give us A feedback on how to improve
                </Text>
                <TouchableOpacity style={styles.button}
                  onPress={async () =>
                    await analytics().logEvent('generalEvent', {
                      item: 'it worked!',
                    })
                  }>
                  <Ionicons name="send" size={20} color="#47a67f" />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                <TextInput
                  style={styles.input}
                  placeholder="What's on your mind?"
                  onChangeText={text => setText(text)}
                  value={text}
                />
              </View>

            </BottomSheetModal>
          </BottomSheetModalProvider>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {},
  title: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#718096',
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  sales: {
    marginTop: 5,
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#718096',
  },
  input: {
    height: "40%",
    width: '80%',
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 10,
    marginHorizontal: 5
  }
});
