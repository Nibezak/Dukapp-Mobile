import AxiosConfig from '../helpers/axiosConfig';
import firebase from 'firebase/app';
import 'firebase/firestore';
/**
 Upload local store to the server
 *
 * @param {string} dataType to identify upload type
 * @param {json} payload to upload
 * @returns promise
 */
export async function uploadData(dataType, payload) {
  return AxiosConfig.post('backup/' + dataType, payload)
    .then((response) => {
      console.log(response)
      return response;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

/**
 * Real Time backup
 * @param {string} queryString
 * @param {array} parameters
 * @returns
 */
// export async function realTimeBackup(queryString, parameters) {
//   return AxiosConfig.post('/backup-realtime', {
//     query: queryString,
//     parameters: parameters,
//   })
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(queryString, parameters);
//       console.warn(error.message);
//     });
// }


export async function realTimeBackup(queryString, parameters) {
  // Initialize Firestore
  const firestore = firebase.firestore();

  // Get the currently authenticated user
  const user = firebase.auth().currentUser;
  if (!user) {
    console.warn("No authenticated user found");
    return;
  }

  // Add the data to the authenticated user's collection
  try {
    await firestore.collection("users").doc(user.uid).collection("backup").add({
      query: queryString,
      parameters: parameters
    });
    console.log("Data added to Firestore collection successfully");
  } catch (error) {
    console.warn("Error adding data to Firestore collection: ", error);
  }
}
