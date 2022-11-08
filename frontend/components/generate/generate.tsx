import Image from "next/image";
import { useState } from "react";
import Spinner from "../spinner";

type Props = {
  selectedModal: string;
  imgUrl: string;
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function Generate({
  selectedModal,
  imgUrl,
  setImgUrl,
  prompt,
  setPrompt,
}: Props) {
  const [loading, setLoading] = useState(false);

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
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt,
        selectedModal: selectedModal,
      }),
    });
    // todo handle out of credits error
    // todo handle unknown api error
    const data = await res.json();
    console.log("/api/generate result:", data);
    setImgUrl(data.imgUrl);
    setLoading(false);
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
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              data-lpignore="true"
              className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-black/[0.3] border-none"
              placeholder="Abstract 3D octane render, trending on artstation..."
            />
          </div>
          <button
            onClick={generateImg}
            type="button"
            className="relative -ml-px inline-flex items-center space-x-2 border border-none px-6 py-2 text-sm font-medium  hover:bg-primary-darker focus:outline-none bg-primary text-white"
          >
            {/* keep text here when loading to maintain same width */}
            <span className={loading ? "text-transparent" : ""}>Generate</span>
            <span className={loading ? "" : "hidden"}>
              <Spinner />
            </span>
          </button>
        </div>
      </div>
      {imgUrl ? (
        <Image
          className="mt-6 w-full"
          src={imgUrl}
          alt="Generated Image"
          width={400}
          height={400}
        />
      ) : null}
    </div>
  );
}
