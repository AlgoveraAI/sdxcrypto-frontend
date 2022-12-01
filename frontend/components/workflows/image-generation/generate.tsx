import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Spinner from "../../spinner";
import { User } from "../../../lib/hooks";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  user: User;
  selectedModal: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
  jobStatus: string | null;
};

export default function Generate({
  user,
  selectedModal,
  setJobId,
  prompt,
  setPrompt,
  images,
  jobStatus,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [inferenceSteps, setInferenceSteps] = useState(50);
  const [guidanceScale, setGuidanceScale] = useState(7.5);

  const toastId = useRef<any>(null);

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

  const error = (msg: string) => {
    toast(msg, {
      position: "bottom-left",
      type: "error",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: ".9rem",
      },
    });
    setLoading(false);
  };

  const generateImg = async () => {
    setLoading(true);

    if (!user.uid) {
      error("Please sign in to generate images!");
      return;
    }

    if (!selectedModal) {
      error("Please select a model!");
      return;
    }

    if (prompt === "") {
      error("Please enter a prompt!");
      return;
    }

    if (user.credits === null || user.credits < 1) {
      error("You don't have enough credits!");
      return;
    }

    if (loading || jobStatus === "pending" || jobStatus === "in-process") {
      error("Please wait for the previous image to finish generating!");
      return;
    }

    let baseModel;
    if (selectedModal === "SDxMJ") {
      baseModel = "midjourney-v4";
    } else {
      baseModel = "stable-diffusion-v1-5";
    }

    toastId.current = toast("Generating image", {
      position: "bottom-left",
      autoClose: false,
      closeOnClick: true,
      theme: "dark",
      hideProgressBar: false,
      // show spinner
      icon: <Spinner />,
    });

    const res = await fetch("/api/txt2img", {
      method: "POST",
      body: JSON.stringify({
        uid: user.uid,
        prompt: prompt,
        base_model: baseModel,
        height: height,
        width: width,
        inf_steps: inferenceSteps,
        guidance_scale: guidanceScale,
      }),
    });
    // todo handle out of credits error
    // todo handle unknown api error
    console.log("res", res);
    if (res.status === 200) {
      const data = await res.json();
      console.log("job result:", data);
      setJobId(data.jobId);
    } else {
      error("Error generating image");
    }
  };

  return (
    <div className="mb-12">
      <h2 className="mb-6 text-3xl font-bold text-center">
        {selectedModal ? selectedModal : "No model selected"}
      </h2>
      <div>
        <label className="block font-medium text-gray-500">Prompt</label>
        <div className="mt-1 md:flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
            <label className="block font-medium text-gray-500">
              Width
              <Popup
                trigger={
                  <InformationCircleIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                }
                position="right center"
                on="hover"
                {...{ contentStyle: { background: "black" } }}
              >
                <div className="text-sm text-gray-300">Image width</div>
              </Popup>
            </label>

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
            <label className="block font-medium text-gray-500">
              Height
              <Popup
                trigger={
                  <InformationCircleIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                }
                position="right center"
                on="hover"
                {...{ contentStyle: { background: "black" } }}
              >
                <div className="text-sm text-gray-300">Image height</div>
              </Popup>
            </label>

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
