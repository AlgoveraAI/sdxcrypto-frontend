import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Image from "next/image";
import Link from "next/link";

const { WORKFLOWS } = require("../lib/config");
const iconUrlPrefix =
  "https://firebasestorage.googleapis.com/v0/b/sdxcrypto-algovera.appspot.com/o/frontend%2Fassets%2Ficons%2F";
const iconUrlSuffix = "?alt=media";

const Workflows: NextPage<PageProps> = () => {
  return (
    <div className="my-24 mx-4">
      <h2 className="mb-4 text-3xl font-bold text-center">AI Workflows</h2>
      <div className="text-center mt-2">
        <Link
          href="/workflows/outputs"
          className="mx-auto text-center text-sm underline text-gray-400"
        >
          View your outputs
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        <ul
          role="list"
          className="grid grid-cols-1 gap-12 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 mt-12"
        >
          {Object.entries(WORKFLOWS).map(([id, workflow]: [string, any]) => (
            <li
              key={id}
              className={`col-span-1 flex flex-col w-full divide-y divide-gray-200 rounded-lg bg-background-darker text-center shadow-md`}
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
                    {workflow.blocks.map((block: any, ix: number) => (
                      <div key={ix} className="relative inline-block w-16 h-16">
                        <Image
                          src={
                            block.light_icon.startsWith("http")
                              ? block.light_icon
                              : iconUrlPrefix + block.light_icon + iconUrlSuffix
                          }
                          fill
                          alt={block.name}
                        />
                      </div>
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
          ))}
        </ul>
        <div className="mt-24 bg-background-darker w-full py-16">
          <h3 className="text-2xl font-bold text-center">
            Are you a developer?
          </h3>
          <div className="mt-8 text-center">
            <div>
              {
                "Upload your code or models to Algovera Flow and get paid whenever they're used in a workflow!"
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
