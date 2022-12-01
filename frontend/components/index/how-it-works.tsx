import Image from "next/image";
import Link from "next/link";

type Props = {
  howitworksRef: React.RefObject<HTMLDivElement>;
};

export default function HowItWorks({ howitworksRef }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-50 py-24"
      ref={howitworksRef}
    >
      <div className="relative">
        <p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl w-full text-center">
          Example Workflow
        </p>
        <div className="mt-12 lg:mt-24 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 max-w-md mx-auto sm:max-w-3xl sm:px-6">
          <div className="mx-auto max-w-xl px-6 sm:px-6 lg:mx-0 lg:max-w-none lg:px-0 flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              1. Select your model
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Choose from state-of-the-art generative AI models.
            </p>
          </div>
          <div className="mt-12 sm:mt-12 lg:mt-0 ">
            <div className="px-6 sm:px-0 lg:relative lg:m-0 lg:h-full lg:px-0">
              <Image
                className="w-full mx-auto rounded-xl shadow-xl lg:relative lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:max-w-none "
                src={require("../../assets/howitworks/1.png")}
                alt="Inbox user interface"
                width={512}
                height={512}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 max-w-md mx-auto sm:max-w-3xl sm:px-6">
          <div className="mx-auto max-w-xl px-6 sm:px-6 lg:mx-0 lg:max-w-none lg:px-0 flex flex-col justify-center ">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              2. Generate outputs
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Type in your prompt, adjust the settings, and generate.
            </p>
          </div>
          <div className="mt-12 sm:mt-12 lg:col-start-1 lg:mt-0">
            <div className="px-6 sm:px-0 lg:relative lg:m-0 lg:h-full lg:px-0">
              <Image
                className="w-full mx-auto rounded-xl shadow-xl lg:relative lg:top-1/2 lg:transform lg:-translate-y-1/2"
                src={require("../../assets/howitworks/2.png")}
                alt="Customer profile user interface"
                width={512}
                height={512}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 max-w-md mx-auto sm:max-w-3xl sm:px-6">
        <div className="mx-auto max-w-xl px-6 sm:px-6 lg:mx-0 lg:max-w-none lg:px-0 flex flex-col justify-center ">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            3. Mint (optional)
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            If you like what you see, mint the image as an NFT for free on the
            Ethereum blockchain.
          </p>
        </div>
        <div className="mt-12 sm:mt-12 lg:mt-0 ">
          <div className="px-6 sm:px-0 lg:relative lg:m-0 lg:h-full lg:px-0">
            <Image
              className="w-full mx-auto rounded-xl shadow-xl lg:relative lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:max-w-none "
              src={require("../../assets/howitworks/3.png")}
              alt="Inbox user interface"
              width={512}
              height={512}
            />
          </div>
        </div>
      </div>

      <div className="w-full text-center mt-24">
        <Link
          href="workflows"
          className="flex items-center justify-center rounded-md shadow-md bg-gradient-to-r from-primary to-primary-lighter px-5 py-3 text-base font-medium text-white hover:bg-primary-darker hover:brightness-90 w-1/3 mx-auto"
          aria-describedby="tier-standard cursor-pointer"
        >
          Try it now!
        </Link>
      </div>
    </div>
  );
}
