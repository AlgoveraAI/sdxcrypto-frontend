import Image from "next/image";
import Link from "next/link";

import {
  PaintBrushIcon,
  BriefcaseIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Create art",
    description: "Get creative and produce your own artworks.",
    icon: PaintBrushIcon,
  },
  {
    name: "Design Logos",
    description: "Make a logo for your new business or product.",
    icon: BriefcaseIcon,
  },
  {
    name: "Make a profile picture",
    description: "Build your online identity with a custom profile-picture.",
    icon: UserCircleIcon,
  },
];
export default function Hero() {
  return (
    <div>
      <div className="relative bg-gray-50">
        <main className="lg:relative">
          <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
            <div className="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block xl:inline">
                  State-of-the-art AI Image Generation
                </span>{" "}
              </h1>
              <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Pay with Crypto or Credit Card to use our custom Stable
                Diffusion pipeline. If you love your output, mint it directly as
                an NFT that you own and can trade or sell.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/generate"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-darker md:py-4 md:px-10 md:text-lg"
                  >
                    Start Generating
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt=""
              width={1000}
              height={1000}
            />
          </div>
        </main>
      </div>
      <div className="relative bg-white py-24 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create Stunning Images in Seconds
          </p>
          {/* <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Deploy models on dedicated and secure infrastructure without dealing
            with containers and GPUs
          </p> */}
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root rounded-lg bg-background px-6 pb-8 min-h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                          <feature.icon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-100">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
