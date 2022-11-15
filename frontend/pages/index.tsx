import { useRef, useState } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Hero from "../components/index/hero";
import HowItWorks from "../components/index/howitworks";
import Pricing from "../components/index/pricing";
import CreditsModal from "../components/credits-modal";
import { PageProps } from "../lib/types";

const Home: NextPage<PageProps> = ({
  user,
  creditsModalTrigger,
  setCreditsModalTrigger,
}) => {
  const howitworksRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <CreditsModal
        user={user}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
      <Nav user={user} setCreditsModalTrigger={setCreditsModalTrigger} />
      <Hero />
      <HowItWorks howitworksRef={howitworksRef} />
      <Pricing
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
    </div>
  );
};

export default Home;
