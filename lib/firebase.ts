import {
  initializeApp,
  getApp,
  FirebaseOptions,
  FirebaseApp,
} from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrGH0zkrS2tlrKdBUARYjlishaTmX1O4I",
  authDomain: "next-moralis.firebaseapp.com",
  projectId: "next-moralis",
  storageBucket: "next-moralis.appspot.com",
  messagingSenderId: "394355479773",
  appId: "1:394355479773:web:1fd52c0c9d2d4e27f6b734",
};

function createFirebaseApp(config: FirebaseOptions): FirebaseApp {
  try {
    return getApp();
  } catch (error) {
    return initializeApp(config);
  }
}

export const firebaseApp = createFirebaseApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
