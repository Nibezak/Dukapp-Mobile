import React, { useContext, useState, useEffect } from "react";
import { View, Button, ActivityIndicator, Text } from "react-native";
import { NavigationContainer, useNavigation, useRoute } from "@react-navigation/native";

import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";

// Providers
import { AuthContext } from "../context/AuthProvider";
import SearchButton from "../components/SearchButton";
import RightNavSearch from "../components/RightNavSearch";

// Auth
import GuestHomeScreen from "../screens/auth/GuestHomeScreen";
import PhoneNumberScreen from "../screens/auth/PhoneNumberScreen";
import OtpScreen from "../screens/auth/OtpScreen";

// Home Screens
import WelcomeScreen from "../screens/home/WelcomeScreen";

// Order
import OrderScreen from "../screens/orders/OrderScreen";
import ReceiptScreen from "../screens/orders/ReceiptScreen";
import OrderDetailsSCreen from "../screens/orders/OrderDetailsScreen";
import OrderPaymentScreen from "../screens/orders/OrderPaymentScreen";

// Inventory
import ItemCreateScreen from "../screens/items/ItemCreateScreen";
import ItemEditScreen from "../screens/items/ItemEditScreen";
import ItemListScreen from "../screens/items/ItemListScreen";
import ItemSearchScreen from "../screens/items/ItemSearchScreen";

// Customers Screen
import CustomerCreateScreen from "../screens/customers/CustomerCreateScreen";
import CustomerEditScreen from "../screens/customers/CustomerEditScreen";
import CustomerListScreen from "../screens/customers/CustomerListScreen";
import CustomerSearchScreen from "../screens/customers/CustomerSearchScreen";

// Suppliers Screen
import SupplierCreateScreen from "../screens/suppliers/SupplierCreateScreen";
import SupplierEditScreen from "../screens/suppliers/SupplierEditScreen";
import SupplierListScreen from "../screens/suppliers/SupplierListScreen";

// Report Screen
import SummaryReportScreen from "../screens/reports/SummaryReportScreen";

// Setting Screen
import SettingGeneralScreen from "../screens/settings/SettingGeneralScreen";
import SettingEditScreen from "../screens/settings/SettingEditScreen";
import SettingOptionsScreen from "../screens/settings/SettingOptionsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ButtonFilled from "../components/ButtonFilled";
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

  return (

    <Drawer.Navigator initialRouteName="Welcome"
      screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
    >
      <Drawer.Screen name="Home" component={NavStack} options={{
        title: 'Home',
      }} />
      <Drawer.Screen name="Customers" component={CustomerListScreen} options={{
        headerShown: true,
      }} />

      <Drawer.Screen name="Suppliers" component={SupplierListScreen} options={{
        headerShown: true,
      }} />
      <Drawer.Screen name="Insights" component={SummaryReportScreen} options={{
        headerShown: true,
      }} />
    </Drawer.Navigator>

  );
}
function NavTab() {
  enableScreens();
  const navigation = useNavigation();

  return (
    <Tab.Navigator initialRouteName="Welcome">
      <Tab.Screen name="HomeScreen" component={WelcomeScreen} options={{
        tabBarLabel: "",
        tabBarActiveTintColor: 'green',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-home" size={size} color={color} />
        )
      }} />


      <Tab.Screen
        name="Items List"
        component={ItemListScreen}
        options={{
          title: "Stock Items",
          tabBarLabel: "",
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" size={size} color={color} />
          )
        }}

      />

      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={{
          title: "Orders",
          tabBarLabel: "",
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-add-circle" size={36} color={color}
              onPress={() =>
                navigation.navigate("Orders", {
                  order_type: "sale",
                })
              }

            />
          )
        }}


      />



      {/* <Tab.Screen name="Order Details" component={OrderDetailsSCreen} />  */}

      <Tab.Screen
        name="Clients"
        component={CustomerListScreen}
        options={{
          title: "Customers",
          tabBarLabel: "",
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={24} color={color} />
          )
        }}

      />


      <Tab.Screen
        name="General Settings"
        component={SettingGeneralScreen}
        options={{
          title: "General Settings",
          tabBarLabel: "",
          tabBarActiveTintColor: 'green',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          )
        }}

      />


    </Tab.Navigator>
  );
}

function NavStack() {
  enableScreens();
  const navigation = useNavigation();

  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={NavTab} options={{ headerShown: false }} />
      {/** Orders*/}
      <Stack.Screen name="Orders" component={OrderScreen} />
      <Stack.Screen name="Order Details" component={OrderDetailsSCreen} />
      <Stack.Screen
        name="Add Payment To Order"
        component={OrderPaymentScreen}
      />
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
          title: "Stock Items",
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
          title: "Customers",
          headerRight: () => (
            <SearchButton
              onPress={() => navigation.navigate("Search Customer")}
            />
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
          title: "Suppliers",
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#4a5568" />
      </View>
    );
  }

  return (
    <>
      {user ? (
        <>
          <NavigationContainer>
            <NavDrawer />
          </NavigationContainer>


          {/* <NavigationContainer>
            <NavDrawer />
          </NavigationContainer> */}
        </>
      ) : (
        <NavigationContainer>
          <AuthStackNavigator />
        </NavigationContainer>
      )}
    </>
  );
}
