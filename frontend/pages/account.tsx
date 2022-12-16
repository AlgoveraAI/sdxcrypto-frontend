import { useEffect, useRef, useState, Fragment } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Link from "next/link";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import Spinner from "../components/spinner";
import { Dialog, Transition } from "@headlessui/react";

const Account: NextPage<PageProps> = ({ uid, credits, hasAccess }) => {
  const toastId = useRef<any>(null);
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
          const keyInfo = docSnap.data().apiKeys;
          // get apiKeyId from each key in keyInfo
          const apiKeyIds = keyInfo.map((key: any) => key.apiKeyId);
          setApiKeys(apiKeyIds);
        }
      });
    }
  };

  const createApiKey = async () => {
    setLoading(true);
    const res = await fetch(
      "http://localhost:5001/sdxcrypto-algovera/us-central1/createApiKey",
      // "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createApiKey",
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

  const deleteApiKey = async (apiKey: string) => {
    const res = await fetch(
      "http://localhost:5001/sdxcrypto-algovera/us-central1/deleteApiKey",
      // "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createApiKey",
      {
        method: "POST",
        body: JSON.stringify({
          uid,
          apiKey,
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
    <div className="bg-background">
      <div className="max-w-5xl mx-auto mt-16 p-10 rounded-lg shadow-lg bg-background-darker">
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-center">Account</h2>
        </div>
        <div className="mt-8">
          <div className="font-bold text-xl mb-2">Credits</div>
          <div>{credits}</div>
        </div>
        <div className="mt-8">
          <div className="font-bold text-xl mb-2">API Key IDs</div>
          <div>
            {apiKeys.map((apiKey) => (
              <div key={apiKey} className="bg-background px-4 py-2 mb-1">
                <span className="inline-block w-1/4 mr-8">{apiKey}</span>
                <span
                  onClick={() => deleteApiKey(apiKey)}
                  className="font-medium text-red-500 hover:underline float-right cursor-pointer"
                >
                  Delete
                </span>
              </div>
            ))}
          </div>
          <div
            onClick={createApiKey}
            className="mt-2 font-medium text-white hover:underline cursor-pointer"
          >
            + Create New key{" "}
            {loading ? (
              <span className="relative ml-6">
                <Spinner />
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          <div className="font-bold text-xl mb-2">Account Management</div>
          <button
            onClick={createApiKey}
            className="flex items-center justify-center rounded-md px-8 py-2 text-sm font-medium text-white border border-red-500"
          >
            Delete Account
          </button>
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
                    You can only see this key once. Please save it somewhere
                    securely.
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
    </div>
  );
};

export default Account;
