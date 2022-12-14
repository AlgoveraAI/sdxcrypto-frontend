import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Spinner from "./spinner";
import { toast } from "react-toastify";

type Props = {
  uid: string | null;
  credits: number | null;
  creditsModalTrigger: boolean | string;
  setCreditsModalTrigger: React.Dispatch<
    React.SetStateAction<boolean | string>
  >;
};

export default function CreditsModal({
  uid,
  credits,
  creditsModalTrigger,
  setCreditsModalTrigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desiredNumCredits, setDesiredNumCredits] = useState(100);
  const [creditCost, setCreditCost] = useState<number | null>(null);

  // if the trigger prop changes, open the modal
  useEffect(() => {
    if (creditsModalTrigger) {
      openModal();
    }
  }, [creditsModalTrigger]);

  function openModal() {
    if (uid) {
      setOpen(true);
    } else {
      if (creditsModalTrigger === "crypto") {
        error("Please connect wallet to purchase credits");
      } else {
        error("Please sign in to purchase credits");
      }
      setCreditsModalTrigger(false);
    }
  }

  async function closeModal() {
    await setOpen(false);
    setLoading(false);
    setCreditsModalTrigger(false);
  }

  const error = (msg: string) => {
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

  async function testChargeEvent() {
    // use this to locally test the handleChargeEvent firebase function
    // (it mimics the event that Coinbase sends once a txn is executed)
    // (run firebase serve in the functions folder to activate the endpoint)
    setLoading(true);
    const res = await fetch(
      "http://localhost:5001/sdxcrypto-algovera/us-central1/testChargeEvent",
      {
        method: "POST",
        body: JSON.stringify({
          event: {
            type: "charge:confirmed",
            data: {
              id: "test_id",
              code: "test_code",
              created_at: "test_created_at",
              metadata: {
                uid: uid,
                credits: desiredNumCredits,
              },
            },
          },
        }),
      }
    );
    const data = await res.json();
    console.log("testChargeEvent result:", data);
    setLoading(false);
  }

  async function buyCredits() {
    // make call to next api
    setLoading(true);
    console.log("buying credits", creditsModalTrigger, uid, desiredNumCredits);

    if (desiredNumCredits < 50) {
      error("Minimum purchase is 50 credits");
      setDesiredNumCredits(50);
      setLoading(false);
      return;
    }

    if (creditsModalTrigger === "crypto") {
      const chargeRes = await fetch(
        // "http://localhost:5001/sdxcrypto-algovera/us-central1/createCoinbaseCharge",
        "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createCoinbaseCharge",
        {
          method: "POST",
          body: JSON.stringify({
            uid: uid,
            credits: desiredNumCredits,
          }),
        }
      );
      const data = await chargeRes.json();
      console.log("got charge data", data);
      window.open(data.hosted_url, "_blank", "noopener,noreferrer");
    } else {
      // creditcard (stripe)
      const chargeRes = await fetch(
        // "http://localhost:5001/sdxcrypto-algovera/us-central1/createStripeCharge",
        "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createStripeCharge",
        {
          method: "POST",
          body: JSON.stringify({
            uid: uid,
            credits: desiredNumCredits,
          }),
        }
      );
      const data = await chargeRes.json();
      console.log("got charge data", data);
      window.open(data.url, "_blank", "noopener,noreferrer");
    }

    setLoading(false);
  }

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
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
                  <div className="text-white text-3xl">
                    You have {credits ? credits : 0}{" "}
                    {credits === 1 ? "credit" : "credits"} remaining
                  </div>
                  {creditCost !== null ? (
                    <div>100 credits costs ${creditCost * 100} USD</div>
                  ) : null}
                  <div className="mt-6 shadow-sm w-full mx-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 text-left">
                        Purchase Credits
                      </label>
                    </div>
                    <div className="sm:flex mt-1">
                      <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <input
                          id="credits-modal"
                          value={desiredNumCredits}
                          type="number"
                          min="50"
                          onChange={(e) =>
                            setDesiredNumCredits(parseInt(e.target.value))
                          }
                          data-lpignore="true"
                          className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-background-darker border-none"
                          placeholder="Amount (min 50)"
                        />
                      </div>
                      <button
                        onClick={buyCredits}
                        // onClick={testChargeEvent}
                        type="button"
                        className="relative -ml-px space-x-2 border border-none px-6 py-2 text-sm font-medium  hover:bg-primary-darker focus:outline-none bg-primary text-white w-full sm:w-auto text-center"
                      >
                        {/* keep text here when loading to maintain same width */}
                        <span className={loading ? "text-transparent" : ""}>
                          {creditsModalTrigger === "crypto"
                            ? "Pay with Crypto"
                            : "Pay with Credit Card"}
                        </span>
                        <span className={loading ? "" : "hidden"}>
                          <Spinner />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="text-center italic text-gray-500 mt-6">
                    Powered by{" "}
                    {creditsModalTrigger === "crypto" ? (
                      <a
                        className="underline"
                        href="https://commerce.coinbase.com/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Coinbase Commerce
                      </a>
                    ) : (
                      <a
                        className="underline"
                        href="https://stripe.com/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Stripe
                      </a>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
