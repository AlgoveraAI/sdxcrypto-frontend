import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import { toast } from "react-toastify";
import "reactjs-popup/dist/index.css";
import Input from "../input";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { BlockConfigType } from "../../../lib/types";
import {
  AppContext,
  AppContextType,
  UserContext,
  UserContextType,
  JobContext,
  JobContextType,
} from "../../../lib/contexts";
import { useJobStatus } from "../../../lib/hooks";

export default function Generate({ config }: { config: BlockConfigType }) {
  const appContext = useContext(AppContext) as AppContextType;
  const userContext = useContext(UserContext) as UserContextType;
  const jobContext = useContext(JobContext) as JobContextType;

  // app vars
  const [loading, setLoading] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);
  const toastId = useRef<any>(null);

  // model params (object with string keys and number values)
  const [params, setParams] = useState<{ [key: string]: number }>({});

  useJobStatus(jobContext);

  useEffect(() => {
    // on mount
    jobContext.setData({ prompt: "" });
    jobContext.setOutput([]);
  }, []);

  useEffect(() => {
    // once job is done, load the image
    if (jobContext.status === "done") {
      loadImages();
    }
  }, [jobContext.status]);

  useEffect(() => {
    // set model params
    if (config) {
      let params: any = {};
      config.params.forEach((param: any) => {
        params[param.id] = param.default;
      });
      setParams(params);
    }
  }, [config]);

  const loadImages = async () => {
    console.log("getting images for jobId", jobContext.id);
    const response = await fetch("/api/getJobResult", {
      method: "POST",
      body: JSON.stringify({
        jobId: jobContext.id,
        uid: userContext.uid,
        workflow: "txt2img",
      }),
    });
    const { urls } = await response.json();
    jobContext.setOutput(urls);
  };

  const imgLoaded = () => {
    setLoading(false);
    toast.dismiss(toastId.current);
  };

  const downloadImage = (img: string) => {
    // open image in new tab
    // so the raw img can be downloaded in full-res
    // (as downloading the next/image will get a compressed .webp)
    window.open(img, "_blank");
  };

  const errorToast = (msg: string, dismissCurrent: boolean = true) => {
    toast.error(msg, {
      position: "bottom-left",
      type: "error",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: ".9rem",
      },
    });
    if (dismissCurrent) {
      if (toastId.current) {
        toast.dismiss(toastId.current);
      }
      setLoading(false);
    }
  };

  const startJob = async () => {
    try {
      setLoading(true);

      if (!userContext.uid) {
        errorToast("Please sign in to generate images!");
        return;
      }

      if (userContext.credits === null || userContext.credits < 1) {
        errorToast("You don't have enough credits!");
        return;
      }

      if (loading) {
        errorToast(
          "Please wait for the previous image to finish generating!",
          false
        );
        return;
      }

      // get value of input with id "prompt"
      const prompt = (document.getElementById("prompt") as HTMLInputElement)
        .value;

      if (!prompt) {
        errorToast("Please enter a prompt!");
        return;
      }

      // trigger the useJobStatus hook to start polling and show a toast
      jobContext.setStatus("started");

      // store prompt in jobContext so it can be used elsewhere
      jobContext.setData({
        prompt,
      });

      console.log("sending", config);
      console.log("params", params);
      const endpointBody = {
        uid: userContext.uid,
        prompt: prompt,
        model: config.model_name,
        ...params,
      };
      console.log("endpoint body", endpointBody);
      const res = await fetch("/api/txt2img", {
        method: "POST",
        body: JSON.stringify({
          endpoint: config.endpoint,
          endpointBody,
        }),
      });

      const data = await res.json();

      // check the response
      if (res.status === 200) {
        console.log("job result:", data, data.jobId);
        // this jobId will be sent to the useStatus hook
        // which will poll the job status endpoint and manage toasts
        jobContext.setId(data.jobId);
      } else {
        console.error("Error caught in api route", data);
        errorToast("Error generating image");
      }
    } catch (e) {
      console.error("Erorr generating image", e);
      errorToast("Error generating image");
    }
  };

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      startJob();
    }
  };

  return (
    <div className="mb-12">
      <div>
        <label className="block font-medium text-gray-500">Prompt</label>
        <div className="mt-1 md:flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="prompt"
              onKeyPress={handleInputEnter}
              data-lpignore="true"
              className="block p-2 w-full shadow-sm text-sm outline-none bg-background-darker border-none"
              placeholder="Abstract 3D octane render, trending on artstation..."
            />
          </div>
          <button
            onClick={startJob}
            type="button"
            className="primary-button relative -ml-px mt-6 w-full md:w-auto md:mt-0 md:inline-flex items-center space-x-2 border border-none px-6 py-2 text-sm font-medium"
          >
            {/* keep text here when loading to maintain same width */}
            <span>Generate</span>
          </button>
        </div>
        {userContext.credits === 0 ? (
          <div className="mt-2 text-sm text-red-600 italic">
            {"You're out of credits, "}
            <Link className="underline" href="/pricing">
              buy more here
            </Link>{" "}
            to use the AI.
          </div>
        ) : null}
      </div>
      {/* TODO display all images */}

      {
        // 2 column flex that goes to rows on small screens
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jobContext.output?.length ? (
          <div
            className="relative mt-6 md:mt-12 max-w-2/3 grid-col shadow"
            onMouseEnter={() => {
              setImgHovered(true);
            }}
            onMouseLeave={() => {
              setImgHovered(false);
            }}
          >
            <Image
              className="h-auto"
              src={jobContext.output[0]}
              alt="Generated Image"
              fill
              onLoadedData={imgLoaded}
              onLoad={imgLoaded}
            />
            <ArrowDownCircleIcon
              className={`absolute top-0 right-0 m-4 text-white cursor-pointer w-8 h-8 hover:brightness-50
               ${imgHovered ? "opacity-100" : "opacity-0"}`}
              onClick={() => {
                if (jobContext.output?.length) {
                  downloadImage(jobContext.output[0]);
                } else {
                  errorToast("No image to download");
                }
              }}
            />
          </div>
        ) : (
          <div
            className={`mt-6 md:mt-12 grid-col bg-background-darker shadow
              w-full aspect-square
            `}
          />
        )}
        <div className="mt-6 md:mt-12 md:ml-12 grid-col">
          <h2 className="text-2xl font-bold">Settings</h2>

          {/* <div className="mt-6">
            <label className="block font-medium text-gray-500">Model</label>
            <div className="text-white font-bold text-left">
              {
                // check if selectedModal is a valid key in models
                // if not, show 'Not selected'
                selectedModal ? models[selectedModal].name : "Not selected"
              }
            </div>
          </div> */}

          {config.params.map((param: any) => (
            <Input
              key={param.id}
              id={param.id}
              label={param.name}
              type={param.type}
              params={param.params}
              info={param.info}
              value={params[param.id]}
              setValue={(e) => {
                setParams({
                  ...params,
                  [param.id]: e,
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
