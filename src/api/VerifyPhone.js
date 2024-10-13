import axiosConfig from '../helpers/axiosConfig';

/**
 * Send SMS verification Request
 *
 * @param {string} phoneNumber
 * @returns
 */
export async function sendOTP(phoneNumber) {
  try {
    // return axiosConfig.get('authentication/' + phoneNumber + '/send-otp');
    return 'sendotp';

  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
 * Verify OTP
 *
 * @param {string} phoneNumber
 * @param {code} code
 * @returns
 */
export async function verifyOTP(phoneNumber, code) {
  try {
    // return axiosConfig.get('authentication/' + phoneNumber + '/verify/' + code);
    return '0000';

  } catch (error) {
    console.error(error);
    return error;
  }
}
