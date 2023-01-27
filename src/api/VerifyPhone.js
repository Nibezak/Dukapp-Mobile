import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase";
import axiosConfig from "../helpers/axiosConfig";
import { useNavigation } from "@react-navigation/core";

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
export async function verifyUser(email, password) {
  const navigation = useNavigation();
  try {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        navigation.navigate('HomeScreen')

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  } catch (error) {
    console.error(error);
    return error;
  }
}