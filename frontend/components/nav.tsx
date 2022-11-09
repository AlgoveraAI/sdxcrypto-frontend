import React, { useEffect, useState } from "react";
import CreditsModal from "../components/credits-modal";
import Link from "next/link";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { signInWithMoralis } from "@moralisweb3/client-firebase-evm-auth";
import { useMoralisAuth } from "../lib/hooks";
import { auth } from "../lib/firebase";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavProps = {
  howitworksRef?: React.RefObject<HTMLDivElement>; // optional (only on index.tsx)
};

export default function Nav({ howitworksRef }: NavProps) {
  const [onHome, setOnHome] = React.useState(true);
  const [creditsModalTrigger, setCreditsModalTrigger] = React.useState(false);
  const [uid, setUid] = useState("");
  const [credits, setCredits] = useState(0);

  const moralisAuth = useMoralisAuth();

  const openCreditsModal = () => {
    setCreditsModalTrigger(!creditsModalTrigger);
  };

  useEffect(() => {
    console.log("checking auth");
    if (moralisAuth) {
      console.log("connected user:", moralisAuth.auth.currentUser);
      if (moralisAuth.auth.currentUser) {
        setUid(moralisAuth.auth.currentUser.uid);
        // const userDoc = await moralisAuth.auth.currentUser.getIdTokenResult();
        // console.log("userDoc:", userDoc);
        // setCredits(userDoc.claims.credits);
        // todo poll this
      }
    }
  }, [moralisAuth, moralisAuth?.auth.currentUser]);

  const handleConnect = async () => {
    // todo: handle signature rejection
    if (moralisAuth) {
      await signInWithMoralis(moralisAuth);
    }
  };

  const handleDisconnect = async () => {
    await auth.signOut();
  };

  useEffect(() => {
    console.log("loading page", window.location.pathname);
    setOnHome(window.location.pathname == "/" ? true : false);
  }, []);

  return (
    <div>
      <CreditsModal credits={credits} trigger={creditsModalTrigger} uid={uid} />
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
                onClick={() => {
                  if (onHome) {
                    howitworksRef?.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  } else {
                    window.location.href = "/";
                  }
                }}
                className="text-base font-medium text-gray-300 hover:text-gray-400 focus:outline-none cursor-pointer"
              >
                How it Works
              </span>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      onClick={() => {
                        window.location.href = "/generate";
                      }}
                      className={classNames(
                        open ? "text-gray-400" : "text-gray-300",
                        "group inline-flex items-center rounded-md text-base font-medium hover:text-gray-400 focus:outline-none"
                      )}
                    >
                      <span>Generate</span>
                    </Popover.Button>
                  </>
                )}
              </Popover>
            </Popover.Group>

            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 text-white ">
              {moralisAuth?.auth?.currentUser && (
                <span
                  className={`cursor-pointer ${
                    !credits
                      ? "text-red-500 hover:text-red-600 "
                      : "text-green-500 hover:text-green-600 "
                  }`}
                  onClick={openCreditsModal}
                >
                  {credits === 0
                    ? "Out of Credits"
                    : credits === 1
                    ? "1 Credit"
                    : `${credits} Credits`}
                </span>
              )}
            </div>

            <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
              {moralisAuth?.auth?.currentUser ? (
                <span
                  onClick={handleDisconnect}
                  className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-solid border-primary px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:text-gray-500 cursor-pointer"
                >
                  Disconnect Wallet
                </span>
              ) : (
                <span
                  onClick={handleConnect}
                  className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-solid border-primary px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:text-gray-500 cursor-pointer"
                >
                  Connect Wallet
                </span>
              )}
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
                  <a
                    href="/generate"
                    className="text-base font-medium text-gray-300 hover:text-gray-400"
                  >
                    Generate
                  </a>
                </div>
                <div>
                  {moralisAuth?.auth?.currentUser ? (
                    <span
                      onClick={handleDisconnect}
                      className="flex w-full items-center justify-center rounded-md border border-solid border-primary px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:text-gray-400"
                    >
                      Disconnect Wallet
                    </span>
                  ) : (
                    <span
                      onClick={handleConnect}
                      className="flex w-full items-center justify-center rounded-md border border-solid border-primary px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:text-gray-400"
                    >
                      Connect Wallet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
