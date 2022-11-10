const includedFeatures = [
  "One credit is worth one generation, and costs $0.001.",
  "You can purchase as many credits as you want, with any crypto you want.",
  "Credits never expire.",
];

type Props = {
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Pricing({
  creditsModalTrigger,
  setCreditsModalTrigger,
}: Props) {
  return (
    <div className="bg-background">
      <div className="pt-12 sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
              Purchase credits using using your prefered cryptocurrency
            </h2>
            <p className="mt-4 text-xl text-gray-100">
              Powered by Coinbase Commerce
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-gray-100 pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-background" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg overflow-hidden rounded-lg shadow-lg lg:flex lg:max-w-none">
              <div className="flex-1 bg-gray-100 px-6 py-8 lg:p-12">
                <div className="mt-8">
                  <div className="flex items-center">
                    <h4 className="flex-shrink-0 bg-gray-100 pr-4 text-base font-semibold text-primary">
                      How do the credits work?
                    </h4>
                    <div className="flex-1 border-t-2 border-gray-200" />
                  </div>
                  <ul
                    role="list"
                    className="mt-8 space-y-5 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:space-y-0"
                  >
                    {includedFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start lg:col-span-1"
                      >
                        <p className="ml-3 text-sm text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-100 py-8 px-6 text-center lg:flex lg:flex-shrink-0 lg:flex-col lg:justify-center lg:p-12">
                <div className="mt-6">
                  <div className="rounded-md shadow">
                    <a
                      onClick={() => {
                        setCreditsModalTrigger(true);
                      }}
                      className="flex items-center justify-center rounded-md border border-transparent bg-primary px-5 py-3 text-base font-medium text-white hover:bg-primary-darker cursor-pointer"
                    >
                      Buy Credits
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
