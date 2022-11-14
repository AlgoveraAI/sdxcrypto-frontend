import "../styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { useMoralisAuth } from "../lib/hooks";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

// suppress console.log when in production
if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
}

export default function App({ Component, pageProps }: AppProps) {
  const [uid, setUid] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsModalTrigger, setCreditsModalTrigger] = useState(false);
  const [pollCredits, setPollCredits] = useState(false);
  const moralisAuth = useMoralisAuth();

  useEffect(() => {
    // triggers when user logs in or out
    console.log("checking auth");
    if (moralisAuth) {
      if (moralisAuth.auth.currentUser) {
        console.log("connected user uid:", moralisAuth.auth.currentUser.uid);
        console.log(
          "connected user wallet:",
          moralisAuth.auth.currentUser.displayName
        );
        setUid(moralisAuth.auth.currentUser.uid);
        setPollCredits(true);
      } else {
        console.log("no connected user");
        setUid("");
        setCredits(null);
      }
    }
  }, [moralisAuth, moralisAuth?.auth.currentUser, setUid]);

  // set app to poll database to update credits once signed in

  useEffect(() => {
    // poll credits every 10 seconds
    if (pollCredits) {
      // check credits first, then set up the interval
      // otherwise there's a delay before the first check
      checkCredits();
      const interval = setInterval(async () => {
        checkCredits();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [pollCredits, moralisAuth, setCredits]);

  const checkCredits = async () => {
    if (moralisAuth?.auth.currentUser) {
      const docRef = doc(db, "users", moralisAuth.auth.currentUser.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setCredits(docSnap.data().credits);
        } else {
          console.log("User not in firestore db", moralisAuth.auth.currentUser);
        }
      });
    }
  };

  return (
    <Component
      {...pageProps}
      uid={uid}
      setUid={setUid}
      credits={credits}
      moralisAuth={moralisAuth}
      creditsModalTrigger={creditsModalTrigger}
      setCreditsModalTrigger={setCreditsModalTrigger}
    />
  );
}
