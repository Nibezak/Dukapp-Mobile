import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import FloatingButton from '../../components/FloatingButton';
import ItemService from '../../services/ItemService';
import SearchButton from '../../components/SearchButton';
import RenderItem from './RenderItem';
import { t } from 'i18n-js';
import { StockItemAnimation } from '../../components/StockItemAnimation';
import * as Analytics from 'expo-firebase-analytics';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../../../firebase';
import { ThemeContext } from '../../../App';
import { useContext } from 'react';

//const AVATAR =
//'https://cdn4.vectorstock.com/i/1000x1000/16/38/add-item-icon-vector-16301638.jpg';

export default function ItemListScreen({ navigation }) {
  // Set the state
  const [items, setItems] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Expensive task
        refreshItems();
      });
    }, [])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    tracker();
    refreshItems();
  }, []);

  // track screen on google analytics
  async function tracker() {
    Analytics.setUserId(user.email);
    Analytics.logEvent('users', {
      user: user.email,
      screen: 'screens',
      navigation: 'Item Screen',
    });
  }
  /**
   * Refresh Suppliers from DB
   */
  async function refreshItems() {
    //
    ItemService.getItems()
      .then(setItems)
      .then((result) => setShowLoading(false));
    // Set the header with search and settings
    setHeaderRight();
  }

  /**
   * Set Header Right
   */
  function setHeaderRight() {
    navigation.setOptions({
      headerTitle: t('item.items_header'),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: theme.text,
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
        <SearchButton onPress={() => navigation.navigate('Item Search')} color={theme.primary} />
      ),
      headerStyle: {
        backgroundColor: theme.accent,
      },
    });
  }

  const renderItem = useCallback(({ item }) => (
    <RenderItem
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

  const keyExtractor = useCallback((item) => item.id.toString(), []);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            maxToRenderPerBatch={6}
          />
          <FloatingButton onPress={() => navigation.navigate('New Item')} />
        </>
      ) : (
        <StockItemAnimation />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    padding: 20,
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
  details: {
    alignSelf: 'flex-start',
    fontSize: 14,
  },
  names: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
});
