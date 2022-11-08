import {
  initializeApp,
  getApp,
  FirebaseOptions,
  FirebaseApp,
} from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOKMLbEL3dhbGUWMcghznnInY7yjpge-s",

  authDomain: "sdxcrypto-algovera.firebaseapp.com",

  projectId: "sdxcrypto-algovera",

  storageBucket: "sdxcrypto-algovera.appspot.com",

  messagingSenderId: "620009842012",

  appId: "1:620009842012:web:fe419cfeca2434e16a0d99",

  measurementId: "G-BEQNC17HKX",
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
