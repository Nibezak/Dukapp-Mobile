import React, { useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { enableScreens } from 'react-native-screens';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthProvider';
import { ThemeContext } from '../../App';

import SearchButton from '../components/SearchButton';
import RightNavSearch from '../components/RightNavSearch';
import SideBar from '../components/SideBar';

import GuestHomeScreen from '../screens/auth/GuestHomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OtpScreen from '../screens/auth/OtpScreen';

import WelcomeScreen from '../screens/home/WelcomeScreen';
import { OnboardingScreen } from '../screens/home/OnboardingScreen';

import OrderScreen from '../screens/orders/OrderScreen';
import ReceiptScreen from '../screens/orders/ReceiptScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import OrderPaymentScreen from '../screens/orders/OrderPaymentScreen';
import SaleReceiptsScreen from '../screens/reports/SaleReceiptsScreen';

import ItemCreateScreen from '../screens/items/ItemCreateScreen';
import ItemEditScreen from '../screens/items/ItemEditScreen';
import ItemListScreen from '../screens/items/ItemListScreen';
import ItemSearchScreen from '../screens/items/ItemSearchScreen';
import LowStockScreen from '../screens/items/LowStockScreen';

import CustomerCreateScreen from '../screens/customers/CustomerCreateScreen';
import CustomerEditScreen from '../screens/customers/CustomerEditScreen';
import CustomerListScreen from '../screens/customers/CustomerListScreen';
import CustomerSearchScreen from '../screens/customers/CustomerSearchScreen';

import SupplierCreateScreen from '../screens/suppliers/SupplierCreateScreen';
import SupplierEditScreen from '../screens/suppliers/SupplierEditScreen';
import SupplierListScreen from '../screens/suppliers/SupplierListScreen';

import SummaryReportScreen from '../screens/reports/SummaryReportScreen';

import SettingGeneralScreen from '../screens/settings/SettingGeneralScreen';
import SettingEditScreen from '../screens/settings/SettingEditScreen';
import SettingOptionsScreen from '../screens/settings/SettingOptionsScreen';

enableScreens();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="GuestHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GuestHome" component={GuestHomeScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Otp" component={OtpScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

function NavDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideBar {...props} />}
      initialRouteName="InitialSettings"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="InitialSettings" component={OnboardingScreen} options={{ title: 'Initial Setting' }} />
      <Drawer.Screen name="home" component={NavStack} options={{ title: 'Home' }} />
      <Drawer.Screen name="Customers" component={CustomerListScreen} options={{ headerShown: true }} />
      <Drawer.Screen name="Suppliers" component={SupplierListScreen} options={{ headerShown: true }} />
      <Drawer.Screen name="Insights" component={SummaryReportScreen} options={{ headerShown: true }} />
      <Drawer.Screen name="Sale Receipt" component={SaleReceiptsScreen} options={{ headerShown: true }} />
    </Drawer.Navigator>
  );
}

function NavTab() {
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
        },
        tabBarActiveTintColor: '#47a67f',
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={WelcomeScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Items List"
        component={ItemListScreen}
        options={{
          title: 'Stock',
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => <FontAwesome name="list-alt" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Order Sale"
        component={OrderScreen}
        options={{
          title: 'Orders',
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={36} color={color} />,
        }}
      />
      <Tab.Screen
        name="Clients"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="General Settings"
        component={SettingGeneralScreen}
        options={{
          title: 'General Settings',
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function NavStack() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="InitialSettings" component={OnboardingScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Welcome" component={NavTab} options={{ headerShown: false, presentation: 'modal' }} />
      {/* Orders */}
      <Stack.Screen name="Orders" component={OrderScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Order Details" component={OrderDetailsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Add Payment To Order" component={OrderPaymentScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Order Receipt" component={ReceiptScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Sale Receipt" component={SaleReceiptsScreen} options={{ presentation: 'card' }} />
      {/* Items */}
      <Stack.Screen name="New Item" component={ItemCreateScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Edit Item" component={ItemEditScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Item Search" component={ItemSearchScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="Items List" component={ItemListScreen} options={{ title: 'Stock', presentation: 'card' }} />
      <Stack.Screen name="Low Stock" component={LowStockScreen} options={{ title: 'Low Stock', presentation: 'card' }} />
      {/* Customers */}
      <Stack.Screen name="New Customer" component={CustomerCreateScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Edit Customer" component={CustomerEditScreen} />
      <Stack.Screen name="Search Customer" component={CustomerSearchScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen
        name="Customers List"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
          headerRight: () => <SearchButton onPress={() => navigation.navigate('Search Customer')} />,
          presentation: 'card',
        }}
      />
      {/* Suppliers */}
      <Stack.Screen name="New Supplier" component={SupplierCreateScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Edit Supplier" component={SupplierEditScreen} />
      <Stack.Screen
        name="Supplier List"
        component={SupplierListScreen}
        options={{
          title: 'Suppliers',
          headerRight: () => <RightNavSearch />,
          presentation: 'card',
        }}
      />
      {/* Reports */}
      <Stack.Screen name="Insights" component={SummaryReportScreen} options={{ presentation: 'card' }} />
      {/* Settings */}
      <Stack.Screen name="General Settings" component={SettingGeneralScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Setting Edit" component={SettingEditScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Setting Options" component={SettingOptionsScreen} options={{ presentation: 'card' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" color={theme.primary} />
  ) : (
    <NavigationContainer>
      {user ? <NavDrawer /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}
