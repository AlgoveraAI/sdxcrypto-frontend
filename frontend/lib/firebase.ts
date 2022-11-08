import {
  initializeApp,
  getApp,
  FirebaseOptions,
  FirebaseApp,
} from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_Q89_1FImvL5B4225qZQEnjwiY1886pM",

  authDomain: "sdxcrypto-4ac0c.firebaseapp.com",

  projectId: "sdxcrypto-4ac0c",

  storageBucket: "sdxcrypto-4ac0c.appspot.com",

  messagingSenderId: "287297395976",

  appId: "1:287297395976:web:9a75e62a009b7aa03360bd",
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
