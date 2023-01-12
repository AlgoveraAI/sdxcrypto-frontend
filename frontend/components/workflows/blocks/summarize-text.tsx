import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import Spinner from "../../spinner";
import { toast } from "react-toastify";
import "reactjs-popup/dist/index.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Popup from "reactjs-popup";
import {
  AppContext,
  AppContextType,
  UserContext,
  UserContextType,
  JobContext,
  JobContextType,
} from "../../../lib/contexts";
import { BlockConfigType } from "../../../lib/types";
import { useJobStatus } from "../../../lib/hooks";

export default function SummarizeText({ config }: { config: BlockConfigType }) {
  const appContext = useContext(AppContext) as AppContextType;
  const userContext = useContext(UserContext) as UserContextType;
  const jobContext = useContext(JobContext) as JobContextType;
  const [jobStarted, setJobStarted] = useState(false);

  // app vars
  const [loading, setLoading] = useState(false);
  const toastId = useRef<any>(null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  // model params (object with string keys and number values)
  const [params, setParams] = useState<{ [key: string]: number }>({});

  const { jobStatus } = useJobStatus(jobStarted, jobContext.id);

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

      console.log("sending", config);
      console.log("params", params);
      const endpointBody = {
        uid: userContext.uid,
        doc: inputText,
        model_name: config.model_name,
        ...params,
      };
      console.log("endpoint body", endpointBody);
      const res = await fetch("/api/summarize", {
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
        jobContext.setId(data.jobId);
      } else {
        console.error("Error caught in api route", data);
        errorToast("Error summarizing text");
      }
    } catch (e) {
      console.error("Erorr summarizing text", e);
      errorToast("Error summarizing text");
    }
  };

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      startJob();
    }
  };

  const copyOutputToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Copied to clipboard", {
      position: "bottom-left",
      theme: "dark",
      autoClose: 2000,
    });
  };

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h3 className="text-lg font-semibold">Input</h3>
            <div className="ml-2 text-sm text-gray-500">
              {inputText ? `${inputText.length} characters` : ``}
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <textarea
              className="w-full h-64 p-2 border border-gray-300 text-black rounded-md focus:outline-none"
              placeholder="Enter text or a URL to summarize"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <button
            className="mt-2 text-center primary-button w-full md:w-fit px-6 py-2 rounded-md font-medium"
            onClick={startJob}
          >
            Summarize
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h3 className="text-lg font-semibold">Summary</h3>
            <div className="ml-2 text-sm text-gray-500">
              {outputText ? `${outputText.length} characters` : ``}
            </div>
          </div>
          <div className="flex flex-col mt-2 relative w-full h-64 p-2 border border-gray-300 text-black rounded-md focus:outline-none bg-white">
            <div className="w-[90%]">{outputText}</div>
            <DocumentDuplicateIcon
              onClick={copyOutputToClipboard}
              className="absolute text-black w-6 h-6 top-2 right-2 cursor-pointer"
            />
          </div>
        </div>
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
  );
}
