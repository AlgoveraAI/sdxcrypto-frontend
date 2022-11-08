import { useRef } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import Pricing from "../components/pricing";

const Home: NextPage = () => {
  const howitworksRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Nav howitworksRef={howitworksRef} />
      <Hero />
      <HowItWorks howitworksRef={howitworksRef} />
      <Pricing />
    </div>
  );
};

export default Home;
