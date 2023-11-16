import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDmjrbDrgOQ8XqAoEpv8T16p0vsLupqzLg",
  authDomain: "ethz-order-app.firebaseapp.com",
  projectId: "ethz-order-app",
  storageBucket: "ethz-order-app.appspot.com",
  messagingSenderId: "461360466143",
  appId: "1:461360466143:web:43e3f6e80df225cdafc16a",
};

const firebase = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(firebase);
const functions = getFunctions(firebase, "europe-west1");
const db = getFirestore(firebase);

export { auth, db, functions };
export default firebase;
