import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save in the storage
 */
export async function setSetting(key, value) {
  try {
    return AsyncStorage.setItem("@" + key, value);
  } catch (e) {
    // saving error
    console.log(value);
  }
}

/**
 * Read the storage by key
 */
export async function getSetting(key) {
  try {
    return AsyncStorage.getItem("@" + key);
  } catch (e) {
    // error reading value
    console.log(e);
    throw e;
  }
}
