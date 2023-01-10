import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../../spinner";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type ImgResult = {
  urls: string[];
  settings: any;
};

export default function Images({ uid }: { uid: string | null }) {
  const [jobResults, setJobResults] = useState<ImgResult[] | null>(null);
  const [show, setShow] = useState(true);

  const getImages = async () => {
    const response = await fetch("/api/getAllJobResults", {
      method: "POST",
      body: JSON.stringify({
        uid,
        modality: "images",
      }),
    });
    const { results } = await response.json();
    console.log("jobResults", results);
    setJobResults(results);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (uid) {
      getImages();
    }
  }, [uid]);

  return (
    <div className="relative flex flex-wrap items-center my-6 w-full">
      <div onClick={toggleShow} className="cursor-pointer hover:underline">
        <span className="text-3xl font-bold">Image Generations</span>
        {show ? (
          <ChevronDownIcon className="inline ml-4 mb-1 h-8 w-8" />
        ) : (
          <ChevronRightIcon className="inline ml-4 mb-1 h-8 w-8" />
        )}
      </div>
      {jobResults !== null && jobResults.length > 0 && show ? (
        <ul
          role="list"
          className="space-y-12 sm:space-y-0 sm:divide-y sm:divide-gray-200 lg:gap-x-8 lg:space-y-0"
        >
          {jobResults.map((result, i) => (
            <li key={i} className="sm:py-8">
              <div className="space-y-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-6 sm:space-y-0">
                <div className="aspect-w-3 aspect-h-2 sm:aspect-w-3 sm:aspect-h-4">
                  <Image
                    src={result.urls[0]}
                    alt={result.settings["name"]}
                    height={512}
                    width={512}
                  />
                </div>
                <div>
                  <div>
                    <div className="text-lg font-medium">Model</div>
                    <div className="text-gray-400">
                      {models[result.settings.base_model]
                        ? models[result.settings.base_model].name
                        : result.settings.base_model}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-lg font-medium">Prompt</div>
                    <div className="text-gray-400 ">
                      {result.settings.prompt}
                    </div>
                  </div>

                  <div className="text-lg font-mediu mt-4">Settings</div>
                  <div className="text-md text-gray-400 mt-2">
                    <span>Resolution: </span>
                    <span className="text-ml-2">
                      {result.settings.resolution
                        ? `${result.settings.resolution} x ${result.settings.resolution}`
                        : `${result.settings.width} x ${result.settings.height}`}
                    </span>
                  </div>
                  {result.settings.guidance_scale &&
                  result.settings.guidance_scale !== "NA" ? (
                    <div className="text-md text-gray-400 mt-2">
                      <span>Guidance Scale: </span>
                      <span className="text-ml-2">
                        {result.settings.guidance_scale}
                      </span>
                    </div>
                  ) : null}
                  {result.settings.inf_steps &&
                  result.settings.inf_steps !== "NA" ? (
                    <div className="text-md text-gray-400 mt-2">
                      <span>Inference Steps: </span>
                      <span className="text-ml-2">
                        {result.settings.inf_steps}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : jobResults === null ? (
        <div className="w-full py-24 relative">
          <Spinner />
        </div>
      ) : jobResults.length === 0 ? (
        <div>
          You have no image generations yet. Head to the{" "}
          <Link
            className="underline cursor-pointer"
            href="/workflows/image-generation"
          >
            Image Generation Workflow
          </Link>{" "}
          to get started.
        </div>
      ) : null}
    </div>
  );
}
