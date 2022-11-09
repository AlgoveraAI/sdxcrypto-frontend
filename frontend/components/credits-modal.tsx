import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Spinner from "./spinner";

type Props = {
  credits: number;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string;
};

export default function CreditsModal({
  credits,
  creditsModalTrigger,
  setCreditsModalTrigger,
  uid,
}: Props) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [desiredNumCredits, setDesiredNumCredits] = useState(100);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setCreditsModalTrigger(false);
  }

  async function testChargeEvent() {
    // use this instead of buyCredits to locally test the handleChargeEvent firebase function
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
    console.log("buying credits", uid, desiredNumCredits);
    const chargeRes = await fetch(
      // "http://localhost:5001/sdxcrypto-algovera/us-central1/createCharge",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createCharge",
      {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
          credits: desiredNumCredits,
        }),
      }
    );
    const data = await chargeRes.json();
    window.open(data.hosted_url, "_blank", "noopener,noreferrer");
    setLoading(false);
  }

  // if the trigger prop changes, open the modal
  useEffect(() => {
    console.log("credits modal triggered");
    if (creditsModalTrigger) {
      openModal();
    }
  }, [creditsModalTrigger]);

  return (
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
              <Dialog.Panel className="text-gray-300 rounded-lg bg-background border focus:outline-none p-12 sm:p-24">
                <div className="text-white text-3xl">
                  You have {credits} {credits === 1 ? "credit" : "credits"}{" "}
                  remaining
                </div>
                <div className="mt-6">Use credits to generate images.</div>
                <div>{"100 credits = 100 generations = $1"}</div>
                <div className="mt-6 shadow-sm w-full mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 text-left">
                      Credits
                    </label>
                  </div>
                  <div className="sm:flex">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                      <input
                        id="prompt"
                        value={desiredNumCredits}
                        type="number"
                        onChange={(e) =>
                          setDesiredNumCredits(parseInt(e.target.value))
                        }
                        data-lpignore="true"
                        className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-black/[0.3] border-none"
                        placeholder="Abstract 3D octane render, trending on artstation..."
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
                        Buy
                      </span>
                      <span className={loading ? "" : "hidden"}>
                        <Spinner />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="text-center italic text-gray-500 mt-6">
                  Powered by{" "}
                  <a
                    className="underline"
                    href="https://commerce.coinbase.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Coinbase Commerce
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
