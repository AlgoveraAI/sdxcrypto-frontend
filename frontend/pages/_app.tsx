import "../styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";

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
