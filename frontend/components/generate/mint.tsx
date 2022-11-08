import Image from "next/image";
import { useState } from "react";
import Spinner from "../spinner";

type Props = {
  selectedModal: string;
  imgUrl: string;
  prompt: string;
};

export default function Generate({ selectedModal, imgUrl, prompt }: Props) {
  const [loading, setLoading] = useState(false);

  const mint = async () => {
    setLoading(true);
    // check params
    const name = document.getElementById("name") as HTMLInputElement;
    if (imgUrl === "") {
      alert("Generate an image before minting");
      setLoading(false);
      return;
    }
    setLoading(false);
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
      <div className="w-1/2 mx-auto">
        <label className="block text-sm font-medium text-gray-500">Name</label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="name"
              defaultValue=""
              data-lpignore="true"
              className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-black/[0.3] border-none"
              placeholder="AI Art #1"
            />
          </div>
        </div>
      </div>
      <div className="mt-2  w-1/2 mx-auto">
        <label className="block text-sm font-medium text-gray-500">
          Description
        </label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="description"
              defaultValue=""
              data-lpignore="true"
              className="block p-2 w-full shadow-sm  sm:text-sm bg-black/[0.3] border-none"
              placeholder="An AI generated artwork"
            />
          </div>
        </div>
      </div>
      <div className="w-full text-center mt-6">
        <button
          onClick={mint}
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-primary px-8 py-1 text-base font-medium text-white hover:bg-primary-darker md:text-lg"
        >
          {loading ? <Spinner /> : "Mint"}
        </button>
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
