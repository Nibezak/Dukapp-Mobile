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

