import "reactjs-popup/dist/index.css";
import React, { useEffect, useState, useContext } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Image from "next/image";
import Link from "next/link";
import Popup from "reactjs-popup";
import Spinner from "../components/spinner";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
const { iconUrlPrefix, iconUrlSuffix } = require("../lib/config");
import { AppContext, AppContextType } from "../lib/contexts";

const Workflows: NextPage<PageProps> = () => {
  const [sortedWorkflowKeys, setSortedWorkflowKeys] = useState<string[]>([]);
  const appContext = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (appContext?.workflowConfigs) {
      // sort by which ones are available first
      const configs = appContext.workflowConfigs;
      const sortedWorkflowConfigs = Object.keys(
        appContext.workflowConfigs
      ).sort((a, b) => {
        if (configs[a].available && !configs[b].available) {
          return -1;
        } else if (!configs[a].available && configs[b].available) {
          return 1;
        }
        return 0;
      });
      console.log("sorted workflow configs: ", sortedWorkflowConfigs);
      setSortedWorkflowKeys(sortedWorkflowConfigs);
    }
  }, [appContext.workflowConfigs]);

  const workflowConfigs = appContext.workflowConfigs;
  const blockConfigs = appContext.blockConfigs;

  return (
    <div className="my-24 mx-12">
      <h2 className="mb-4 text-3xl font-bold text-center">AI Workflows</h2>

      <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        {workflowConfigs &&
        Object.keys(workflowConfigs).length &&
        blockConfigs &&
        Object.keys(blockConfigs).length ? (
          <ul
            role="list"
            className="grid grid-cols-1 gap-12 md-grid-cols-2 lg:grid-cols-3 mt-12"
          >
            {sortedWorkflowKeys.map((id: string) => (
              <li
                key={id}
                className={`col-span-1 flex flex-col w-full divide-y divide-gray-200 rounded-lg bg-background-darker text-center shadow-md hover:bg-opacity-70`}
              >
                <Link
                  href={
                    workflowConfigs[id].available
                      ? "/workflows/view?id=" + id
                      : ""
                  }
                  className={`${
                    workflowConfigs[id].available
                      ? "cursor-pointer hover:brightness-110"
                      : "cursor-default"
                  } `}
                  onClick={(e) => {
                    // prevent scrolling to top of page on click
                    if (!workflowConfigs[id].available) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="flex flex-1 flex-col p-8">
                    <div className="justify-center text-center">
                      {workflowConfigs[id].blocks.map(
                        (blockId: string, ix: number) => {
                          console.log(
                            "getting workflow block",
                            blockId,
                            blockConfigs[blockId]
                          );
                          return (
                            <div className="relative inline-block" key={ix}>
                              <Popup
                                trigger={
                                  <div className="relative w-8 h-8 mx-2 inline-block">
                                    <Image
                                      className=""
                                      src={
                                        blockConfigs[
                                          blockId
                                        ].light_icon.startsWith("http")
                                          ? blockConfigs[blockId].light_icon
                                          : iconUrlPrefix +
                                            blockConfigs[blockId].light_icon +
                                            iconUrlSuffix
                                      }
                                      fill
                                      alt={blockConfigs[blockId].name}
                                    />
                                  </div>
                                }
                                position="right center"
                                on="hover"
                                {...{ contentStyle: { background: "black" } }}
                              >
                                <div className="text-gray-50 text-sm">
                                  <span className="font-medium">
                                    {blockConfigs[blockId].name}:{" "}
                                  </span>
                                  <span>{blockConfigs[blockId].desc}</span>
                                </div>
                              </Popup>
                              {ix !== workflowConfigs[id].blocks.length - 1 ? (
                                <div className="inline-block mx-2 relative">
                                  <ChevronRightIcon className="h-4 w-4 text-gray-400 mb-2" />
                                </div>
                              ) : null}
                            </div>
                          );
                        }
                      )}
                    </div>
                    <h3 className="mt-6 font-bold text-gray-50">
                      {workflowConfigs[id].name}
                    </h3>
                    <dl className="mt-1 flex flex-grow flex-col justify-between">
                      <dd className="text-sm text-gray-500">
                        {workflowConfigs[id].short_desc}
                      </dd>
                      <dt className="sr-only">
                        {workflowConfigs[id].available ? "Live" : "Coming Soon"}
                      </dt>
                      <dd className="mt-3">
                        <span
                          className={`rounded-full text-gray-50 px-2 py-1 text-xs font-medium
                ${
                  workflowConfigs[id].available ? "bg-green-600" : "bg-gray-500"
                }`}
                        >
                          {workflowConfigs[id].available
                            ? "Live"
                            : "Coming Soon"}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 text-gray-400">
            Loading Workflows
            <div className="relative mt-6">
              <Spinner />
            </div>
          </div>
        )}

        <div className="mt-24 bg-background-darker w-full py-16">
          <h3 className="text-2xl font-bold text-center">
            Are you a developer?
          </h3>
          <div className="mt-8 text-center">
            <div>
              {
                "Upload your code or models to Algovera Flow and get paid whenever they're used in a workflow."
              }
            </div>
            <Link
              href="https://docs.algovera.ai/docs/developer/flow%20developers/"
              className="primary-button font-bold py-2 px-4 rounded mt-8 mx-auto block w-1/2 sm:w-1/4"
              target={"_blank"}
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;
