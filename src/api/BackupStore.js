import AxiosConfig from '../helpers/axiosConfig';
import 'firebase/firestore';
import { auth, db } from '../../firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
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
  try {

    // Get the current user's ID
    const userId = auth.currentUser.uid
    const database = doc(db, "users", userId);
    await updateDoc(database, {
      database: arrayUnion({
        queryString,
        parameters
      })
    });
    console.log(`${userId}'s database has been backedup`);
    console.log(queryString, parameters)

  } catch (error) {
    console.error(error);
  }
}
