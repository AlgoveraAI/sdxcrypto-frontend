import Nav from "../components/nav";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import Pricing from "../components/pricing";
import CreditsModal from "../components/credits-modal";

export default function Home() {
  return (
    <div>
      <CreditsModal />
      <Nav />
      <Hero />
      <HowItWorks />
      <Pricing />
    </div>
  );
}
