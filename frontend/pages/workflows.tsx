import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Image from "next/image";
import Link from "next/link";

import imageGenerationImage from "../assets/workflows/image-generation.png";
import textSummarizationImage from "../assets/workflows/text-summarization.png";
import imageCaptioningImage from "../assets/workflows/image-captioning.png";
import imageTranslationImage from "../assets/workflows/image-to-image.png";
import discordBotImage from "../assets/workflows/discord-bot.png";
import discourseBotImage from "../assets/workflows/discourse-bot.png";
import notionImage from "../assets/workflows/notion.png";
import gifImage from "../assets/workflows/gif.gif";

const workflowOptions = [
  {
    id: "1",
    name: "Image Generation",
    href: "/workflows/image-generation",
    available: true,
    author: "Algovera",
    description: "Generate images from text prompts",
    image: imageGenerationImage,
  },
  {
    id: "2",
    name: "Text Summarization",
    href: "/workflows/text-summarization",
    available: false,
    author: "Algovera",
    description: "Summarize text",
    image: textSummarizationImage,
  },
  {
    id: "3",
    name: "Image Captioning",
    href: "/workflows/image-captioning",
    available: false,
    author: "Algovera",
    description: "Generate captions for images",
    image: imageCaptioningImage,
  },
  {
    id: "4",
    name: "Image to Image",
    href: "/workflows/image-to-image",
    available: false,
    author: "Algovera",
    description: "Generate images from images",
    image: imageTranslationImage,
  },
  {
    id: "5",
    name: "Animation Generation",
    href: "/workflows/animation-generation",
    available: false,
    author: "Algovera",
    description: "Generate animations from text prompts",
    image: gifImage,
  },
  {
    id: "6",
    name: "Discord Integration",
    href: "/workflows/animation-generation",
    available: false,
    author: "Algovera",
    description: "Image generation via a Discord bot",
    image: discordBotImage,
  },
  {
    id: "7",
    name: "Notion Integration",
    href: "/workflows/animation-generation",
    available: false,
    author: "Algovera",
    description: "Store text summarisation of Discord chat on Notion",
    image: notionImage,
  },
  {
    id: "8",
    name: "Discourse Integration",
    href: "/workflows/animation-generation",
    available: false,
    author: "Algovera",
    description: "Generate image from a discourse post",
    image: discourseBotImage,
  },
];

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
          {workflowOptions.map((workflow) => (
            <li
              key={workflow.id}
              className={`col-span-1 flex flex-col w-full divide-y divide-gray-200 rounded-lg bg-background-darker text-center shadow-md`}
            >
              <Link
                href={workflow.available ? workflow.href : ""}
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
                  <Image
                    className="mx-auto w-1/2 h-auto flex-shrink-0"
                    // src={require(workflow.image)}
                    src={workflow.image}
                    alt=""
                    width={512}
                    height={512}
                  />
                  <h3 className="mt-6 font-bold text-gray-50">
                    {workflow.name}
                  </h3>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dd className="text-sm text-gray-500">
                      {workflow.description}
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
              className="bg-gradient-to-r from-primary to-primary-lighter hover:brightness-90 text-white font-bold py-2 px-4 rounded mt-8 mx-auto block w-1/2 sm:w-1/4"
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
