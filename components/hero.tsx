import Image from "next/image";

import {
  CursorArrowRaysIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Deploy models with just a few clicks",
    description:
      "Turn your models into production-ready APIs, without having to deal with infrastructure or MLOps.",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Keep your production costs down",
    description:
      "Leverage a fully-managed production solution for inference and pay as you go for the raw compute you use.",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Enterprise Securiy",
    description:
      "Deploy models into secure offline endpoints only accessible via direction connection to your Virtual Private Cloud (VPC).",
    icon: ShieldCheckIcon,
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
                  Transformers in production:
                </span>{" "}
                <span className="italic block xl:inline">solved</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                With 🤗 Inference Endpoints, you can easily deploy your models
                on dedicated, fully managed infrastructure. Keep your costs low
                with our secure, compliant and flexible production solution.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-darker md:py-4 md:px-10 md:text-lg"
                  >
                    Deploy your first model
                  </a>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a
                    href="#"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-primary hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
                  >
                    Or read the docs
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1636955840493-f43a02bfa064?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt=""
              width={1000}
              height={1000}
            />
          </div>
        </main>
      </div>
      <div className="relative bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Production Inference Made Easy
          </p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Deploy models on dedicated and secure infrastructure without dealing
            with containers and GPUs
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                          <feature.icon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
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
