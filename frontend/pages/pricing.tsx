import { useRef, useState, useContext, useEffect } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Link from "next/link";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import {
  UserContext,
  UserContextType,
  AppContext,
  AppContextType,
} from "../lib/contexts";

const paymentOptions = {
  fiat: {
    payg: {
      name: "Pay as you go",
      price: ``,
      priceType: "per-credit",
      description: "Pay as you go",
    },
    sub: {
      name: "Subscription",
      price: `$10 USD`,
      priceType: "per-month",
      description: ``,
    },
  },
  crypto: {
    payg: {
      name: "Pay as you go",
      price: ``,
      priceType: "per-credit",
      description: "Pay as you go",
    },
    sub: {
      name: "Access Pass NFT",
      price: ``,
      priceType: "",
      description: ``,
    },
  },
};

const Pricing: NextPage<PageProps> = ({}) => {
  const [loaded, setLoaded] = useState(false);
  const [paymentType, setPaymentType] = useState<"fiat" | "crypto">("fiat");
  const appContext = useContext(AppContext) as AppContextType;
  const userContext = useContext(UserContext) as UserContextType;

  useEffect(() => {
    // update page details with info from remote config
    if (appContext.creditCost) {
      // only display once appContext is populated
      paymentOptions.fiat.payg.price = `${appContext.creditCost} USD`;
      paymentOptions.fiat.sub.description = `${appContext.stripeCreditsPerMonth} credits + perks`;
      paymentOptions.crypto.payg.price = `${appContext.creditCost} USDC`;
      paymentOptions.crypto.sub.price = `${appContext.accessPassCost} ETH`;
      paymentOptions.crypto.sub.description = `${appContext.accessCreditsPerMonth} credits per month + perks`;
      console.log("paymentOptions: ", paymentOptions);
      setLoaded(true);
    }
  }, [appContext]);

  const errorToast = (msg: string) => {
    toast(msg, {
      position: "bottom-left",
      type: "error",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: ".9rem",
      },
    });
  };

  async function fiatSubscription() {
    if (!userContext.uid) {
      errorToast("You must be logged in to subscribe");
      return;
    }

    // check if user is already subscribed
    const docRef = doc(db, "users", userContext.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data()?.stripeSubscription?.status === "active") {
        toast.warning("You are already subscribed!", {
          position: "bottom-left",
        });
        return;
      }
    }

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

  return (
    <div className="bg-background">
      <div className="pt-12 sm:pt-16 lg:pt-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-2 lg:max-w-none">
            <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Flexible plans for any budget and need
            </p>
          </div>
        </div>
      </div>
      {loaded ? (
        <div className="mt-8 pb-12 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24">
          <div id="paymentOptions" className="">
            <div className="flex w-1/2 text-center mx-auto">
              <a
                onClick={() => {
                  setPaymentType("fiat");
                }}
                className={`flex w-full items-center justify-center rounded-md shadow-md border border-primary mx-2 py-3 text-base font-medium text-whites  ${
                  paymentType === "fiat"
                    ? "primary-button"
                    : "bg-background-darker hover:bg-primary hover:text-white cursor-pointer "
                }`}
              >
                Credit Card
              </a>
              <a
                onClick={() => {
                  setPaymentType("crypto");
                }}
                className={`flex w-full items-center justify-center rounded-md shadow-md border border-primary mx-2 py-3 text-base font-medium text-whites ${
                  paymentType === "crypto"
                    ? "primary-button"
                    : "bg-background-darker hover:bg-primary hover:text-white cursor-pointer "
                }`}
              >
                Crypto
              </a>
            </div>
          </div>
          {paymentOptions ? (
            <div className="relative mt-12">
              <div className="absolute inset-0 h-3/4 bg-gray-900" />
              <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md space-y-4 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-5 lg:space-y-0">
                  {Object.entries(paymentOptions[paymentType]).map(
                    ([key, tier]) => (
                      <div
                        key={key}
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
                            {tier.price}
                            <span className="ml-2 text-2xl font-medium tracking-normal text-primary">
                              {tier.priceType}
                            </span>
                          </div>
                          <p className="mt-5 text-lg text-gray-500">
                            {tier.description}
                          </p>
                        </div>
                        <div className="flex flex-1 flex-col justify-between space-y-6 bg-gray-50 px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
                          <div>
                            {tier.name === "Pay as you go" ? (
                              <div className="flex">
                                <a
                                  onClick={() => {
                                    if (paymentType === "fiat") {
                                      if (!userContext.uid) {
                                        errorToast(
                                          "You must be logged in to subscribe"
                                        );
                                        return;
                                      }
                                      appContext.setCreditsModalTrigger(
                                        "creditcard"
                                      );
                                    } else {
                                      if (!userContext.uid) {
                                        errorToast(
                                          "You must be logged in to subscribe"
                                        );
                                        return;
                                      }
                                      appContext.setCreditsModalTrigger(
                                        "crypto"
                                      );
                                    }
                                  }}
                                  className="flex primary-button w-full items-center justify-center rounded-md shadow-md mx-2 py-3 text-base font-medium cursor-pointer"
                                >
                                  Purchase
                                </a>
                              </div>
                            ) : paymentType === "fiat" ? (
                              <button
                                className="flex primary-button items-center justify-center rounded-md shadow-md hover:brightness-90 px-5 py-3 text-base font-medium w-full"
                                onClick={fiatSubscription}
                              >
                                Subscribe
                              </button>
                            ) : (
                              <Link
                                href="/access"
                                className="flex primary-button items-center justify-center rounded-md shadow-md hover:brightness-90 px-5 py-3 text-base font-medium "
                                aria-describedby="tier-standard cursor-pointer"
                              >
                                Read More
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : null}
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
                    Algovera community members who have earned a Reputation
                    Badge get 100 free credits each.
                  </div>
                  <div className="mt-4 text-lg text-gray-600">
                    Holders of particular NFTs also have a chance to win a free
                    Access Pass! <br />
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
      ) : null}
    </div>
  );
};

export default Pricing;
