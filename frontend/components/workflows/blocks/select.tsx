import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { models } from "./models";
type Props = {
  selectedModal: string | null;
  setSelectedModal: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Select({ selectedModal, setSelectedModal }: Props) {
  const entries = Object.entries(models);
  return (
    <>
      {/* <h2 className="mb-6 text-3xl font-bold text-center">Select a Model</h2> */}
      <div className="grid grid-cols-1 gap-4">
        {entries.map(([modelId, model]) => (
          <div
            key={model.name}
            className={`relative flex items-center space-x-3 rounded-lg px-6 py-5 shadow-sm bg-black/[0.3] border-none text-white`}
          >
            <div className="flex-shrink-0">
              <Image
                className="h-24 w-24 rounded-full"
                src={model.image}
                alt=""
                width={400}
                height={400}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-medium text-white">{model.name}</p>
              <p className="text-sm text-gray-300">{model.description}</p>
              <p className="text-sm text-primary-lighter">
                {model.credits_per_use}{" "}
                {model.credits_per_use > 1 ? "credits" : "credit"} per
                generation
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  className="primary-button text-sm inline-flex items-center rounded-md px-5 py-2 font-medium"
                  onClick={() => setSelectedModal(modelId)}
                >
                  Select Model
                </button>
                <button
                  type="button"
                  className="ml-2 text-sm inline-flex items-center rounded-md border border-transparent border-primary px-5 py-2 font-medium text-white  cursor-pointer hover:text-gray-300"
                  onClick={() => {
                    console.log("clicked");
                    window.open(model.website, "_blank");
                  }}
                >
                  Read More
                  <ArrowTopRightOnSquareIcon
                    className="ml-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
