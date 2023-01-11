import React, { useEffect, useState, useContext } from "react";
import type { NextPage } from "next";
import Link from "next/link";

import { PageProps } from "../../lib/types";
import { useUser } from "@auth0/nextjs-auth0/client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import BgCircles from "../../components/bg-circles";

import GenerateImage from "../../components/workflows/blocks/generate-image";
import MintImage from "../../components/workflows/blocks/mint-image";
import SummarizeText from "../../components/workflows/blocks/summarize-text";

import {
  UserContext,
  UserContextType,
  Web3Context,
  Web3ContextType,
} from "../../lib/contexts";

import { WorkflowConfigType } from "../../lib/types";
import { AppContext, AppContextType } from "../../lib/contexts";

const C: NextPage<PageProps> = ({}) => {
  const appContext = useContext(AppContext) as AppContextType;
  const userContext = useContext(UserContext) as UserContextType;
  const web3Context = useContext(Web3Context) as Web3ContextType;

  // define which step of the workflow the user is on
  // (e.g. 0 = select, 1 = generate, 2 = mint)
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // store the job id
  const [jobId, setJobId] = useState<string | null>(null);

  // store the name of the workflow (indicated by the url)
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowConfig, setWorkflowConfig] = useState<any | null>(null);

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
    const workflowId = params.get("id");
    if (workflowId) {
      console.log("workflowId: ", workflowId);
      setWorkflowId(workflowId);
    } else {
      setWorkflowId("Workflow not found");
    }
  }, []);

  useEffect(() => {
    // get info about the workflow from the db
    if (appContext?.workflowConfigs && workflowId) {
      setWorkflowConfig(appContext.workflowConfigs[workflowId]);
    }
  }, [appContext.workflowConfigs, workflowId]);

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
            uid: userContext.uid,
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
    <>
      <BgCircles />

      <div className="relative">
        <Link
          href={`/workflows/view?id=${workflowId}`}
          className="flex mt-4 ml-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftCircleIcon className="h-6 w-6" />
          <span className="ml-2">View Workflow</span>
        </Link>
        <div className="max-w-7xl mx-auto md:px-24 px-6">
          <h1 className="text-3xl font-bold text-center mt-12">
            {workflowConfig?.name}
          </h1>
          {/* <div className="text-center mt-2">
        <Link
          href="/workflows/outputs"
          className="mx-auto text-center text-sm underline text-gray-400"
        >
          View your outputs
        </Link>
      </div> */}
          {Object.keys(appContext.blockConfigs).length && workflowConfig ? (
            <>
              {
                // if the workflow has multiple steps, show the progress bar
                workflowConfig.steps ? (
                  <nav aria-label="Progress">
                    <ol
                      role="list"
                      className="bg-background-darker mt-12 divide-y rounded-md md:flex md:divide-y-0"
                    >
                      {
                        // iterate through the steps, but not the first
                        workflowConfig.steps.map((blockId: any, ix: number) => (
                          <li
                            key={ix}
                            className="relative md:flex md:flex-1 cursor-pointer"
                            onClick={() => setCurrentStepIdx(ix)}
                          >
                            {currentStepIdx === ix ? (
                              <a
                                className="flex items-center px-6 py-4 text-sm font-medium"
                                aria-current="step"
                              >
                                <span className="text-white">{ix + 1}</span>
                                <span className="ml-4 text-sm font-medium text-white">
                                  {appContext.blockConfigs[blockId].name}
                                </span>
                              </a>
                            ) : (
                              <div
                                // href={step.href}
                                className="flex items-center px-6 py-4 text-sm font-medium"
                                aria-current="step"
                              >
                                <span className="text-gray-600">{ix + 1}</span>
                                <span className="ml-4 text-sm font-medium text-gray-600">
                                  {appContext.blockConfigs[blockId].name}
                                </span>
                              </div>
                            )}

                            {ix !== 1 ? (
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
                        ))
                      }
                    </ol>
                  </nav>
                ) : null
              }

              <div className="mt-12">
                {workflowId === "dalle-image-gen" ||
                workflowId === "stable-diffusion-image-gen" ? (
                  currentStepIdx === 0 ? (
                    <GenerateImage
                      credits={userContext.credits}
                      config={
                        workflowId === "dalle-image-gen"
                          ? appContext.blockConfigs["image_generation_dalle"]
                          : appContext.blockConfigs[
                              "image_generation_stable_diffusion"
                            ]
                      }
                      setJobId={setJobId}
                      prompt={prompt}
                      setPrompt={setPrompt}
                      images={images}
                      jobStatus={jobStatus}
                    />
                  ) : (
                    <MintImage
                      provider={web3Context.provider}
                      signer={web3Context.signer}
                      networkName={web3Context.networkName}
                      walletAddress={userContext.walletAddress}
                      config={appContext.blockConfigs[2]}
                      jobId={jobId}
                      prompt={prompt}
                      images={images}
                    />
                  )
                ) : workflowId === "text-summarization" ? (
                  <SummarizeText
                    credits={userContext.credits}
                    config={appContext.blockConfigs["text_summarization"]}
                    setJobId={setJobId}
                    jobStatus={jobStatus}
                  />
                ) : workflowId === "notion-question-answering" ? (
                  <div></div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default C;
