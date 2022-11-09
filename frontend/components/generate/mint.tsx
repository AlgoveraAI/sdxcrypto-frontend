import Image from "next/image";
import { useState } from "react";
import Spinner from "../spinner";

type Props = {
  selectedModal: string;
  jobId: string;
  prompt: string;
  images: string[];
};

export default function Generate({
  selectedModal,
  jobId,
  prompt,
  images,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const mint = async () => {
    setLoading(true);
    // check params
    const name = document.getElementById("name") as HTMLInputElement;

    if (!jobId) {
      alert("You haven't generated an image to mint!");
      setLoading(false);
      return;
    }
    if (name.value === "") {
      alert("Please enter a name");
      setLoading(false);
      return;
    }
    const description = document.getElementById(
      "description"
    ) as HTMLInputElement;
    if (description.value === "") {
      alert("Please enter a description");
      setLoading(false);
      return;
    }

    // todo add prompt as an attribute
    // todo add selected modal as an attribute
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-center">Mint Your NFT</h2>
      <div className="mx-auto">
        <label className="block text-sm font-medium text-gray-500">Name</label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="name"
              defaultValue=""
              data-lpignore="true"
              className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-black/[0.3] border-none text-sm"
              placeholder="AI Art #1"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 mx-auto">
        <label className="block text-sm font-medium text-gray-500">
          Description
        </label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="description"
              defaultValue=""
              data-lpignore="true"
              className="block p-2 w-full shadow-sm outline-none sm:text-sm bg-black/[0.3] border-none text-sm"
              placeholder="An AI generated artwork"
            />
          </div>
        </div>
      </div>
      {jobId && images.length ? (
        <Image
          className="mt-6 max-w-full h-auto mx-auto"
          src={images[selectedIdx]}
          alt="Generated Image"
          width={512}
          height={512}
        />
      ) : null}
      <div className="w-full text-center mt-6">
        <button
          onClick={mint}
          type="button"
          className="w-full md:w-1/2 text-center rounded-md border border-transparent bg-primary px-8 py-1 text-base font-medium text-white hover:bg-primary-darker md:text-lg"
        >
          {loading ? <Spinner /> : "Mint"}
        </button>
      </div>
    </div>
  );
}
