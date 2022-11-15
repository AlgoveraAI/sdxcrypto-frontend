import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Select from "../components/generate/select";
import Generate from "../components/generate/generate";
import Mint from "../components/generate/mint";
import CreditsModal from "../components/credits-modal";
import { PageProps } from "../lib/types";

import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { firebaseApp, auth } from "../lib/firebase";

const steps = [
  { id: "1", name: "Setup", href: "#" },
  { id: "2", name: "Generate", href: "#" },
  { id: "3", name: "Mint", href: "#" },
];

const GeneratePage: NextPage<PageProps> = ({
  user,
  creditsModalTrigger,
  setCreditsModalTrigger,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // store params and details for each step here
  // so that we can pass them to the next step and store them
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [jobStatus, setJobStatus] = useState("");
  const [jobStatusInterval, setJobStatusInterval] = useState<NodeJS.Timeout>();

  const checkJobStatus = async (jobId: string) => {
    // check the status of a job
    console.log("fetching status", user.uid, jobId);
    const res = await fetch("/api/status", {
      method: "POST",
      body: JSON.stringify({
        job_uuid: jobId,
      }),
    });
    // parse the json
    const data = await res.json();
    console.log("job status:", data);
    if (res.status === 200 && data.job_status) {
      // set job status
      setJobStatus(data.job_status);
      if (data.job_status === "done") {
        // make call to firebase storage to get all images under job
        console.log("getting images for jobId", jobId);
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
    } else {
      // log the error and set job status to error
      // to clear the interval
      console.error("error getting job status", res);
      setJobStatus("error");
    }
  };

  useEffect(() => {
    if (jobId && user.uid) {
      // check job status on interval
      console.log("setting jobStatus interval");
      // reset state here in case it's already done or error
      // so that the clear interval effect triggers
      setJobStatus("pending");
      // checkJobStatus(jobId);
      const interval = setInterval(() => {
        checkJobStatus(jobId);
      }, 2000);
      setJobStatusInterval(interval);
    }
  }, [jobId, user.uid]);

  useEffect(() => {
    // if job is done, clear interval
    if (jobStatus === "done" || jobStatus === "error") {
      console.log("clearing jobStatus interval:", jobStatus);
      clearInterval(jobStatusInterval);
    }
  }, [jobStatus]);

  useEffect(() => {
    // switch to step 2 (Generate) when a model is selected
    if (selectedModal) {
      setCurrentStepIdx(1);
    }
  }, [selectedModal]);

  return (
    <div>
      {user.credits !== null ? (
        <CreditsModal
          creditsModalTrigger={creditsModalTrigger}
          setCreditsModalTrigger={setCreditsModalTrigger}
          user={user}
        />
      ) : null}
      <Nav user={user} setCreditsModalTrigger={setCreditsModalTrigger} />

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
    </div>
  );
};

export default GeneratePage;
