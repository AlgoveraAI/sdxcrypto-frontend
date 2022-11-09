import "../styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const [uid, setUid] = useState("");
  return <Component {...pageProps} uid={uid} setUid={setUid} />;
}
