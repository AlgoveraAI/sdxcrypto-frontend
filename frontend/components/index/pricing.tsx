import Link from "next/link";

type Props = {
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  creditCost: number | null;
  creatorPassCost: number | null;
  creatorCreditsPerMonth: number | null;
};

export default function Pricing({
  creditsModalTrigger,
  setCreditsModalTrigger,
  creditCost,
  creatorPassCost,
  creatorCreditsPerMonth,
}: Props) {
  const tiers = [
    {
      name: "Credits",
      priceMonthly: `${creditCost} USD`,
      priceType: "per-credit",
      description: "Pay as you go",
    },
    {
      name: "Creator Pass",
      priceMonthly: `${creatorPassCost} ETH`,
      priceType: "",
      description: `${creatorCreditsPerMonth} credits per month + perks`,
    },
  ];

  return (
    <div className="bg-background">
      <div className="pt-12 sm:pt-16 lg:pt-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-2 lg:max-w-none">
            <h2 className="text-xl font-semibold leading-6 text-gray-300">
              {/* Pricing */}
            </h2>
            <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Flexible plans for every creator
            </p>
            <p className="text-xl text-gray-300">
              Pay as you go, or get a monthly subscription
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-gray-50 pb-12 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24">
        <div className="relative">
          <div className="absolute inset-0 h-3/4 bg-gray-900" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md space-y-4 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-5 lg:space-y-0">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="bg-white px-6 py-8 sm:p-10 sm:pb-6">
                    <div>
                      <h3
                        className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-base font-semibold text-primary"
                        id="tier-standard"
                      >
                        {tier.name}
                      </h3>
                    </div>
                    <div className="text-black mt-4 flex items-baseline text-5xl font-bold tracking-tight">
                      {tier.priceMonthly}
                      <span className="ml-2 text-2xl font-medium tracking-normal text-primary">
                        {tier.priceType}
                      </span>
                    </div>
                    <p className="mt-5 text-lg text-gray-500">
                      {tier.description}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col justify-between space-y-6 bg-gray-50 px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
                    <div className="rounded-md shadow">
                      {tier.name === "Credits" ? (
                        <a
                          onClick={() => {
                            setCreditsModalTrigger(true);
                          }}
                          className="flex items-center justify-center rounded-md shadow-md  bg-gradient-to-r from-primary to-primary-lighter px-5 py-3 text-base font-medium text-white hover:bg-primary-darker cursor-pointer hover:brightness-90"
                          aria-describedby="tier-standard"
                        >
                          Purchase Credits
                        </a>
                      ) : (
                        <Link
                          href="creator"
                          className="flex items-center justify-center rounded-md shadow-md bg-gradient-to-r from-primary to-primary-lighter px-5 py-3 text-base font-medium text-white hover:bg-primary-darker hover:brightness-90"
                          aria-describedby="tier-standard cursor-pointer"
                        >
                          Read More
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:mt-5 lg:px-8">
          <div className="mx-auto max-w-md lg:max-w-5xl">
            <div className="rounded-lg bg-gray-100 px-6 py-8 sm:p-10 lg:flex lg:items-center">
              <div className="flex-1">
                <div>
                  <h3 className="inline-flex rounded-full bg-white px-4 py-1 text-base font-semibold text-gray-800">
                    Free Credits
                  </h3>
                </div>
                <div className="mt-4 text-lg text-gray-600">
                  Algovera community members who have earned a Reputation Badge
                  get 100 free credits each.
                </div>
                <div className="mt-4 text-lg text-gray-600">
                  Holders of particular NFTs also have a chance to win a free
                  Creator Pass! <br />
                  See Discord for more details.
                </div>
              </div>
              <div className="mt-6 rounded-md shadow lg:mt-0 lg:ml-10 lg:flex-shrink-0">
                <a
                  href="https://discord.com/invite/e65RuHSDS5"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  Join Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
