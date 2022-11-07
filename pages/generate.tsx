import Nav from "../components/nav";
import Select from "../components/generate/select";
import Generate from "../components/generate/generate";
import Mint from "../components/generate/mint";

import { useState } from "react";

const STAGES = {
  1: "Select",
  2: "Generate",
  3: "Mint",
};

export default function Pipeline() {
  const [stage, setStage] = useState(1);

  return (
    <div>
      <Nav />

      <h2 className="mt-12 text-3xl font-bold text-center">Generate</h2>
      <div className="mt-24 columns-3 w-full text-center">
        <div
          onClick={() => setStage(1)}
          className={`text-xl ${
            stage === 1
              ? "text-white underline"
              : "text-gray-500 hover:cursor-pointer hover:underline"
          }`}
        >
          1. Select
        </div>
        <div
          onClick={() => setStage(2)}
          className={`text-xl ${
            stage === 2
              ? "text-white underline"
              : "text-gray-500 hover:cursor-pointer hover:underline"
          }`}
        >
          2. Generate
        </div>
        <div
          onClick={() => setStage(3)}
          className={`text-xl ${
            stage === 3
              ? "text-white underline"
              : "text-gray-500 hover:cursor-pointer hover:underline"
          }`}
        >
          3. Mint
        </div>
      </div>

      <div className="mt-12 mx-36 p-4 bg-black/[0.3]">
        {stage === 1 ? <Select /> : stage === 2 ? <Generate /> : <Mint />}
      </div>
    </div>
  );
}
