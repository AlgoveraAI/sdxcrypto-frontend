import { useState, useEffect, useContext } from "react";
import { PageProps } from "../../lib/types";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { WorkflowConfigType } from "../../lib/types";
import { AppContext, AppContextType } from "../../lib/contexts";

const { iconUrlPrefix, iconUrlSuffix } = require("../../lib/config");

const C: NextPage<PageProps> = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowConfig, setWorkflowConfig] =
    useState<WorkflowConfigType | null>(null);

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
    <>
      <Link
        href="/workflows"
        className="flex mt-4 ml-4 text-gray-500 hover:text-gray-700"
      >
        <ArrowLeftCircleIcon className="h-6 w-6" />
        <span className="ml-2">View All Workflows</span>
      </Link>
      {workflowId && workflowConfig && appContext ? (
        <div className="mt-12 max-w-5xl mx-auto px-12">
          <>
            <h1 className="text-4xl font-bold mb-12">{workflowConfig.name}</h1>
            <div className="flex bg-white relative min-h-[512px]">
              {/* workflow blocks as centered item */}
              <div className="flex items-center justify-center w-full">
                {workflowConfig.blocks.map((blockId: string, ix: number) => (
                  <>
                    <div key={ix} className="text-black mx-8">
                      <div className="text-center">
                        <div className="relative h-16 w-16 mx-auto">
                          <Image
                            className="mx-auto"
                            src={
                              appContext.blockConfigs[
                                blockId
                              ].dark_icon.startsWith("http")
                                ? appContext.blockConfigs[blockId].dark_icon
                                : iconUrlPrefix +
                                  appContext.blockConfigs[blockId].dark_icon +
                                  iconUrlSuffix
                            }
                            alt={appContext.blockConfigs[blockId].name}
                            fill
                          />
                        </div>

                        <div className="mt-4">
                          <h1 className="text-md font-bold">
                            {appContext.blockConfigs[blockId].name}
                          </h1>
                          <p className="text-sm max-w-[200px]">
                            {appContext.blockConfigs[blockId].desc}
                          </p>
                        </div>
                      </div>
                    </div>
                    {ix !== workflowConfig.blocks.length - 1 ? (
                      <ArrowRightIcon className="h-5 w-5 text-black" />
                    ) : null}
                  </>
                ))}
              </div>

              {/* run button in bottom right */}
              <div className="absolute bottom-0 right-0 m-4">
                <Link
                  className="primary-button font-bold py-2 px-8 rounded"
                  href={`/workflows/run?id=${workflowId}`}
                >
                  <ChevronRightIcon className="h-5 w-5 inline mr-1" />
                  Run
                </Link>
              </div>
            </div>
            <div className="border border-gray-500 rounded-md mt-12 p-5">
              <h1 className="text-2xl font-bold mb-8">Description</h1>
              <p className="text-md">{workflowConfig.long_desc}</p>
            </div>
          </>
        </div>
      ) : null}
    </>
  );
};

export default C;
