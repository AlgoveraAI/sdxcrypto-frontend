import { CheckIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "Multiple Workflows",
    description:
      "Use one credit system to access multiple workflows on the platform. Interact with AI to generate and automate your work.",
  },
  {
    name: "Prompt Suggestions",
    description: "Quickly access the most popular prompts.",
  },
  {
    name: "Third-Party Service Integrations",
    description:
      "Include third-party services and tools like Discourse, Twitter, Discord, Notion, etc. in your workflows.",
  },
  {
    name: "Web3 Integrations",
    description: "Use AI workflows to automate Web3 actions and tasks.",
  },
  {
    name: "GUI for Workflows",
    description:
      "Visualize and build workflows easily with a graphical user interface.",
  },
  {
    name: "Google Auth & Fiat Payment",
    description:
      "Excepturi sed quo mollitia voluptatibus. Qui quo ut nihil quo. Dolor at dignissimos ea voluptatem.",
  },
  {
    name: "API for Workflows",
    description:
      "Embed your workflow or parts of your workflow in an application by generating an API endpoint.",
  },
];

export default function Roadmap() {
  return (
    <div>
      <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-50 sm:text-4xl">
            Roadmap
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-400">
            The Algovera Platform is currently in Beta, and is set for
            significant upgrades.
          </p>
        </div>
        <dl className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <dt>
                <CheckIcon
                  className="absolute mt-1 h-6 w-6 text-primary-lighter"
                  aria-hidden="true"
                />
                <p className="ml-10 text-lg font-semibold leading-8 text-gray-50">
                  {feature.name}
                </p>
              </dt>
              <dd className="mt-2 ml-10 text-base leading-7 text-gray-400">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
