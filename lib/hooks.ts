import {
  getMoralisAuth,
  MoralisAuth,
} from "@moralisweb3/client-firebase-auth-utils";
import { firebaseApp, auth } from "./firebase";
import { Auth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const useMoralisAuth = () => {
  const [user] = useAuthState(auth);
  const [moralisAuth, setMoralisAuth] = useState<MoralisAuth | null>(null);

  useEffect(() => {
    setMoralisAuth(getMoralisAuth(firebaseApp));
  }, []);
  return moralisAuth;
};
