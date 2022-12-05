import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Select from "../../components/workflows/image-generation/select";
import Generate from "../../components/workflows/image-generation/generate";
import Mint from "../../components/workflows/image-generation/mint";
import { PageProps } from "../../lib/types";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { firebaseApp, auth } from "../../lib/firebase";

const steps = [
  { id: "1", name: "Setup", href: "#" },
  { id: "2", name: "Generate", href: "#" },
  { id: "3", name: "Mint", href: "#" },
];

const GeneratePage: NextPage<PageProps> = ({ user }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // store params and details for each step here
  // so that we can pass them to the next step and store them
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([
    // "https://firebasestorage.googleapis.com/v0/b/sdxcrypto-algovera.appspot.com/o/0xfdad2c16a5c3551856337ca415455562683e78f6c487c8046c89e350e4435828%2Fimages%2Fd9516feba65540eb9fcb8b10d0fa28f0%2Fd9516feba65540eb9fcb8b10d0fa28f0.jpg?alt=media&token=6fcb1c0d-67fa-42a5-b04f-8313ff7c8245",
  ]);


  useEffect(() => {
    if (jobId){
      console.log('getting images for jobId', jobId)
      const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `${user.uid}/images/${jobId}`);
        listAll(storageRef)
          .then((res) => {
            // get img urls
            const imgUrls = res.items.map((itemRef) => {
              // get public url
              return getDownloadURL(itemRef);
            });
            // await requests
            Promise.all(imgUrls).then((urls) => {
              console.log("got img urls", urls);
              setImages(urls);
            });
          })
          .catch((err) => {
            // firebase error
            console.log("error getting images", err);
          });
    }
  }, [jobId]);

  useEffect(() => {
    // switch to step 2 (Generate) when a model is selected
    if (selectedModal) {
      setCurrentStepIdx(1);
    }
  }, [selectedModal]);

  return (
    <div className="max-w-7xl mx-auto md:px-24 px-6">
      <nav aria-label="Progress">
        <ol
          role="list"
          className="bg-black/[0.3] mt-12 divide-y rounded-md md:flex md:divide-y-0"
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

      <div className="mt-12">
        {currentStepIdx === 0 ? (
          <Select
            selectedModal={selectedModal}
            setSelectedModal={setSelectedModal}
          />
        ) : currentStepIdx === 1 ? (
          <Generate
            user={user}
            selectedModal={selectedModal}
            setJobId={setJobId}
            prompt={prompt}
            setPrompt={setPrompt}
            images={images}
          />
        ) : (
          <Mint
            user={user}
            selectedModal={selectedModal}
            jobId={jobId}
            prompt={prompt}
            images={images}
          />
        )}
      </div>
    </div>
  );
};

export default GeneratePage;
