import axiosConfig from "../helpers/axiosConfig";

/**
 * Send SMS verification Request
 *
 * @param {string} phoneNumber
 * @returns
 */
export async function sendOTP(phoneNumber) {
  try {
    return axiosConfig.get("/sendOTP?mobile_number=" + phoneNumber);
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
    return axiosConfig.get(
      "/verifyOTP?mobile_number=" + phoneNumber + "&otp=" + code
    );
  } catch (error) {
    console.error(error);
    return error;
  }
}
