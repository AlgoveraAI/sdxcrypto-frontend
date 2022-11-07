import { useRef } from "react";

import Nav from "../components/nav";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import Pricing from "../components/pricing";
import CreditsModal from "../components/credits-modal";

export default function Home() {
  const howitworksRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <CreditsModal />
      <Nav howitworksRef={howitworksRef} />
      <Hero />
      <HowItWorks howitworksRef={howitworksRef} />
      <Pricing />
    </div>
  );
}
