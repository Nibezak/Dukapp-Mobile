import React, { useContext, useState, useEffect } from 'react';
import { View, Button, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';

// Providers
import { AuthContext } from '../context/AuthProvider';
import SearchButton from '../components/SearchButton';
import RightNavSearch from '../components/RightNavSearch';

// Auth
import GuestHomeScreen from '../screens/auth/GuestHomeScreen';
import PhoneNumberScreen from '../screens/auth/PhoneNumberScreen';
import OtpScreen from '../screens/auth/OtpScreen';

// Home Screens
import WelcomeScreen from '../screens/home/WelcomeScreen';
import { OnboardingScreen } from '../screens/home/OnboardingScreen';

// Order
import OrderScreen from '../screens/orders/OrderScreen';
import ReceiptScreen from '../screens/orders/ReceiptScreen';
import OrderDetailsSCreen from '../screens/orders/OrderDetailsScreen';
import OrderPaymentScreen from '../screens/orders/OrderPaymentScreen';

// Inventory
import ItemCreateScreen from '../screens/items/ItemCreateScreen';
import ItemEditScreen from '../screens/items/ItemEditScreen';
import ItemListScreen from '../screens/items/ItemListScreen';
import ItemSearchScreen from '../screens/items/ItemSearchScreen';

// Customers Screen
import CustomerCreateScreen from '../screens/customers/CustomerCreateScreen';
import CustomerEditScreen from '../screens/customers/CustomerEditScreen';
import CustomerListScreen from '../screens/customers/CustomerListScreen';
import CustomerSearchScreen from '../screens/customers/CustomerSearchScreen';

// Suppliers Screen
import SupplierCreateScreen from '../screens/suppliers/SupplierCreateScreen';
import SupplierEditScreen from '../screens/suppliers/SupplierEditScreen';
import SupplierListScreen from '../screens/suppliers/SupplierListScreen';

// Report Screen
import SummaryReportScreen from '../screens/reports/SummaryReportScreen';

// Setting Screen
import SettingGeneralScreen from '../screens/settings/SettingGeneralScreen';
import SettingEditScreen from '../screens/settings/SettingEditScreen';
import SettingOptionsScreen from '../screens/settings/SettingOptionsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

import SideBar from '../components/SideBar';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
function AuthStackNavigator() {
  enableScreens();
  return (
    <Stack.Navigator
      initialRouteName="PhoneNumber"
      screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
    >
      <Stack.Screen name="Guest Home" component={GuestHomeScreen} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
    </Stack.Navigator>
  );
}
function NavDrawer() {
  enableScreens();
  const navigation = useNavigation();
  // const [settings, setSettings] = useState([]);
  // const [initialScreen, setInitialScreen] = useState('Welcome');

  // useEffect(() => {
  //   // Fetch settings here
  //   getInitialSettings();
  // }, [settings]);

  /**
   * Fetch settings from the persisted
   * Database store and update the
   * state
   */
  // function getInitialSettings() {
  //   const settingFromDB = [
  //     {
  //       title: 'Business Name',
  //       description: 'Configure official company name',
  //       key: 'business_name',
  //       value: 'Chez John Doe',
  //     },
  //     {
  //       title: 'TIN',
  //       description: 'Tax Identification Number',
  //       key: 'TIN',
  //       value: '10078832',
  //     },
  //     {
  //       title: 'Business Type',
  //       description: 'Saloon, Restorant, Butike..',
  //       key: 'business_type',
  //       value: 'Butike',
  //       type: 'select',
  //       options: [
  //         { key: 'Boutique', title: 'Boutique' },
  //         { key: 'Hair Saloon', title: 'Hair Saloon' },
  //         { key: 'Restaurant', title: 'Restaurant' },
  //         { key: 'Bar', title: 'Bar' },
  //         { key: 'Phone Shop', title: 'Phone Shop' },
  //         { key: 'Car Wash', title: 'Car Wash' },
  //         { key: 'Others', title: 'Others' },
  //       ],
  //     },
  //   ];

  //   setSettings(settingFromDB);
  // }

  /**
   * Make welcome screen dynamic based on whether or not initial
   * settings existing in the database. If settings is empty
   * (we can check any other setting here), then present
   * the screen for the user to input required settings
   * for the application to run smoothly.
   */

  // if (settings != []) {
  //   /**
  //    * For us to reach here, it means there're no settings stored
  //    * in the local database, therefore, give the user option/
  //    * screen to input to the initial database.
  //    */
  //   setInitialScreen('InitialSettings');
  // }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideBar {...props} />}
      initialRouteName="InitialSettings"
      screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
    >
      <Drawer.Screen
        name="InitialSettings"
        component={OnboardingScreen}
        options={{
          title: 'Initial Setting',
        }}
      />

      <Drawer.Screen
        name="home"
        component={NavStack}
        options={{
          title: 'home',
        }}
      />

      <Drawer.Screen
        name="Customers"
        component={CustomerListScreen}
        options={{
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="Suppliers"
        component={SupplierListScreen}
        options={{
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Insights"
        component={SummaryReportScreen}
        options={{
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
}
function NavTab() {
  enableScreens();
  const navigation = useNavigation();

  return (
    <Tab.Navigator initialRouteName="HomeScreen">
      <Tab.Screen
        name="HomeScreen"
        component={WelcomeScreen}
        options={{
          tabBarLabel: '',
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => <Ionicons name="md-home" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Items List"
        component={ItemListScreen}
        options={{
          title: 'Stock Items',
          tabBarLabel: '',
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        onPress={() =>
          navigation.navigate('Orders', {
            order_type: 'sale',
          })
        }
        name="Order Sale"
        component={OrderScreen}
        options={{
          title: 'Orders',
          tabBarLabel: '',
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="md-add-circle"
              size={36}
              color={color}
              onPress={() =>
                navigation.navigate('Orders', {
                  order_type: 'sale',
                })
              }
            />
          ),
        }}
      />

      {/* <Tab.Screen name="Order Details" component={OrderDetailsSCreen} />  */}

      <Tab.Screen
        name="Clients"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
          tabBarLabel: '',
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="General Settings"
        component={SettingGeneralScreen}
        options={{
          title: 'General Settings',
          tabBarLabel: '',
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function NavStack() {
  enableScreens();
  const navigation = useNavigation();

  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="InitialSettings" component={OnboardingScreen}

      />
      <Stack.Screen name="Welcome" component={NavTab} options={{ headerShown: false }} />
      {/** Orders*/}
      <Stack.Screen name="Orders" component={OrderScreen} />
      <Stack.Screen name="Order Details" component={OrderDetailsSCreen} />
      <Stack.Screen name="Add Payment To Order" component={OrderPaymentScreen} />
      <Stack.Screen name="Order Receipt" component={ReceiptScreen} />
      {/** Items*/}
      <Stack.Screen
        name="New Item"
        component={ItemCreateScreen}
        options={{
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen name="Edit Item" component={ItemEditScreen} />
      <Stack.Screen
        name="Item Search"
        component={ItemSearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Items List"
        component={ItemListScreen}
        options={{
          title: 'Stock Items',
        }}
      />
      {/** Customer*/}
      <Stack.Screen
        name="New Customer"
        component={CustomerCreateScreen}
        options={{
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen name="Edit Customer" component={CustomerEditScreen} />
      <Stack.Screen
        name="Search Customer"
        options={{ headerShown: false }}
        component={CustomerSearchScreen}
      />
      <Stack.Screen
        name="Customers List"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
          headerRight: () => (
            <SearchButton onPress={() => navigation.navigate('Search Customer')} />
          ),
        }}
      />
      {/** Supplier*/}
      <Stack.Screen
        name="New Supplier"
        component={SupplierCreateScreen}
        options={{
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen name="Edit Supplier" component={SupplierEditScreen} />
      <Stack.Screen
        name="Supplier List"
        component={SupplierListScreen}
        options={{
          title: 'Suppliers',
          headerRight: () => <RightNavSearch />,
        }}
      />
      {/** Reports*/}
      <Stack.Screen name="Insights" component={SummaryReportScreen} />
      {/** Settings*/}
      <Stack.Screen name="General Settings" component={SettingGeneralScreen} />
      <Stack.Screen name="Setting Edit" component={SettingEditScreen} />
      <Stack.Screen name="Setting Options" component={SettingOptionsScreen} />
    </Stack.Navigator>
  );
}

/**
 * App Root Navigation
 */
export default function RootNavigation() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Check if the user is logged in or not
    // Check Secure store for the user object/token
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [user]);

  // Show loading indicator as we wait for the secure storage to
  // be read for use.
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#4a5568" />
      </View>
    );
  }

  // For us to reach here, it means that the secure storage has been successfully
  // loaded, accessible and can be used. If the user exists, we consider the user
  // to have logged in, otherwise the user has to be presented the screen for
  // authentication and be helped to navigate it.
  return (
    <>
      {user ? (
        <>
          <NavigationContainer>
            <NavDrawer />
          </NavigationContainer>
        </>
      ) : (
        <NavigationContainer>
          <AuthStackNavigator />
        </NavigationContainer>
      )}
    </>
  );
}
