import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import ItemService from "../../services/ItemService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18n-js";
import { MaterialIcons } from "@expo/vector-icons";
import ButikeButton from "../../components/Button";
import { setSetting } from "../../models/AsyncStorage";

export default function SettingEditScreen({ navigation, route }) {
  const setting = route.params.setting;
  const [isLoading, setIsLoading] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: setting.title,
    });

    // Retrieve current setting
    retrieveSetting();
  }, [navigation, setting.title]);

  /**
   *
   * @param {key for setting} itemKey
   * @param {action to take} itemAction
   * @returns
   */
  async function handleActionSetting(settingKey, itemAction) {
    // Seed database based on selected type of seed
    if (itemAction.toLowerCase() === "handledatabaseseed") {
      return seedDatabase(settingKey);
    }
  }

  /**
   * Handle Database Seed
   * @param {string} shopType
   */
  async function seedDatabase(shopType) {
    ItemService.seedItems(shopType)
      .then((result) => {
        setIsLoading(false);
        return result;
      })
      .catch((error) => {
        setIsLoading(false);
        throw error;
      });
  }

  /**
   * Persist setting in DB
   *
   * @param {string} value
   */
  async function updateSetting(value) {
    setSetting(setting.key, value).then((resp) => {
      ToastAndroid.show(t("setting.setting_updated"), ToastAndroid.SHORT);
    });
  }

  async function retrieveSetting() {
    AsyncStorage.getItem("@" + setting.key).then(setCurrentSetting);
  }

  /*
   * Render Customers in a list
   */
  function renderItem({ item }) {
    // Item is not an action
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          updateSetting(item.key);
          setCurrentSetting(item.key);
        }}
      >
        <Text>{item.title}</Text>
        {currentSetting === item.key ? (
          <MaterialIcons
            name={"check"}
            size={24}
            color={"#10b981"}
            style={styles.avatar}
          />
        ) : (
          <></>
        )}
      </TouchableOpacity>
    );
  }

  /** RENDER SETTINGS BASED ON THE TYPE */

  if (setting?.options) {
    return (
      <FlatList
        data={setting.options}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  return (
    <View style={styles.row}>
      <TextInput
        style={{
          borderColor: "gray",
          width: "100%",
          borderWidth: 1,
          borderRadius: 3,
          padding: 10,
          backgroundColor: "#fff",
        }}
        autoFocus={true}
        title={setting.title}
        underlineColorAndroid="transparent"
        value={currentSetting}
        onChangeText={(text) => updateSetting(text)}
      />
    </View>
  );
}

/** */
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    justifyContent: "space-between",
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    paddingRight: 10,
  },
});
