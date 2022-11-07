import { useRef } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import Pricing from "../components/pricing";
import CreditsModal from "../components/credits-modal";

const Home: NextPage = () => {
  const howitworksRef = useRef<HTMLDivElement>(null);

  const handlePay = async () => {
    const res = await fetch(
      "https://us-central1-next-moralis.cloudfunctions.net/createCharge"
    );
    const data = await res.json();

    window.open(data.hosted_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <CreditsModal />
      <Nav howitworksRef={howitworksRef} />
      <Hero />
      <HowItWorks howitworksRef={howitworksRef} />
      <Pricing />
    </div>
  );
};

export default Home;
