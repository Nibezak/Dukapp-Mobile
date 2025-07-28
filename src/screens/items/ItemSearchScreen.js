import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import ItemService from '../../services/ItemService';
import RenderItem from './RenderItem';
import { ThemeContext } from '../../../App';
import { SafeAreaView } from 'react-native';

const AVATAR = 'https://cdn4.vectorstock.com/i/1000x1000/16/38/add-item-icon-vector-16301638.jpg';

export default function ItemSearchScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [itemsBuffer, setItemsBuffer] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        refreshItems();
      });
      return () => task.cancel(); // Clean up on unmount
    }, [])
  );

  useEffect(() => {
    refreshItems();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text.trim());

    if (itemsBuffer.length === 0) {
      setItemsBuffer(items);
    }

    const filteredItems = itemsBuffer.filter((item) =>
      item.name.toLowerCase().startsWith(text.trim().toLowerCase())
    );

    setItems(filteredItems);
  };

  const refreshItems = async () => {
    try {
      const itemsFromDB = await ItemService.getItems();
      const updatedItems = [
        {
          id: 'add',
          name: t('item.new_item'),
          description: t('item.new_item'),
          category: 'add_new',
          reorder_level: 0,
          quantity: 0,
          cost_price: 0,
          sale_price: 0,
          is_service: 0,
        },
        ...itemsFromDB,
      ];
      setItems(updatedItems);
      setItemsBuffer(updatedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <RenderItem
        item={item}
        key={item.id}
        onPress={() =>
          navigation.navigate(`Edit Item`, {
            item: item,
          })
        }
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { borderColor: theme.colorIcon }]}
            value={searchTerm}
            onChangeText={handleSearch}
            placeholder={t('common.search_placeholder')}
            placeholderTextColor={theme.textSecondary}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchTerm('');
              handleSearch('');
            }}
          >
            <MaterialIcons name="delete-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={styles.itemList}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        maxToRenderPerBatch={6}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop: 30,
    backgroundColor: '#ffffff', // White background for professionalism
  },
  backButton: {
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f9f9f9',
    marginLeft: 10,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 0,
  },
  clearButton: {
    padding: 10,
  },
  itemList: {
    marginTop: 2,
  },
});
