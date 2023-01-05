import Image from "next/image";
import Link from "next/link";

type Props = {
  developerRef: React.RefObject<HTMLDivElement>;
};

export default function DeveloperInfo({ developerRef }: Props) {
  return (
    <div>
      {/* Hero card */}
      <div className="relative bg-gray-50 pb-24 " ref={developerRef}>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <Image
                className="h-full w-full object-cover"
                src={require("../../assets/developers.png")}
                alt="People working on laptops"
                height={512}
                width={512}
              />
              <div className="absolute inset-0 bg-gray-600 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">
                  Supporting Independant Developers
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-primary-200 sm:max-w-2xl">
                {
                  "If you're a developer, upload your code or models and get paid when they're used in Workflows."
                }
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                  <Link
                    href="https://docs.algovera.ai/docs/developer/flow%20developers/"
                    className="flex primary-button items-center justify-center rounded-md  px-4 py-3 text-base font-medium shadow-sm sm:px-8"
                    target={"_blank"}
                  >
                    View Docs
                  </Link>
                  <Link
                    href="https://discord.gg/e65RuHSDS5"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-primary shadow-sm hover:bg-gray-200 sm:px-8"
                  >
                    Join Discord
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo cloud */}
      {/* <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base font-semibold text-gray-500">
            Build with a range of tools and frameworks
          </p>
          <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <Image
                className="h-12"
                src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
                alt="Tuple"
                height={128}
                width={128}
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <Image
                className="h-12"
                src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
                alt="Mirage"
                height={128}
                width={128}
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <Image
                className="h-12"
                src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
                alt="StaticKit"
                height={128}
                width={128}
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 md:col-start-2 lg:col-span-1">
              <Image
                className="h-12"
                src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
                alt="Transistor"
                height={128}
                width={128}
              />
            </div>
            <div className="col-span-2 flex justify-center md:col-span-2 md:col-start-4 lg:col-span-1">
              <Image
                className="h-12"
                src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
                alt="Workcation"
                height={128}
                width={128}
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
