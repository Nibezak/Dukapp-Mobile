import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import BackupService from "../../services/BackupService";
import ItemService from "../../services/ItemService";

export default function SettingOPtionsScreen({ navigation, route }) {
  const { setting } = route.params;
  const [isLoading, setIsLoading] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: setting.title,
    });
  }, []);

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
   * Handle the actions method
   */
  async function handleAction(methodName, settingKey) {
    switch (methodName.toLowerCase()) {
      case "handledatabaseseed":
        seedDatabase(settingKey);
        break;
      case "handledatabasereset":
        handleDatabaseReset();
        break;
      case "backup_application":
        BackupService.backupEntireApp();
        ToastAndroid.show(
          t("setting.application_backup_is_done"),
          ToastAndroid.SHORT
        );

        break;
      case "logout":
        logout();
        break;
      default:
        console.log("Unable to find method associated with " + methodName);
        break;
    }
  }
  /**
   * Render Customers in a list
   */
  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() =>
          item.action
            ? handleAction(item.action, item.key)
            : navigation.navigate("Setting Edit", { setting: item })
        }
      >
        <View style={[styles.row]}>
          <View style={styles.rowText}>
            <Text style={[styles.title, { color: item?.color }]}>
              {item.title}
            </Text>
            {
              /** Display Description if available */
              item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : (
                <></>
              )
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <FlatList
      data={setting.options}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
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
    fontWeight: "bold",
    paddingRight: 10,
  },
});
