import Image from "next/image";
import { useState } from "react";
type Props = {
  selectedModal: string;
  imgUrl: string;
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
};

const Spinner = () => {
  return (
    <div
      role="status"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <svg
        aria-hidden="true"
        className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-white  "
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  );
};

export default function Generate({ selectedModal, imgUrl, setImgUrl }: Props) {
  const [loading, setLoading] = useState(false);

  const generateImg = async () => {
    setLoading(true);
    const prompt = document.getElementById("prompt") as HTMLInputElement;
    if (prompt.value === "") {
      alert("Please enter a prompt");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt.value,
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
      <h2 className="mt-6 mb-6 text-3xl font-bold text-center">
        {selectedModal ? selectedModal : "Please select a model"}
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-500">
          Prompt
        </label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="prompt"
              defaultValue=""
              data-lpignore="true"
              disabled={selectedModal === "" ? true : false}
              className="block p-2 w-full border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm outline-none"
              placeholder="Abstract 3D octane render, trending on artstation..."
            />
          </div>
          <button
            onClick={generateImg}
            type="button"
            disabled={selectedModal === "" ? true : false}
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
