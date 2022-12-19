import { useRef, useState } from "react";
import type { NextPage } from "next";
import Footer from "../components/footer";
import Hero from "../components/index/hero";
import HowItWorks from "../components/index/how-it-works";
import DeveloperInfo from "../components/index/developer-info";
import { PageProps } from "../lib/types";

const Home: NextPage<PageProps> = ({}) => {
  const howitworksRef = useRef<HTMLDivElement>(null);
  const developerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Hero developerRef={developerRef} />
      <HowItWorks howitworksRef={howitworksRef} />
      <DeveloperInfo developerRef={developerRef} />
      <Footer />
    </div>
  );
};

export default Home;
