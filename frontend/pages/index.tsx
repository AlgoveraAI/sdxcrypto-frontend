import { useRef, useState } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import Pricing from "../components/pricing";

type PageProps = {
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
};

const Home: NextPage<PageProps> = ({ uid, setUid }) => {
  const howitworksRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Nav uid={uid} setUid={setUid} howitworksRef={howitworksRef} />
      <Hero />
      <HowItWorks howitworksRef={howitworksRef} />
      <Pricing />
    </div>
  );
};

export default Home;
