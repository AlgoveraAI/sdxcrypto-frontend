import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  WalletIcon,
  UserIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Spinner from "./spinner";
import { useUser } from "@auth0/nextjs-auth0/client";

type NavProps = {
  setUID: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Nav({ setUID }: NavProps) {
  const [currentPage, setCurrentPage] = useState<null | string>(null);

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  const { user, error, isLoading } = useUser();

  // log user details
  useEffect(() => {
    if (user) {
      console.log("user name", user.name);
      console.log("user email", user.email);
      console.log("user id", user.sub);
      if (user.sub) {
        setUID(user.sub);
      } else {
        console.error("No user id in user object", user);
      }
    } else {
      console.log("user not logged in");
    }
  }, [user]);

  return (
    <Popover className="relative bg-black/[0.3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-gray-100 py-6 md:space-x-10">
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
              {/* Beta tag */}
            </Link>
            <span className="text-primary text-xs font-medium bg-gray-300 rounded-md px-2 ml-4 my-auto py-1 content-center inline-block align-baseline">
              BETA
            </span>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-50  hover:text-gray-500 focus:outline-none">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden space-x-10 md:flex">
            <Link
              href="/workflows"
              className={`text-base font-medium text-gray-50  ${
                currentPage === "/workflows" ? "" : ""
              }`}
            >
              AI Workflows
            </Link>
            <Link
              href="/access"
              className={`text-base font-medium text-gray-50  ${
                currentPage === "/access" ? "" : ""
              }`}
            >
              Access Pass
            </Link>
            <Link
              href="/pricing"
              className={`text-base font-medium text-gray-50  ${
                currentPage === "/pricing" ? "" : ""
              }`}
            >
              Pricing
            </Link>
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button>
                    <UserCircleIcon
                      className="h-6 w-6 flex-shrink-0 text-white bg-transparent outline-none border-none focus:outline-none"
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
                      <div className="overflow-hidden rounded-lg shadow-lg">
                        <div className="relative grid gap-6 bg-gray-900 px-5 py-6 sm:gap-8 sm:p-8">
                          <Link
                            href={
                              user?.sub ? "/api/auth/logout" : "/api/auth/login"
                            }
                            className="text-base font-medium"
                          >
                            <div className="-m-3 flex items-start rounded-lg p-3 cursor-pointer text-white hover:text-gray-400">
                              <WalletIcon
                                className="h-6 w-6 flex-shrink-0 "
                                aria-hidden="true"
                              />
                              <div className="ml-4">
                                {user?.sub ? "Sign Out" : "Sign In"}
                              </div>
                            </div>
                          </Link>
                          {
                            /* only show credits button if signed in */
                            user?.sub ? (
                              <Link
                                className="-m-3 flex items-start rounded-lg p-3 text-white hover:text-gray-400 cursor-pointer"
                                href="/account"
                              >
                                <UserIcon
                                  className="h-6 w-6 flex-shrink-0 "
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium ">
                                    Account
                                  </p>
                                </div>
                              </Link>
                            ) : null
                          }
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </Popover.Group>
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
          className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden z-50"
        >
          <div className="divide-y-0 divide-gray-50 text-center rounded-lg bg-gray-900 text-white shadow-lg">
            <div className="space-y-5 py-5 px-5">
              {user?.sub ? (
                <Link
                  href="/api/auth/logout"
                  className="text-center font-medium cursor-pointer text-gray-50 hover:text-gray-400 bg-black/[0.3] py-5"
                >
                  Sign Out
                </Link>
              ) : (
                <Link
                  href="/api/auth/login"
                  className="text-center font-medium cursor-pointer text-gray-50 hover:text-gray-400 bg-black/[0.3] py-5"
                >
                  Sign In
                </Link>
              )}
              {
                /* only show credits button if signed in */
                user?.sub ? (
                  <Link
                    href="/account"
                    className="block text-center font-medium cursor-pointer text-gray-50 hover:text-gray-400 bg-black/[0.3] py-5"
                  >
                    Account
                  </Link>
                ) : null
              }
              <Link
                href="/workflows"
                className="block text-center font-medium cursor-pointer text-gray-50 hover:text-gray-400 bg-black/[0.3] py-5"
              >
                AI Workflows
              </Link>
              <Link
                href="/access"
                className="block text-center font-medium cursor-pointer text-gray-50 hover:text-gray-400 bg-black/[0.3] py-5"
              >
                Access Pass
              </Link>
              <Link
                href="/pricing"
                className="block text-center font-medium cursor-pointer text-gray-50 hover:text-gray-400 bg-black/[0.3] py-5"
              >
                Pricing
              </Link>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
