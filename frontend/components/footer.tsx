import Image from "next/image";
import Link from "next/link";

const navigation = {
  pages: [
    { name: "Home", href: "/" },
    { name: "Workflows", href: "/workflows" },
    { name: "Access Pass", href: "/access" },
    { name: "Pricing", href: "/pricing" },
  ],
  community: [
    { name: "Discord", href: "https://discord.gg/e65RuHSDS5" },
    { name: "Twitter", href: "https://twitter.com/algoveraai" },
    {
      name: "Youtube",
      href: "https://www.youtube.com/channel/UC2A5iUpP6k52ZZmC8LFj1IA",
    },
  ],
  more: [
    { name: "Github", href: "https://github.com/AlgoveraAI/" },
    { name: "Newsletter", href: "https://algovera.substack.com/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl pt-12 pb-8 px-4 sm:px-6  lg:px-8">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8">
          <div className="space-y-8 xl:col-span-1 w-3/4">
            <Link href="https://algovera.ai">
              <Image
                className="h-10"
                src={require("../assets/algovera.svg")}
                alt="Algovera"
                width={200}
                height={100}
              />
            </Link>
            <p className="text-base text-gray-500">
              Algovera allows anyone to build AI workflows using AI legos. Start
              monetizing your creations instantly.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-16 col-span-1 xl:mt-0">
            <div>
              <h3 className="text-base font-medium text-gray-900">PAGES</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.pages.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">COMMUNITY</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.community.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">MORE</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.more.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center sm:text-left">
            &copy; 2022 Algovera, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
