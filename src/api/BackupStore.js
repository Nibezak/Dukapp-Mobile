import AxiosConfig from '../helpers/axiosConfig';
/**
 Upload local store to the server
 *
 * @param {string} dataType to identify upload type
 * @param {json} payload to upload
 * @returns promise
 */
export async function uploadData(dataType, payload) {
  return AxiosConfig.post('backup/real-time' + dataType, payload)
    .then((response) => {
      console.log(response)
      return response;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

export async function realTimeBackup(queryString, queryParameter) {

  console.log(queryString, queryParameter);

}