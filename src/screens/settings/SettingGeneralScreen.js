import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ItemInventory from '../../models/ItemInventory';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { TextInput } from 'react-native';
import { onAuthStateChanged } from '@firebase/auth';
import { auth, storage } from '../../../firebase';
import { ThemeContext } from '../../../App';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
  uploadBytes,
} from 'firebase/storage';

export default function GeneralSettingsScreen() {
  const { logout } = useContext(AuthContext);
  const [settings, setSettings] = useState(generalSettings);
  const [text, setText] = useState('');
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ['38%', '48%'];
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);

  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Theme task

        theme;
      });
    }, [])
  );

  useEffect(() => {
    // setting up the header
    navigation.setOptions({
      headerTitle: `${t('screens.settings')}`,
      headerTitleAlign: 'center',
      headerTintColor: theme.text,
      headerStyle: { backgroundColor: theme.accent },
      headerLeft: () => (
        <TouchableOpacity style={{ paddingLeft: 10 }}>
          <AntDesign
            name="caretright"
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
  }, [theme]);

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
        const storageRef = ref(storage, `backups/dukapp001.db`);
        console.log(FileSystem.documentDirectory + 'SQLite/dukApp001.db');
        // const db = new Blob(
        //   [JSON.stringify(FileSystem.documentDirectory + 'SQLite/dukApp001.db')],
        //   { type: 'application/octet-stream' }
        // );
        await FileSystem.copyAsync({
          from: FileSystem.documentDirectory + 'SQLite/dukApp001.db',
          to: FileSystem.cacheDirectory + 'dukapp001.db',
        });
        console.log(FileSystem.cacheDirectory + 'dukapp001.db');
        const fileBlob = await FileSystem.readAsStringAsync(
          FileSystem.cacheDirectory + 'dukapp001.db',
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        // console.log(fileBlob);
        // uploadBytes(storageRef, fileBlob, {
        //   contentType: 'application/octet-stream',
        // })
        //   .then((snapshot) => {
        //     console.log(snapshot);
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log('Upload is ' + progress + '% done');
        //     switch (snapshot.state) {
        //       case 'paused':
        //         console.log('Upload is paused');
        //         break;
        //       case 'running':
        //         console.log('Upload is running');
        //         break;
        //     }
        //   })
        //   .catch((err) => console.log(err));
        uploadString(storageRef, fileBlob, 'base64', {
          contentType: 'application/octet-stream',
        })
          .then((snapshot) => {
            console.log(snapshot);
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          })
          .catch((err) => console.log(err));

        // const uploadTask = uploadBytesResumable(storageRef, fileBlob, {
        //   contentType: 'application/octet-stream',
        // });

        // uploadTask.on('state_changed', (snapshot) => {
        //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //   console.log('Upload is ' + progress + '% done');
        //   switch (snapshot.state) {
        //     case 'paused':
        //       console.log('Upload is paused');
        //       break;
        //     case 'running':
        //       console.log('Upload is running');
        //       break;
        //   }
        // });
        // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //   console.log('File available at', downloadURL);
        // });
        // storage.app.
        // .ref('backup')
        // .child('backups/')
        // .pu(FileSystem.documentDirectory + 'SQLite/dukApp001.db')
        // .then((snapshot) => {
        //   console.log('Uploaded a blob or file!');
        // })
        // .catch((error) => {
        //   console.log(error);
        // });
        // BackupService.backupEntireApp();
        // ToastAndroid.show(t('setting.application_backup_is_done'), ToastAndroid.SHORT);

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
                {t(`${item.title}`)}
              </Text>

              {
                /** Display Description if available */
                item.description ? (
                  <Text style={[styles.description, { color: theme.text, opacity: 0.7 }]}>
                    {t(`${item.description}`)}
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
            backgroundColor: theme.accent,
            padding: 10,
            elevation: 5,
            borderTopColor: theme.colorIcon,
            borderTopWidth: 1,
          }}
          handleIndicatorStyle={{ backgroundColor: theme.colorIcon }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Text style={{ color: theme.text, opacity: 0.7, fontSize: 14 }}>
              Give us A feedback on how to improve
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => console.log('thank you')}>
              <Ionicons name="send" size={20} color={theme.primary} />
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
