import Image from "next/image";
import { useState, useEffect } from "react";
import Spinner from "../spinner";
import { User } from "../../lib/hooks";

type Props = {
  user: User;
  selectedModal: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
};

export default function Generate({
  user,
  selectedModal,
  setJobId,
  prompt,
  setPrompt,
  images,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [resolution, setResolution] = useState(512);
  const [inferenceSteps, setInferenceSteps] = useState(50);
  const [guidanceScale, setGuidanceScale] = useState(7.5);

  // once images are received, turn off loading
  useEffect(() => {
    if (images.length > 0) {
      setLoading(false);
    }
  }, [images]);

  const generateImg = async () => {
    setLoading(true);

    if (!user.uid) {
      alert("Not logged in");
      setLoading(false);
      return;
    }

    if (!selectedModal) {
      alert("Please select a model");
      setLoading(false);
      return;
    }
    if (prompt === "") {
      alert("Please enter a prompt");
      setLoading(false);
      return;
    }
    let baseModel;
    if (selectedModal === "SDxMJ") {
      baseModel = "midjourney-v4";
    } else {
      baseModel = "stable-diffusion-v1-5";
    }

    const res = await fetch("/api/txt2img", {
      method: "POST",
      body: JSON.stringify({
        uid: user.uid,
        prompt: prompt,
        base_model: baseModel,
        height: resolution,
        width: resolution,
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
      alert("Error generating image");
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
            className="relative -ml-px mt-6 w-full md:w-auto md:mt-0 md:inline-flex items-center space-x-2 border border-none px-6 py-2 text-sm font-medium  hover:bg-primary-darker focus:outline-none bg-primary text-white"
          >
            {/* keep text here when loading to maintain same width */}
            <span className={loading ? "text-transparent" : ""}>Generate</span>
            <span className={loading ? "" : "hidden"}>
              <Spinner />
            </span>
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
            className="mt-6 md:mt-12 max-w-2/3 h-auto grid-col"
            src={images[0]}
            alt="Generated Image"
            width={512}
            height={512}
          />
        ) : (
          <div className="mt-6 md:mt-12 max-w-2/3 h-auto grid-col border border-gray-700" />
        )}
        <div className="mt-6 md:mt-12 md:ml-12">
          <h2 className="text-2xl font-bold">Settings</h2>
          <div className="mt-6">
            <label className="block font-medium text-gray-500">
              Resolution
            </label>
            <div className="mt-1 md:flex shadow-sm ">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                {[512, 768, 1024].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    type="button"
                    className={`relative -ml-px mt-2 w-full md:w-auto md:mt-0 md:inline-flex items-center space-x-2 border border-none px-6 py-2  hover:bg-primary-darker focus:outline-none ${
                      resolution === res
                        ? "bg-primary text-white font-bold"
                        : "bg-black/[0.3] text-gray-500"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-medium text-gray-500">
              Inference Steps
            </label>
            <div className="mt-2 shadow-sm ">
              <div className="text-white font-bold text-left">
                {inferenceSteps}
              </div>
              <div>
                <input
                  type="range"
                  value={inferenceSteps}
                  className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer dark:bg-primary"
                  min="1"
                  max="100"
                  step="1"
                  onChange={(e) => setInferenceSteps(parseInt(e.target.value))}
                />
              </div>
              <div className="flex justify-between w-full mt-2 text-sm font-medium text-gray-500">
                {/* <span>1</span>
                <span>100</span> */}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-medium text-gray-500">
              Guidance Scale
            </label>
            <div className="mt-2 shadow-sm ">
              <div className="text-white font-bold text-left">
                {guidanceScale}
              </div>
              <div>
                <input
                  type="range"
                  value={guidanceScale}
                  className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer dark:bg-primary"
                  min="1"
                  max="50"
                  step="1"
                  onChange={(e) => setGuidanceScale(parseInt(e.target.value))}
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
