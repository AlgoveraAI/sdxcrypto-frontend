import "../styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { useUser } from "../lib/hooks";

// suppress console.log when in production
if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
}

export default function App({ Component, pageProps }: AppProps) {
  const [creditsModalTrigger, setCreditsModalTrigger] = useState(false);
  const user = useUser();

  return (
    <Component
      {...pageProps}
      user={user}
      creditsModalTrigger={creditsModalTrigger}
      setCreditsModalTrigger={setCreditsModalTrigger}
    />
  );
}
