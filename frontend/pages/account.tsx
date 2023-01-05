import { useEffect, useRef, useState, Fragment } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Link from "next/link";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import Spinner from "../components/spinner";
import { Dialog, Transition } from "@headlessui/react";
import { useUser } from "@auth0/nextjs-auth0/client";

type apiKey = {
  id: string;
  createdAt: string;
  expiresAt: string;
};

const Account: NextPage<PageProps> = ({
  uid,
  credits,
  hasAccess,
  walletAddress,
}) => {
  const toastId = useRef<any>(null);
  const [apiKeys, setApiKeys] = useState<apiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    getApiKeys();
  }, [uid]);

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

  const getApiKeys = async () => {
    if (uid) {
      // list api keys under user doc in firestore
      const docRef = doc(db, "users", uid);
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
    setLoading(true);
    const res = await fetch(
      // "http://localhost:5001/sdxcrypto-algovera/us-central1/createApiKey",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createApiKey",
      {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
        }),
      }
    );
    const data = await res.json();
    console.log("got api key", data);
    setNewKey(data.apiKey);
    setShowModal(true);
    getApiKeys();
    setLoading(false);
  };

  const deleteApiKey = async (apiKey: apiKey) => {
    const res = await fetch(
      // "http://localhost:5001/sdxcrypto-algovera/us-central1/deleteApiKey",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/deleteApiKey",
      {
        method: "POST",
        body: JSON.stringify({
          uid,
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
      <div className="max-w-5xl mx-auto mt-16 p-10 rounded-lg shadow-lg bg-background-darker">
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-center">Account</h2>
        </div>
        {uid ? (
          <>
            <div className="mt-16">
              <div className="font-bold text-xl mb-2">
                {uid?.includes("|siwe|") ? "Wallet Address" : "Email"}
              </div>
              <div className="mb-2">
                {uid?.includes("|siwe|") ? walletAddress : user?.email}
              </div>
            </div>
            <div className="mt-16">
              <div className="font-bold text-xl mb-2">Credits</div>
              <div className="mb-2">{credits}</div>
              <Link
                href="/pricing"
                className="font-medium text-primary-lighter hover:underline cursor-pointer underline"
              >
                Buy More
              </Link>
            </div>
            <div className="mt-16">
              <div className="font-bold text-xl mb-2">Access Pass</div>

              {hasAccess ? (
                <div>
                  <div className="mb-2">Active</div>
                  <Link
                    href="/access"
                    className="font-medium text-primary-lighter hover:underline cursor-pointer underline"
                  >
                    View Perks
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="mb-2">N/A</div>
                  <Link
                    href="/access"
                    className="font-medium text-primary-lighter hover:underline cursor-pointer underline"
                  >
                    Purchase
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-16">
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
                className="mt-2 font-medium text-primary-lighter underline cursor-pointer"
              >
                Create new key{" "}
                {loading ? (
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
