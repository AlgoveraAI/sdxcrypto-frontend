import React, { useEffect, FC } from "react";
import Link from "next/link";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MusicalNoteIcon,
  DocumentTextIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import PropTypes from "prop-types";

const resources = [
  {
    name: "Images",
    description: "Generate images using our custom Stable Diffusion pipeline.",
    href: "/generate",
    icon: PaintBrushIcon,
  },
  {
    name: "Text",
    description: "Use GPT-3 to generate text from any prompt.",
    href: "/generate",
    icon: DocumentTextIcon,
  },
  {
    name: "Audio",
    description: "Create original audio using the XYZ algorithm.",
    href: "/generate",
    icon: MusicalNoteIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavProps = {
  howitworksRef?: React.RefObject<HTMLDivElement>; // optional (only on index.tsx)
};

export default function Nav({ howitworksRef }: NavProps) {
  return (
    <Popover className="relative bg-black/[0.3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <span className="sr-only">Algovera</span>
              <Image
                // className="h-8 w-auto sm:h-10"
                src={require("../assets/algovera.svg")}
                alt=""
                width={200}
                height={100}
              />
            </Link>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-gray-400 focus:outline-none">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden space-x-10 md:flex">
            <a
              href="#"
              className="text-base font-medium text-gray-300 hover:text-gray-400 focus:outline-none"
            >
              About Us
            </a>
            <span
              onClick={() =>
                howitworksRef?.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-base font-medium text-gray-300 hover:text-gray-400 focus:outline-none cursor-pointer"
            >
              How it Works
            </span>

            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? "text-gray-400" : "text-gray-300",
                      "group inline-flex items-center rounded-md text-base font-medium hover:text-gray-400 focus:outline-none"
                    )}
                  >
                    <span>Create</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? "text-gray-400" : "text-gray-300",
                        "ml-2 h-5 w-5 group-hover:text-gray-400"
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-gray-900 px-5 py-6 sm:gap-8 sm:p-8">
                          {resources.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-800"
                            >
                              <item.icon
                                className="h-6 w-6 flex-shrink-0 text-gray-500"
                                aria-hidden="true"
                              />
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-300">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </Popover.Group>

          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <a
              href="#"
              className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-solid border-primary px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:text-gray-500"
            >
              Connect Wallet
            </a>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="space-y-6 py-6 px-5">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <a
                  href="#"
                  className="text-base font-medium text-gray-300 hover:text-gray-400"
                >
                  About Us
                </a>

                <a
                  href="#"
                  className="text-base font-medium text-gray-300 hover:text-gray-400"
                >
                  How it works
                </a>
                {resources.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-gray-300 hover:text-gray-400"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div>
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md border border-solid border-primary px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:text-gray-400"
                >
                  Connect Wallet
                </a>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

// export default Nav;
