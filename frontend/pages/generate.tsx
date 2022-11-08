import { useEffect } from "react";
import Nav from "../components/nav";
import Select from "../components/generate/select";
import Generate from "../components/generate/generate";
import Mint from "../components/generate/mint";
import type { NextPage } from "next";

import { useState } from "react";

const Pipeline: NextPage = () => {
  const [stage, setStage] = useState(1);
  const [selectedModal, setSelectedModal] = useState("");
  const [imgUrl, setImgUrl] = useState(
    "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  );

  // on setSelectedModal, switch stage to Generate
  useEffect(() => {
    if (selectedModal) {
      setStage(2);
    }
  }, [selectedModal]);

  return (
    <div>
      <Nav />

      {/* <h2 className="mt-12 text-3xl font-bold text-center">Generate</h2> */}
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

      <div className="mt-12 mx-24 p-4">
        {stage === 1 ? (
          <Select
            selectedModal={selectedModal}
            setSelectedModal={setSelectedModal}
          />
        ) : stage === 2 ? (
          <Generate
            selectedModal={selectedModal}
            imgUrl={imgUrl}
            setImgUrl={setImgUrl}
          />
        ) : (
          <Mint />
        )}
      </div>
    </div>
  );
};

export default Pipeline;
