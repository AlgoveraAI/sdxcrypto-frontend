import { useEffect, useRef, useState, Fragment, useContext } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Link from "next/link";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import Spinner from "../components/spinner";
import { Dialog, Transition } from "@headlessui/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  UserContext,
  UserContextType,
  AppContext,
  AppContextType,
} from "../lib/contexts";

type apiKey = {
  id: string;
  createdAt: string;
  expiresAt: string;
};

const Account: NextPage<PageProps> = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const userContext = useContext(UserContext) as UserContextType;

  const toastId = useRef<any>(null);
  const [apiKeys, setApiKeys] = useState<apiKey[]>([]);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "active" | "inactive" | "canceled"
  >("inactive");

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    getApiKeys();
    checkSubscription();
  }, [userContext.uid]);

  const closeModal = () => {
    setShowModal(false);
    setNewKey(null);
  };

  const errorToast = (msg: string) => {
    toast.error(msg, {
      position: "bottom-left",
      type: "error",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: ".9rem",
      },
    });
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
  };

  const checkSubscription = async () => {
    if (userContext.uid) {
      const docRef = doc(db, "users", userContext.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data?.stripeSubscription) {
          setSubscriptionStatus(data.stripeSubscription.status);
        }
      }
    }
  };

  const updateSubscription = async () => {
    setSubLoading(true);
    // if active, cancel. if canceled, reactivate
    if (userContext.uid) {
      if (subscriptionStatus === "active") {
        const res = await fetch(
          // "http://localhost:5001/sdxcrypto-algovera/us-central1/cancelStripeSubscription",
          "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/cancelStripeSubscription",
          {
            method: "POST",
            body: JSON.stringify({
              uid: userContext.uid,
              sourceUrl: window.location.href,
            }),
          }
        );
        if (!res.ok) {
          console.error("error cancelling stripe subscription", res);
          errorToast(
            "An error occured while cancelling your subscription. Please try again later."
          );
          return;
        }
        toast.success("Subscription canceled", {
          position: "bottom-left",
        });
        setSubscriptionStatus("canceled");
      } else if (
        subscriptionStatus === "canceled" ||
        subscriptionStatus === "inactive"
      ) {
        const chargeRes = await fetch(
          // "http://localhost:5001/sdxcrypto-algovera/us-central1/createStripeSubscription",
          "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createStripeSubscription",
          {
            method: "POST",
            body: JSON.stringify({
              uid: userContext.uid,
              sourceUrl: window.location.href,
            }),
          }
        );
        if (!chargeRes.ok) {
          console.error("error creating stripe subscription", chargeRes);
          errorToast(
            "An error occured while creating your subscription. Please try again later."
          );
          return;
        }
        const data = await chargeRes.json();
        console.log("got charge data", data);
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
      setSubLoading(false);
    }
  };

  const getApiKeys = async () => {
    if (userContext.uid) {
      // list api keys under user doc in firestore
      const docRef = doc(db, "users", userContext.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.apiKeys) {
            setApiKeys(data.apiKeys);
          } else {
            console.log("No API keys");
          }
        }
      });
    }
  };

  const createApiKey = async () => {
    setApiKeyLoading(true);
    const res = await fetch(
      // "http://localhost:5001/sdxcrypto-algovera/us-central1/createApiKey",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createApiKey",
      {
        method: "POST",
        body: JSON.stringify({
          uid: userContext.uid,
        }),
      }
    );
    const data = await res.json();
    console.log("got api key", data);
    setNewKey(data.apiKey);
    setShowModal(true);
    getApiKeys();
    setApiKeyLoading(false);
  };

  const deleteApiKey = async (apiKey: apiKey) => {
    const res = await fetch(
      // "http://localhost:5001/sdxcrypto-algovera/us-central1/deleteApiKey",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/deleteApiKey",
      {
        method: "POST",
        body: JSON.stringify({
          uid: userContext.uid,
          id: apiKey.id,
        }),
      }
    );
    if (res.status === 200) {
      console.log("deleted api key");
      getApiKeys();
    } else {
      console.error("error deleting api key", res);
      errorToast("Error deleting api key");
    }
  };

  return (
    <div>
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center">Account</h2>
      </div>
      <div className="max-w-5xl mx-auto mt-12 p-10 rounded-lg shadow-lg bg-background-darker">
        {userContext.uid ? (
          <>
            <div className="mt-12">
              <div className="font-bold text-xl mb-2">
                {userContext.uid?.includes("|siwe|")
                  ? "Wallet Address"
                  : "Email"}
              </div>
              <div className="mb-2">
                {userContext.uid?.includes("|siwe|")
                  ? userContext.walletAddress
                  : user?.email}
              </div>
            </div>
            <div className="mt-12">
              <div className="font-bold text-xl mb-2">Credits</div>
              <div className="mb-2">{userContext.credits}</div>
              <Link
                href="/pricing"
                className="font-medium primary-button cursor-pointer py-1 px-3 rounded-md"
              >
                Buy More
              </Link>
            </div>
            <div className="mt-12">
              <div className="font-bold text-xl mb-2">Subscription</div>
              <div className="mb-2">
                {subscriptionStatus === "active"
                  ? "Active"
                  : subscriptionStatus === "canceled"
                  ? "Canceled"
                  : "Not Subscribed"}
              </div>
              <div
                onClick={updateSubscription}
                className="font-medium primary-button cursor-pointer py-1 px-3 rounded-md w-fit"
              >
                {subscriptionStatus === "active"
                  ? "Cancel Subscription"
                  : subscriptionStatus === "canceled"
                  ? "Reactivate Subscription"
                  : "Subscribe"}{" "}
                {subLoading ? (
                  <span className="relative ml-6">
                    <Spinner />
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-12">
              <div className="font-bold text-xl mb-2">Access Pass</div>

              {userContext.hasAccess ? (
                <div>
                  <div className="mb-2">Active</div>
                  <Link
                    href="/access"
                    className="font-medium primary-button cursor-pointer py-1 px-3 rounded-md"
                  >
                    View Perks
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="mb-2">Not holding</div>
                  <Link
                    href="/access"
                    className="font-medium primary-button cursor-pointer py-1 px-3 rounded-md"
                  >
                    Purchase
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-12 mb-12">
              <div className="font-bold text-xl mb-2">API Keys</div>
              <div>
                {apiKeys.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2 text-gray-400">ID</th>
                        <th className="text-left p-2 text-gray-400">Created</th>
                        <th className="text-left p-2 text-gray-400">Expires</th>
                        <th className="text-left p-2 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((apiKey) => (
                        <tr key={apiKey.id} className="bg-background">
                          <td className="p-2">{apiKey.id}</td>
                          <td className="p-2">
                            {apiKey.createdAt.split("T")[0]}
                          </td>
                          <td className="p-2">
                            {apiKey.expiresAt.split("T")[0]}
                          </td>
                          <td className="p-2">
                            <button
                              onClick={() => deleteApiKey(apiKey)}
                              className="text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="mb-2">No API keys</div>
                )}
              </div>
              <div
                onClick={createApiKey}
                className="mt-2 font-medium primary-button cursor-pointer py-1 px-3 rounded-md w-fit"
              >
                Create new key{" "}
                {apiKeyLoading ? (
                  <span className="relative ml-6">
                    <Spinner />
                  </span>
                ) : null}
              </div>
            </div>
            <Transition.Root show={showModal} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0 ">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="text-gray-300 rounded-lg bg-background focus:outline-none p-12 sm:p-24">
                        <div className="mt-8">
                          <div className="text-xl mb-2">Your New API Key</div>
                          <div className="bg-background-darker mt-8 font-bold px-4 py-2 text-center text-xl">
                            {newKey}
                          </div>
                        </div>
                        <div className="mt-8">
                          You can only see this key once. Please save it
                          somewhere securely.
                        </div>

                        <button
                          className="mt-8 py-2 px-8 border border-primary-lighter rounded-md"
                          onClick={closeModal}
                        >
                          Got it!
                        </button>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </>
        ) : (
          <div>
            <div className="text-xl mt-16">
              Sign in to view your account details
            </div>
            <div className="mt-8">
              <Link href="/api/auth/login">
                <button className="relative primary-button -ml-px mt-6 w-full md:w-auto md:mt-0 md:inline-flex items-center space-x-2 border border-none px-6 py-2 text-sm font-medium rounded-md">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
