import { InboxIcon, SparklesIcon } from "@heroicons/react/24/outline";

import Image from "next/image";

export default function HowItWorks() {
  return (
    <div className="relative overflow-hidden bg-white pb-32">
      <div className="relative">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
            <div>
              <div className="mt-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  1. Select your model
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Select the model you want to deploy. You can deploy a custom
                  model or any of the 60,000+ pre-trained Transformers or
                  Sentence Transformers models available on the 🤗 Hub for NLP,
                  computer vision, or speech tasks.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-12 lg:mt-0 ">
            <div className="px-14 lg:relative lg:m-0 lg:h-full lg:px-0">
              <Image
                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:relative lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:max-w-none "
                src={require("../assets/howitworks/1.png")}
                alt="Inbox user interface"
                width={490}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0">
            <div>
              <div className="mt-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  2. Choose your cloud
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Pick your cloud and select a region close to your data in
                  compliance with your requirements.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-12 lg:col-start-1 lg:mt-0">
            <div className="px-14 lg:relative lg:m-0 lg:h-full lg:px-0">
              <Image
                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:relative lg:top-1/2 lg:transform lg:-translate-y-1/2"
                src={require("../assets/howitworks/2.png")}
                alt="Customer profile user interface"
                width={490}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-24">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
            <div>
              <div className="mt-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  3. Select your security level
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  <span className="font-bold">Protected Endpoints</span> are
                  accessible from the internet and require valid authentication.
                </p>
                <p className="mt-4 text-lg text-gray-500">
                  <span className="font-bold">Public Endpoints</span> are
                  accessible from the internet and do not require
                  authentication.
                </p>
                <p className="mt-4 text-lg text-gray-500">
                  <span className="font-bold">Private Endpoints</span> are only
                  available through an intra-region secured AWS or Azure
                  PrivateLink direct connection to a VPC and are not accessible
                  from the internet.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-12 lg:mt-0">
            <div className="px-14 lg:relative lg:m-0 lg:h-full lg:px-0">
              <Image
                className=" w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:left-0 lg:w-100 lg:max-w-none lg:relative lg:top-1/2 lg:transform lg:-translate-y-1/2"
                src={require("../assets/howitworks/3.png")}
                alt="Inbox user interface"
                width={999}
                height={517}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0">
            <div>
              <div className="mt-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  4. Create and manage your endpoint
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Click create and your new endpoint is ready in a couple of
                  minutes! It is easy to define autoscaling, access logs and
                  monitoring, set custom metrics routes, manage endpoints
                  programmatically with API/CLI, and rollback models.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-12 lg:col-start-1 lg:mt-0">
            <div className="px-14 lg:relative lg:m-0 lg:h-full lg:px-0">
              <Image
                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:relative lg:top-1/2 lg:transform lg:-translate-y-1/2"
                src={require("../assets/howitworks/4.png")}
                alt="Customer profile user interface"
                width={490}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-center mt-12">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-darker md:py-3 md:px-8 md:text-lg"
        >
          Read the docs
        </button>
      </div>
    </div>
  );
}
