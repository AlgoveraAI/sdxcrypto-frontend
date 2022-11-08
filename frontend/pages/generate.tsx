import { useEffect } from "react";
import Nav from "../components/nav";
import Select from "../components/generate/select";
import Generate from "../components/generate/generate";
import Mint from "../components/generate/mint";
import type { NextPage } from "next";

import { useState } from "react";

const steps = [
  { id: "1", name: "Setup", href: "#" },
  { id: "2", name: "Generate", href: "#" },
  { id: "3", name: "Mint", href: "#" },
];

const Pipeline: NextPage = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // store params and details for each step here
  // so that we can pass them to the next step and store them
  const [selectedModal, setSelectedModal] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    // switch to step 2 (Generate) when a model is selected
    if (selectedModal) {
      setCurrentStepIdx(1);
    }
  }, [selectedModal]);

  return (
    <div>
      <Nav />

      <nav aria-label="Progress">
        <ol
          role="list"
          className="bg-black/[0.3] mt-12 mx-24 divide-y rounded-md md:flex md:divide-y-0"
        >
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className="relative md:flex md:flex-1 cursor-pointer"
              onClick={() => setCurrentStepIdx(stepIdx)}
            >
              {currentStepIdx === stepIdx ? (
                <a
                  className="flex items-center px-6 py-4 text-sm font-medium"
                  aria-current="step"
                >
                  <span className="text-white">{step.id}</span>
                  <span className="ml-4 text-sm font-medium text-white">
                    {step.name}
                  </span>
                </a>
              ) : (
                <a
                  href={step.href}
                  className="flex items-center px-6 py-4 text-sm font-medium"
                  aria-current="step"
                >
                  <span className="text-gray-600">{step.id}</span>
                  <span className="ml-4 text-sm font-medium text-gray-600">
                    {step.name}
                  </span>
                </a>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div
                    className="absolute top-0 right-0 hidden h-full w-5 md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-full w-full text-primary"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 mx-24 p-4">
        {currentStepIdx === 0 ? (
          <Select
            selectedModal={selectedModal}
            setSelectedModal={setSelectedModal}
          />
        ) : currentStepIdx === 1 ? (
          <Generate
            selectedModal={selectedModal}
            imgUrl={imgUrl}
            setImgUrl={setImgUrl}
            prompt={prompt}
            setPrompt={setPrompt}
          />
        ) : (
          <Mint selectedModal={selectedModal} imgUrl={imgUrl} />
        )}
      </div>
    </div>
  );
};

export default Pipeline;
