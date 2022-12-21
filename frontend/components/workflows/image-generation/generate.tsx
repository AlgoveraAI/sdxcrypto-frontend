import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Spinner from "../../spinner";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "@auth0/nextjs-auth0/client";
import { models } from "./models";
import Input from "../input";

type Props = {
  // selectedModal type is one of the keys in models
  selectedModal: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
  jobStatus: string;
  credits: number | null;
};

const EXPECTED_TIME = 30000; // in ms, after this the user will be notified that the job is taking longer than expected

export default function Generate({
  selectedModal,
  setJobId,
  prompt,
  setPrompt,
  images,
  jobStatus,
  credits,
}: Props) {
  // app vars
  const [loading, setLoading] = useState(false);
  const [checkTimeTakenInterval, setCheckTimeTakenInteraval] =
    useState<any>(null);
  const toastId = useRef<any>(null);

  // model params (object with string keys and number values)
  const [params, setParams] = useState<{ [key: string]: number }>({});

  // user
  const { user, error, isLoading } = useUser();

  const imgLoaded = () => {
    setLoading(false);
    toast.dismiss(toastId.current);
    // clear interval
    if (checkTimeTakenInterval) {
      clearInterval(checkTimeTakenInterval);
      setCheckTimeTakenInteraval(null);
    }
  };

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

      if (credits === null || credits < 1) {
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
      setCheckTimeTakenInteraval(interval);

      const res = await fetch("/api/txt2img", {
        method: "POST",
        body: JSON.stringify({
          uid: user?.sub,
          prompt: prompt,
          base_model: selectedModal, // the modelId (key of models)
          ...params, // the model params
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
        console.error("Error caught in api route", data);
        errorToast("Error generating image");
        clearInterval(interval);
        setCheckTimeTakenInteraval(null);
      }

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
        {credits === 0 ? (
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
            <label className="block font-medium text-gray-500">Model</label>
            <div className="text-white font-bold text-left">
              {
                // check if selectedModal is a valid key in models
                // if not, show 'Not selected'
                selectedModal ? models[selectedModal].name : "Not selected"
              }
            </div>
          </div>

          {selectedModal
            ? models[selectedModal].inputs.map((input) => (
                <Input
                  key={input.id}
                  id={input.id}
                  label={input.label}
                  type={input.type}
                  params={input.params}
                  info={input.info}
                  value={
                    params[input.id] ? params[input.id] : input.defaultValue
                  }
                  setValue={(e) => {
                    setParams({
                      ...params,
                      [input.id]: e,
                    });
                  }}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
