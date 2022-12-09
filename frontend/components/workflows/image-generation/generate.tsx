import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Spinner from "../../spinner";
import { User } from "../../../lib/hooks";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "@auth0/nextjs-auth0/client";

type Props = {
  selectedModal: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
  jobStatus: string;
};

const EXPECTED_TIME = 30000; // in ms, after this the user will be notified that the job is taking longer than expected

export default function Generate({
  selectedModal,
  setJobId,
  prompt,
  setPrompt,
  images,
  jobStatus,
}: Props) {
  // app vars
  const [loading, setLoading] = useState(false);
  const toastId = useRef<any>(null);

  // model params
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [inferenceSteps, setInferenceSteps] = useState(25);
  const [guidanceScale, setGuidanceScale] = useState(7.5);

  // user
  const { user, error, isLoading } = useUser();

  const imgLoaded = () => {
    setLoading(false);
    toast.dismiss(toastId.current);
  };

  const changeSliderColor = (e: HTMLInputElement) => {
    if (e.value) {
      const value = parseInt(e.value);
      const min = parseInt(e.min);
      const max = parseInt(e.max);
      const percent = ((value - min) / (max - min)) * 100;
      const bg = `linear-gradient(90deg, #1937D6 ${percent}%, #0A101D ${
        // const bg = `linear-gradient(90deg, #5771f2 ${percent * 100}%, #1937D6 ${
        percent
      }%)`;
      e.style.background = bg;
    }
  };

  useEffect(() => {
    // set bg colors on load
    changeSliderColor(document.getElementById("width") as HTMLInputElement);
    changeSliderColor(document.getElementById("height") as HTMLInputElement);
    changeSliderColor(
      document.getElementById("inferenceSteps") as HTMLInputElement
    );
    changeSliderColor(
      document.getElementById("guidanceScale") as HTMLInputElement
    );
  }, []);

  useEffect(() => {
    // catch job status errors
    if (jobStatus === "error") {
      errorToast("Error monitoring job");
    }
  }, [jobStatus]);

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

  const generateImg = async () => {
    try {
      setLoading(true);

      if (!user) {
        errorToast("Please sign in to generate images!");
        return;
      }

      if (!selectedModal) {
        errorToast("Please select a model!");
        return;
      }

      if (prompt === "") {
        errorToast("Please enter a prompt!");
        return;
      }

      // if (user.credits === null || user.credits < 1) {
      //   errorToast("You don't have enough credits!");
      //   return;
      // }

      if (loading) {
        errorToast(
          "Please wait for the previous image to finish generating!",
          false
        );
        return;
      }

      let baseModel;
      if (selectedModal === "Stable Diffusion (v1.5)") {
        baseModel = "stable diffusion v1.5";
      } else {
        baseModel = "stable diffusion v2-512x512";
      }

      toastId.current = toast("Starting job", {
        position: "bottom-left",
        autoClose: false,
        closeOnClick: true,
        theme: "dark",
        hideProgressBar: false,
        icon: <Spinner />,
      });

      const startTime = Date.now();
      let warningToastId: any = null;

      const checkTimeTaken = () => {
        // once the time passes the threshold
        // show a warning toast
        // once it's been shown, stop checking and dont show again
        console.log("checking time taken");
        if (!warningToastId) {
          const timeTaken = Date.now() - startTime;
          console.log(timeTaken);
          if (timeTaken > EXPECTED_TIME) {
            warningToastId = toast.warning(
              "Sorry, your render is taking longer than expected. Our servers are busy!",
              {
                position: "bottom-left",
                theme: "dark",
                autoClose: false,
              }
            );
          }
        }
      };

      const interval = setInterval(checkTimeTaken, 5000);

      const res = await fetch("/api/txt2img", {
        method: "POST",
        body: JSON.stringify({
          uid: user?.sub,
          prompt: prompt,
          base_model: baseModel,
          height: height,
          width: width,
          inf_steps: inferenceSteps,
          guidance_scale: guidanceScale,
        }),
      });

      const data = await res.json();

      // check the response
      if (res.status === 200) {
        console.log("job result:", data, data.jobId);
        setJobId(data.jobId);

        // update toast from 'Starting job' to 'Generating image'
        toast.dismiss(toastId.current);
        toastId.current = toast("Generating image", {
          position: "bottom-left",
          autoClose: false,
          closeOnClick: true,
          theme: "dark",
          hideProgressBar: false,
          icon: <Spinner />,
        });
      } else {
        errorToast("Error generating image");
        console.error("Error caught in api route", data);
      }

      // clear interval
      clearInterval(interval);

      // clear warning toast
      if (warningToastId) {
        toast.dismiss(warningToastId);
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
      generateImg();
    }
  };

  return (
    <div className="mb-12">
      {/* <h2 className="mb-6 text-3xl font-bold text-center">
        {selectedModal ? selectedModal : "No model selected"}
      </h2> */}
      <div>
        <label className="block font-medium text-gray-500">Prompt</label>
        <div className="mt-1 md:flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="prompt"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyPress={handleInputEnter}
              data-lpignore="true"
              className="block p-2 w-full shadow-sm text-sm outline-none bg-black/[0.3] border-none"
              placeholder="Abstract 3D octane render, trending on artstation..."
            />
          </div>
          <button
            onClick={generateImg}
            type="button"
            className="relative -ml-px mt-6 w-full md:w-auto md:mt-0 md:inline-flex items-center space-x-2 border border-none px-6 py-2 text-sm font-medium  hover:bg-primary-darker focus:outline-non text-white bg-gradient-to-r from-primary to-blue-500 hover:brightness-90"
          >
            {/* keep text here when loading to maintain same width */}
            <span>Generate</span>
          </button>
        </div>
      </div>
      {/* TODO display all images */}

      {
        // 2 column flex that goes to rows on small screens
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {images.length ? (
          <Image
            className="mt-6 md:mt-12 max-w-2/3 h-auto grid-col shadow"
            src={images[0]}
            alt="Generated Image"
            width={512}
            height={512}
            onLoadedData={imgLoaded}
            onLoad={imgLoaded}
          />
        ) : (
          <div
            className={`mt-6 md:mt-12 grid-col bg-background-darker shadow
              w-full h-auto
            `}
          />
        )}
        <div className="mt-6 md:mt-12 md:ml-12 grid-col">
          <h2 className="text-2xl font-bold">Settings</h2>
          <div className="mt-6">
            <label className="block font-medium text-gray-500">Width</label>

            <div className="mt-2 shadow-sm ">
              <div className="text-white font-bold text-left">{width}</div>
              <div>
                <input
                  id="width"
                  type="range"
                  value={width}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-primary-lighter"
                  min="128"
                  max="1024"
                  step="8"
                  onChange={(e) => {
                    setWidth(parseInt(e.target.value));
                    changeSliderColor(e.target);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-medium text-gray-500">Height</label>

            <div className="mt-2 shadow-sm ">
              <div className="text-white font-bold text-left">{height}</div>
              <div>
                <input
                  id="height"
                  type="range"
                  value={height}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-primary-lighter"
                  min="128"
                  max="1024"
                  step="8"
                  onChange={(e) => {
                    setHeight(parseInt(e.target.value));
                    changeSliderColor(e.target);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-medium text-gray-500">
              Inference Steps
              <Popup
                trigger={
                  <InformationCircleIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                }
                position="right center"
                on="hover"
                {...{ contentStyle: { background: "black" } }}
              >
                <div className="text-sm text-gray-300">
                  How many steps to spend generating your image
                </div>
              </Popup>
            </label>
            <div className="mt-2 shadow-sm ">
              <div className="text-white font-bold text-left">
                {inferenceSteps}
              </div>
              <div>
                <input
                  id="inferenceSteps"
                  type="range"
                  value={inferenceSteps}
                  className="w-full h-2  rounded-lg appearance-none cursor-pointer bg-primary-lighter"
                  min="1"
                  max="100"
                  step="1"
                  onChange={(e) => {
                    setInferenceSteps(parseInt(e.target.value));
                    changeSliderColor(e.target);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-medium text-gray-500">
              Guidance Scale
              <Popup
                trigger={
                  <InformationCircleIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                }
                position="right center"
                on="hover"
                {...{ contentStyle: { background: "black" } }}
              >
                <div className="text-sm text-gray-300">
                  Adjust how much the image will be like your prompt
                </div>
              </Popup>
            </label>
            <div className="mt-2 shadow-sm ">
              <div className="text-white font-bold text-left">
                {guidanceScale}
              </div>
              <div>
                <input
                  id="guidanceScale"
                  type="range"
                  value={guidanceScale}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-primary"
                  min="1"
                  max="50"
                  step="1"
                  onChange={(e) => {
                    setGuidanceScale(parseInt(e.target.value));
                    changeSliderColor(e.target);
                  }}
                />
              </div>
              <div className="flex justify-between w-full mt-2 text-sm font-medium text-gray-500">
                {/* <span>1</span>
                <span>50</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
