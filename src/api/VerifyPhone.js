import axiosConfig from '../helpers/axiosConfig';

/**
 * Send SMS verification Request
 *
 * @param {string} phoneNumber
 * @returns
 */
export async function sendOTP(phoneNumber) {
  try {
    const response = axiosConfig.post("/sendOTP?mobile_number=" + phoneNumber);
    return response;
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
    const response = axiosConfig.post(
      "/verifyOTP?mobile_number=" + phoneNumber + "&otp=" + code
    );
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}
