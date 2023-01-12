import React, { useEffect, useState, useContext } from "react";
import type { NextPage } from "next";
import Link from "next/link";

import { PageProps } from "../../lib/types";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import BgCircles from "../../components/bg-circles";

import GenerateImage from "../../components/workflows/blocks/generate-image";
import MintImage from "../../components/workflows/blocks/mint-image";
import SummarizeText from "../../components/workflows/blocks/summarize-text";

import {
  AppContext,
  AppContextType,
  JobContext,
  JobContextType,
} from "../../lib/contexts";

const C: NextPage<PageProps> = ({}) => {
  const appContext = useContext(AppContext) as AppContextType;

  // set up the job context
  // these values are used between different components
  // that need to access the same state (e.g. job id, job status, etc.)
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any | null>(null);
  const [jobOutput, setJobOutput] = useState<any | null>(null);
  const jobContext = {
    id: jobId,
    setId: setJobId,
    status: jobStatus,
    setStatus: setJobStatus,
    data: jobData,
    setData: setJobData,
    output: jobOutput,
    setOutput: setJobOutput,
  };

  // define which step of the workflow the user is on
  // (e.g. 0 = select, 1 = generate, 2 = mint)
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // store the name of the workflow (indicated by the url)
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowConfig, setWorkflowConfig] = useState<any | null>(null);

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

  return (
    <JobContext.Provider value={jobContext}>
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
                      config={
                        workflowId === "dalle-image-gen"
                          ? appContext.blockConfigs["image_generation_dalle"]
                          : appContext.blockConfigs[
                              "image_generation_stable_diffusion"
                            ]
                      }
                    />
                  ) : (
                    <MintImage config={appContext.blockConfigs[2]} />
                  )
                ) : workflowId === "text-summarization" ? (
                  <SummarizeText
                    config={appContext.blockConfigs["text_summarization"]}
                  />
                ) : workflowId === "notion-question-answering" ? (
                  <div></div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </JobContext.Provider>
  );
};

export default C;
