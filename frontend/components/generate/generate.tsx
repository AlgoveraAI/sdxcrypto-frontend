import Image from "next/image";
import { useState, useEffect } from "react";
import Spinner from "../spinner";

type Props = {
  uid: string;
  selectedModal: string;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
};

export default function Generate({
  uid,
  selectedModal,
  setJobId,
  prompt,
  setPrompt,
  images,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);

  // once images are received, turn off loading
  useEffect(() => {
    if (images.length > 0) {
      setLoading(false);
    }
  }, [images]);

  const generateImg = async () => {
    setLoading(true);
    if (selectedModal === "") {
      alert("Please select a model");
      setLoading(false);
      return;
    }
    if (prompt === "") {
      alert("Please enter a prompt");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/txt2img", {
      method: "POST",
      body: JSON.stringify({
        uid: uid,
        prompt: prompt,
        // selectedModal: selectedModal,
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
    <div>
      <h2 className="mb-6 text-3xl font-bold text-center">
        {selectedModal ? selectedModal : "No model selected"}
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-500">
          Prompt
        </label>
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
      {images.length ? (
        <Image
          className="mt-6 md:mt-12 max-w-full h-auto mx-auto"
          src={images[0]}
          alt="Generated Image"
          width={width}
          height={height}
        />
      ) : null}
    </div>
  );
}
