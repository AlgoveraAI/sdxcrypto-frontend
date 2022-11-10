import "../styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";

// suppress console.log when in production
if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
}

export default function App({ Component, pageProps }: AppProps) {
  const [uid, setUid] = useState("");
  const [credits, setCredits] = useState(0);
  const [creditsModalTrigger, setCreditsModalTrigger] = useState(false);

  return (
    <Component
      {...pageProps}
      uid={uid}
      setUid={setUid}
      credits={credits}
      setCredits={setCredits}
      creditsModalTrigger={creditsModalTrigger}
      setCreditsModalTrigger={setCreditsModalTrigger}
    />
  );
}
