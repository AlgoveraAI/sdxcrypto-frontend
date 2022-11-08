import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

const models = [
  {
    name: "Stable Diffusion",
    description:
      "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input, cultivates autonomous freedom to produce incredible imagery, empowers billions of people to create stunning art within seconds.",
    website: "https://github.com/CompVis/stable-diffusion",
    imageUrl:
      "https://pbs.twimg.com/profile_images/1505934249228185602/8Wkiy3vL_400x400.jpg",
  },
  {
    name: "DALLE-2",
    description:
      "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input, cultivates autonomous freedom to produce incredible imagery, empowers billions of people to create stunning art within seconds.",
    website: "https://openai.com/blog/dall-e/",
    imageUrl:
      "https://pbs.twimg.com/profile_images/1512117240094547987/Viv0eNk__400x400.jpg",
  },
];

type Props = {
  selectedModal: string;
  setSelectedModal: React.Dispatch<React.SetStateAction<string>>;
};

export default function Select({ selectedModal, setSelectedModal }: Props) {
  // log props on every render
  console.log("selectedModal: ", selectedModal);

  return (
    <>
      <h2 className="mb-6 text-3xl font-bold text-center">Select a Model</h2>
      <div className="grid grid-cols-1 gap-4">
        {models.map((model) => (
          <div
            key={model.name}
            className={`relative flex items-center space-x-3 rounded-lg px-6 py-5 shadow-sm bg-black/[0.3] border-none text-white`}
          >
            <div className="flex-shrink-0">
              <Image
                className="h-24 w-24 rounded-full"
                src={model.imageUrl}
                alt=""
                width={400}
                height={400}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-medium text-white">{model.name}</p>
              <p className="text-sm text-gray-300">{model.description}</p>
              <div className="mt-2">
                <button
                  type="button"
                  className="text-sm inline-flex items-center rounded-md border border-transparent bg-primary px-5 py-1 font-medium text-white hover:primary-darker cursor-pointer"
                  onClick={() => setSelectedModal(model.name)}
                >
                  Select Model
                </button>
                <button
                  type="button"
                  className="ml-2 text-sm inline-flex items-center rounded-md border border-transparent border-primary px-5 py-1 font-medium text-white hover:primary-darker cursor-pointer"
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
