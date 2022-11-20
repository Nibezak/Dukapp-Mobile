
import * as SecureStore from 'expo-secure-store';


/**
 * Store an Item in the secured store
 */
export async function setI(key, value){
  return SecureStore.setItemAsync(key, value);
}

/**
 * Get an Item from Secured Store
 */
export async function get(key) {
 return  SecureStore.getItemAsync(key);
}
