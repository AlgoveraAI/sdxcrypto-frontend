import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Select from "../../components/workflows/image-generation/select";
import Generate from "../../components/workflows/image-generation/generate";
import Mint from "../../components/workflows/image-generation/mint";
import { PageProps } from "../../lib/types";
import { useUser } from "@auth0/nextjs-auth0/client";

const steps = [
  { id: "1", name: "Select Model", href: "#" },
  { id: "2", name: "Generate Image", href: "#" },
  { id: "3", name: "Mint NFT", href: "#" },
];

const C: NextPage<PageProps> = ({
  uid,
  credits,
  provider,
  networkName,
  signer,
  walletAddress,
  setFeedbackModalTrigger,
}) => {
  // define which step of the workflow the user is on
  // (e.g. 0 = select, 1 = generate, 2 = mint)
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // store the job id
  const [jobId, setJobId] = useState<string | null>(null);

  // store the name of the workflow (indicated by the url)
  const [workflowName, setWorkflowName] = useState<string | null>(null);

  // store params and details for each step here
  // so that we can pass them to the next step and store them
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([
    // TEST img for if API is down
    // "https://firebasestorage.googleapis.com/v0/b/sdxcrypto-algovera.appspot.com/o/0xfdad2c16a5c3551856337ca415455562683e78f6c487c8046c89e350e4435828%2Fimages%2Fd9516feba65540eb9fcb8b10d0fa28f0%2Fd9516feba65540eb9fcb8b10d0fa28f0.jpg?alt=media&token=6fcb1c0d-67fa-42a5-b04f-8313ff7c8245",
  ]);

  const [jobStatus, setJobStatus] = useState("");
  const [jobStatusInterval, setJobStatusInterval] = useState<NodeJS.Timeout>();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    // get the workflow name from the url param 'name'
    const params = new URLSearchParams(window.location.search);
    const workflowName = params.get("name");
    if (workflowName) {
      console.log("workflowName: ", workflowName);
      setWorkflowName(workflowName);
    }
  }, []);

  useEffect(() => {
    // get info about the workflow from the db
    // TODO
    if (workflowName) {
    }
  }, [workflowName]);

  const checkJobStatus = async (jobId: string) => {
    // check the status of a job
    const res = await fetch("/api/checkJobStatus", {
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
        const response = await fetch("/api/getJobResult", {
          method: "POST",
          body: JSON.stringify({
            jobId,
            uid,
            workflow: "txt2img",
          }),
        });
        const { urls } = await response.json();
        setImages(urls);
      }
    } else {
      // log the error and set job status to error
      // to clear the interval
      console.error("error getting job status", res);
      setJobStatus("error");
    }
  };

  useEffect(() => {
    if (jobId && user?.sub) {
      // check job status on interval
      console.log("setting jobStatus interval");
      // reset state here in case it's already done or error
      // so that the clear interval effect triggers
      setJobStatus("pending");
      // checkJobStatus(jobId);
      const interval = setInterval(() => {
        checkJobStatus(jobId);
      }, 1000);
      setJobStatusInterval(interval);
    }
  }, [jobId, user?.sub]);

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
    <div className="max-w-7xl mx-auto md:px-24 px-6">
      <h1 className="text-3xl font-bold text-center mt-12">Image Generation</h1>
      <div className="text-center mt-2">
        <Link
          href="/workflows/outputs"
          className="mx-auto text-center text-sm underline text-gray-400"
        >
          View your outputs
        </Link>
      </div>
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
            credits={credits}
            selectedModal={selectedModal}
            setJobId={setJobId}
            prompt={prompt}
            setPrompt={setPrompt}
            images={images}
            jobStatus={jobStatus}
          />
        ) : (
          <Mint
            provider={provider}
            signer={signer}
            networkName={networkName}
            walletAddress={walletAddress}
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

export default C;