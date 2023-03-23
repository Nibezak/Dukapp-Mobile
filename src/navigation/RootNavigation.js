import React, { useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

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
import SaleReceiptsScreen from '../screens/reports/SaleReceiptsScreen';
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
import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

import SideBar from '../components/SideBar';
import LowStockScreen from '../screens/items/LowStockScreen';
// import { FastGoingScreen } from '../screens/reports/FastGoingScreen';
// import { ByMobileScreen } from '../screens/reports/ByMobileScreen';
// import { InStockScreen } from '../screens/reports/InStockScreen';
import PurchaseOrderScreen from '../screens/orders/PurchaseOrderScreen';
import PurchaseDetailsScreen from '../screens/orders/PurchaseDetailsScreen';
import { TransactionsScreen } from '../screens/account/TransactionsScreen';
import { ThemeContext } from '../../App';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const OrderType = 'sale';
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
      {/* Sale Receipt */}
      <Drawer.Screen
        name="Sale Receipt "
        component={SaleReceiptsScreen}
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
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.accent,
          borderRadius: 10,
          position: 'absolute',
          borderTopWidth: 0,
          // alignItems: 'center',
          // justifyContent: 'center',
        },
        // tabBarBackground: { backgroundColor: '#000' },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={WelcomeScreen}
        options={{
          tabBarLabel: '',
          tabBarActiveTintColor: '#47a67f',
          tabBarIcon: ({ color, size }) => <Ionicons name="md-home" size={size} color={color} />,
          // tabBarBackground: '#000',
        }}
      />

      <Tab.Screen
        name="Items List"
        component={ItemListScreen}
        options={{
          title: 'Stock Items',
          tabBarLabel: '',
          tabBarActiveTintColor: '#47a67f',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        component={OrderScreen}
        name="Order Sale"
        options={{
          title: 'Orders',
          tabBarLabel: '',
          tabBarActiveTintColor: '#47a67f',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-add-circle" size={36} component={OrderScreen} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Clients"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
          tabBarLabel: '',
          tabBarActiveTintColor: '#47a67f',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="General Settings"
        component={SettingGeneralScreen}
        options={{
          title: 'General Settings',
          tabBarLabel: '',
          tabBarActiveTintColor: '#47a67f',
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
    <Stack.Navigator initialRouteName="Welcome" animationEnabled={true}>
      <Stack.Screen name="InitialSettings" component={OnboardingScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Welcome" component={NavTab} options={{ headerShown: false, presentation: 'modal', }} />
      {/** Orders*/}

      <Stack.Screen name="Orders" component={OrderScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Order Details" component={OrderDetailsSCreen} options={{ presentation: 'modal', }} />
      <Stack.Screen name="Add Payment To Order" component={OrderPaymentScreen} options={{ presentation: 'modal', }} />
      <Stack.Screen name="Order Receipt" component={ReceiptScreen} options={{ presentation: 'modal', }} />
      <Stack.Screen name="Sale Receipt" component={SaleReceiptsScreen} options={{ presentation: 'modal', }} />

      {/** Order Purchase Screen */}
      <Stack.Screen name="Purchase Details" component={PurchaseDetailsScreen} options={{ presentation: 'modal', }} />
      <Stack.Screen
        name="Purchase Orders"
        component={PurchaseOrderScreen}
        options={{ presentation: 'modal' }}
      />
      {/** Items*/}
      <Stack.Screen
        name="New Item"
        component={ItemCreateScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          headerBackTitle: '',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="Edit Item" component={ItemEditScreen} options={{ presentation: 'modal', }} />
      <Stack.Screen
        name="Item Search"
        component={ItemSearchScreen}
        options={{
          headerShown: false,
          headerBackTitle: '',
          presentation: 'modal',
        }}

      />
      <Stack.Screen
        name="Items List"
        component={ItemListScreen}
        options={{
          title: 'Stock Items',
          headerBackTitle: '',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="Low Stock"
        component={LowStockScreen}
        options={{
          title: 'Low Stock',
          headerBackTitle: '',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="In Stock"
        component={SummaryReportScreen}
        options={{
          title: 'In Stock',
          headerBackTitle: '',
          presentation: 'modal'
        }}
      />
      {/** Customer*/}
      <Stack.Screen
        name="New Customer"
        component={CustomerCreateScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          headerBackTitle: '',
          presentation: 'modal'

        }}
      />
      <Stack.Screen name="Edit Customer" component={CustomerEditScreen} />
      <Stack.Screen
        name="Search Customer"
        options={{
          headerShown: false,
          presentation: 'modal'

        }}
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
          presentation: 'modal'
        }}
      />
      {/** Supplier*/}
      <Stack.Screen
        name="New Supplier"
        component={SupplierCreateScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          presentation: 'modal'
        }}
      />
      <Stack.Screen name="Edit Supplier" component={SupplierEditScreen} />
      <Stack.Screen
        name="Supplier List"
        component={SupplierListScreen}
        options={{
          title: 'Suppliers',
          headerRight: () => <RightNavSearch />,
          presentation: 'modal'

        }}
      />
      {/** Reports*/}
      <Stack.Screen name="Insights" component={SummaryReportScreen} options={{ presentation: 'modal' }} />
      {/* <Stack.Screen name="Fast Going" component={FastGoingScreen} options={{
        title: 'Fast Going',
        headerBackTitle: ''
      }} /> */}
      {/* <Stack.Screen name="Stock" component={InStockScreen} options={{
        title: 'In Stock',
        headerBackTitle: ''

      }} /> */}
      {/* <Stack.Screen name="By Mobile" component={ByMobileScreen} options={{
        title: 'By Mobile',
        headerBackTitle: ''
      }} /> */}
      {/** transactions */}
      {/* <Stack.Screen
        name="SMS Transactions"
        component={TransactionsScreen}
        options={{
          title: 'Transactions',
        }}
      /> */}

      {/** Settings*/}

      <Stack.Screen name="General Settings" component={SettingGeneralScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Setting Edit" component={SettingEditScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Setting Options" component={SettingOptionsScreen} options={{ presentation: 'modal' }} />
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
