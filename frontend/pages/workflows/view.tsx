import { useState, useEffect } from "react";
import { PageProps } from "../../lib/types";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const { iconUrlPrefix, iconUrlSuffix } = require("../../lib/config");

const C: NextPage<PageProps> = ({ uid }) => {
  // workflowId is one of the keys in WORKFLOWS or null
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
    getWorkflowConfig();
  }, [workflowId]);

  const getWorkflowConfig = async () => {
    if (workflowId) {
      const docRef = doc(db, "workflow_configs", workflowId);
      const docSnap = await getDoc(docRef);
      const workflowConfig = docSnap.data();
      console.log("got workflow config: ", workflowConfig);
      if (!workflowConfig) {
        console.error("workflow config not found");
        return;
      }
      setWorkflowConfig(workflowConfig);
    }
  };

  return (
    <div className="mt-12 max-w-5xl mx-auto px-12">
      {workflowConfig ? (
        <>
          <h1 className="text-4xl font-bold mb-12">{workflowConfig.name}</h1>
          <div className="flex bg-white relative min-h-[512px]">
            {/* workflow blocks as centered item */}
            <div className="flex items-center justify-center w-full">
              {workflowConfig.blocks.map((block: any, ix: number) => (
                <>
                  <div key={ix} className="text-black mx-8">
                    <div className="text-center">
                      <div className="relative h-16 w-16 mx-auto">
                        <Image
                          className="mx-auto"
                          src={
                            block.dark_icon.startsWith("http")
                              ? block.dark_icon
                              : iconUrlPrefix + block.dark_icon + iconUrlSuffix
                          }
                          alt={block.name}
                          fill
                        />
                      </div>

                      <div className="mt-4">
                        <h1 className="text-md font-bold">{block.name}</h1>
                        <p className="text-sm max-w-[200px]">{block.desc}</p>
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
      ) : (
        <>
          {/* workflowInfo still loading or not found */}
          <p className="text-xl">Loading workflow info...</p>
        </>
      )}
    </div>
  );
};

export default C;
