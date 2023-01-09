import "reactjs-popup/dist/index.css";
import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Image from "next/image";
import Link from "next/link";
import Popup from "reactjs-popup";
import Spinner from "../components/spinner";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const { iconUrlPrefix, iconUrlSuffix } = require("../lib/config");

const Workflows: NextPage<PageProps> = () => {
  const [workflowConfigs, setWorkflowConfigs] = useState<any>([]);
  const [blockConfigs, setBlockConfigs] = useState<any>([]);

  useEffect(() => {
    getWorkflows();
  }, []);

  const getWorkflows = async () => {
    // load in each workflowConfig from the workflow_configs collection
    const querySnapshot = await getDocs(collection(db, "workflow_configs"));
    const workflowConfigs = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setWorkflowConfigs(workflowConfigs);

    const blockQuerySnapshot = await getDocs(collection(db, "block_configs"));
    const blockConfigs = blockQuerySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setBlockConfigs(blockConfigs);
  };

  return (
    <div className="my-24 mx-4">
      <h2 className="mb-4 text-3xl font-bold text-center">AI Workflows</h2>
      <div className="text-center mt-2">
        {workflowConfigs.length ? (
          <Link
            href="/workflows/outputs"
            className="mx-auto text-center text-sm underline text-gray-400"
          >
            View your outputs
          </Link>
        ) : null}
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        {workflowConfigs.length && blockConfigs.length ? (
          <ul
            role="list"
            className="grid grid-cols-1 gap-12 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 mt-12"
          >
            {Object.entries(workflowConfigs).map(
              ([id, workflow]: [string, any]) => (
                <li
                  key={id}
                  className={`col-span-1 flex flex-col w-full divide-y divide-gray-200 rounded-lg bg-background-darker text-center shadow-md hover:bg-opacity-70`}
                >
                  <Link
                    href={workflow.available ? "/workflows/view?id=" + id : ""}
                    className={`${
                      workflow.available
                        ? "cursor-pointer hover:brightness-110"
                        : "cursor-default"
                    } `}
                    onClick={(e) => {
                      // prevent scrolling to top of page on click
                      if (!workflow.available) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="flex flex-1 flex-col p-8 hover:">
                      <div>
                        {workflow.blocks.map((blockId: string, ix: number) => (
                          <Popup
                            key={ix}
                            trigger={
                              <div className="relative inline-block w-16 h-16">
                                <Image
                                  src={
                                    blockConfigs[blockId].light_icon.startsWith(
                                      "http"
                                    )
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
                        ))}
                      </div>
                      <h3 className="mt-6 font-bold text-gray-50">
                        {workflow.name}
                      </h3>
                      <dl className="mt-1 flex flex-grow flex-col justify-between">
                        <dd className="text-sm text-gray-500">
                          {workflow.short_desc}
                        </dd>
                        <dt className="sr-only">
                          {workflow.available ? "Live" : "Coming Soon"}
                        </dt>
                        <dd className="mt-3">
                          <span
                            className={`rounded-full text-gray-50 px-2 py-1 text-xs font-medium
                ${workflow.available ? "bg-green-600" : "bg-gray-500"}`}
                          >
                            {workflow.available ? "Live" : "Coming Soon"}
                          </span>
                        </dd>
                      </dl>
                    </div>
                  </Link>
                </li>
              )
            )}
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
