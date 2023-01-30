import React, { useEffect, useCallback, useState, useContext } from 'react';
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
import { Title, ActivityIndicator, Button } from 'react-native-paper';
import RevenueBarChart from '../reports/RevenueBarChart';
import { AntDesign } from '@expo/vector-icons';
import { WelcomeAnimation } from '../../components/WelcomeAnimation';
import { getSetting } from '../../models/AsyncStorage';
import { AuthContext } from '../../context/AuthProvider';
import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from '../../../firebase';
import PropTypes from 'prop-types';
import Database from '../../database/Database';
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
    userDatabase();
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
        <AntDesign name="shoppingcart"
          size={24}
          color="#47a67f"
          onPress={() =>
            navigation.navigate("Purchase Orders", {
              order_type: "purchase",
            })
          }
          style={{ paddingRight: 10 }}
        />
      ),
    });
  }


  // async function userDatabase() {
  //   if (!user) return;
  //   const docRef = doc(db, "users", auth.currentUser.uid);

  //   // Get a document, forcing the SDK to fetch from the offline cache.
  //   try {
  //     const doc = await getDoc(docRef);
  //     const data = doc.data()
  //     // Document was found in the firestore database;
  //     console.log("retrieved document data:", data.queryString);
  //   } catch (e) {
  //     console.log("Error getting cached document:", e);
  //   }
  // }

  const UserData = PropTypes.shape({
    parameters: PropTypes.array,
    queryString: PropTypes.array
  });

  async function userDatabase() {
    if (!user) return;
    const docRef = doc(db, "users", auth.currentUser.uid);

    try {
      const doc = await getDoc(docRef);
      const data = doc.data();

      PropTypes.checkPropTypes(UserData, data, 'data', 'UserData');

      // Save everything back in the database
      data.database.forEach((item) => {
        Database.statement(item.queryString, item.parameters).then(results => {
          console.info("====Restored===== ITEM:" + item.parameters[1])
          console.info(item.queryString);
          console.log(results);
        });
      });

      console.log("retrieved document data:", data.database[0].queryString);
    } catch (e) {
      console.log("Error getting cached document:", e);
    }
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
});
