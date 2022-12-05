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
export default function Hero({
  developerRef,
}: {
  developerRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div>
      <div className="relative bg-gray-50">
        <div className="lg:relative">
          <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
            <div className="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block xl:inline">Advanced AI Workflows</span>{" "}
              </h1>
              <div className="mx-auto mt-4 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                <div>
                  Use state-of-the-art AI to create art, summarise text, and
                  more.
                </div>
                <div className="mt-4">
                  Support independant developers, who earn money from their
                  models and code.
                </div>
              </div>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/workflows"
                    className="flex w-full items-center justify-center rounded-md border-none px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-primary to-primary-lighter hover:brightness-90 md:py-4 md:px-10 md:text-lg"
                  >
                    Start Using AI
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    onClick={() => {
                      // scroll to developer section
                      developerRef?.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="flex w-full items-center justify-center rounded-md bg-gray-50 px-8 py-3 text-base font-medium text-primary hover:bg-gray-100 md:py-4 md:px-10 md:text-lg border border-primary cursor-pointer"
                  >
                    {"I'm a Developer"}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src={require("../../assets/hero.jpeg")}
              alt=""
              width={1000}
              height={1000}
            />
          </div>
        </div>
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
