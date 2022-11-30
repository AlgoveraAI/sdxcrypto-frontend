import { useRef, useState } from "react";
import type { NextPage } from "next";
import Footer from "../components/footer";
import Hero from "../components/index/hero";
import HowItWorks from "../components/index/how-it-works";
import DeveloperInfo from "../components/index/developer-info";
import Pricing from "../components/index/pricing";
import { PageProps } from "../lib/types";

const Home: NextPage<PageProps> = ({
  user,
  creditsModalTrigger,
  setCreditsModalTrigger,
  creditCost,
  creatorPassCost,
  creatorCreditsPerMonth,
}) => {
  const howitworksRef = useRef<HTMLDivElement>(null);
  const developerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Hero />
      <HowItWorks howitworksRef={howitworksRef} />
      <Pricing
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
        creditCost={creditCost}
        creatorPassCost={creatorPassCost}
        creatorCreditsPerMonth={creatorCreditsPerMonth}
      />
      <DeveloperInfo ref={developerRef} />
      <Footer />
    </div>
  );
};

export default Home;
