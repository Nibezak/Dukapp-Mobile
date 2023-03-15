import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ToastAndroid, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import { AuthContext } from '../../context/AuthProvider';
import Item from '../../models/Item';
import Customer from '../../models/Customer';
import Supplier from '../../models/Supplier';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generalSettings } from './settings';
import BackupService from '../../services/BackupService';
import { useNavigation } from '@react-navigation/native';
import ItemInventory from '../../models/ItemInventory';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { TextInput } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../../../firebase';
import { ThemeContext } from '../../../App';
import { StatusBar } from 'expo-status-bar';

export default function GeneralSettingsScreen() {
  const { logout } = useContext(AuthContext);
  const [settings, setSettings] = useState(generalSettings);
  const [text, setText] = useState('');
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ['38%', '48%'];
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);

  const navigation = useNavigation();

  useEffect(() => {
    tracker();
    // setting up the header
    navigation.setOptions({
      headerTitle: 'Settings',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: theme.text,
      },
      headerStyle: {
        backgroundColor: theme.accent,
      },
      headerLeft: () => (
        <TouchableOpacity style={{ paddingLeft: 10 }}>
          <AntDesign
            name="menuunfold"
            size={24}
            color={theme.primary}
            onPress={() => navigation.openDrawer()}
          />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons
              name="message-processing-outline"
              size={24}
              color={theme.primary}
              onPress={handleFeedback}
              style={{ paddingRight: 10, marginTop: 5 }}
            />
          </View>
        </>
      ),
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  });

  /**
   * Get General Settings
   */
  async function getSettings() {
    AsyncStorage.getItem('@settings')
      .then(setSettings)
      .catch((error) => {
        throw error;
      });
  }

  // track screen on google analytics
  async function tracker() {
    Analytics.setUserId(user.email);
    Analytics.logEvent('users', {
      user: user.email,
      screen: 'screens',
      navigation: 'Settings Screen',
    });
  }

  function handleFeedback() {
    bottomSheetModalRef.current?.present();
  }

  /**
   * Reset DB
   */
  async function handleDatabaseReset() {
    // 1. Drop all tables
    Customer.reset();
    Item.reset();
    Order.reset();
    OrderItem.reset();
    Supplier.reset();
    ItemInventory.reset();

    ToastAndroid.show(t('setting.database_has_been_reset'), ToastAndroid.SHORT);
  }

  /**
   * Handle the actions method
   */
  async function handleAction(methodName) {
    switch (methodName.toLowerCase()) {
      case 'handledatabasereset':
        handleDatabaseReset();
        break;
      case 'backup_application':
        BackupService.backupEntireApp();
        ToastAndroid.show(t('setting.application_backup_is_done'), ToastAndroid.SHORT);

        break;
      case 'logout':
        logout();
        break;
      default:
        console.log('Unable to find method associated with ' + methodName);
        break;
    }
  }

  /**
   * Render Customers in a list
   */
  function renderItem({ item }) {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            item.action
              ? handleAction(item.action)
              : navigation.navigate('Setting Options', { setting: item })
          }
        >
          <View style={[styles.row]}>
            <MaterialIcons
              name={item.icon ? item.icon : 'settings'}
              size={24}
              color={item.color ? item?.color : theme.text}
              style={styles.avatar}
            />
            <View style={styles.rowText}>
              <Text style={[styles.title, { color: item.color ? item?.color : theme.text }]}>
                {item.title}
              </Text>

              {
                /** Display Description if available */
                item.description ? (
                  <Text style={[styles.description, { color: theme.text, opacity: 0.7 }]}>
                    {item.description}
                  </Text>
                ) : (
                  <></>
                )
              }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusbar} />
      <FlatList
        data={settings}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{
            backgroundColor: '#F4F4F5',
            padding: 10,
            elevation: 5,
            borderTopColor: '#D4D4D8',
            borderTopWidth: 1,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Text style={{ color: 'gray', fontSize: 14 }}>
              Give us A feedback on how to improve
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => console.log('thank you')}>
              <Ionicons name="send" size={20} color="#47a67f" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              onChangeText={(text) => setText(text)}
              value={text}
            />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rowText: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
  input: {
    height: '40%',
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
