// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGNvybWqIYK3ZE3vdQ1czy9daiNnO3qCw",
    authDomain: "dukapp-simplified.firebaseapp.com",
    projectId: "dukapp-simplified",
    storageBucket: "dukapp-simplified.appspot.com",
    messagingSenderId: "712227498789",
    appId: "1:712227498789:web:669c0dd4ca41f6dde408cc",
    measurementId: "G-P3T1PSEVH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const analytics = getAnalytics(app);
// let currentUser = null;
// onAuthStateChanged(auth, (user) => {
//     currentUser = user;
//     console.log(currentUser)
// })
export { auth, db, analytics }