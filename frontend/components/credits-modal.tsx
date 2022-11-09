import ReactModal from "react-modal";
import { useState, useEffect } from "react";
import Spinner from "./spinner";

type Props = {
  credits: number;
  trigger: boolean;
  uid: string;
};

ReactModal.setAppElement("#__next");

export default function CreditsModal({ credits, trigger, uid }: Props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [prevTrigger, setPrevTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desiredNumCredits, setDesiredNumCredits] = useState(1);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
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
    if (prevTrigger !== trigger) {
      openModal();
    }
    setPrevTrigger(trigger);
  }, [prevTrigger, trigger]);

  return (
    <ReactModal
      className="text-center text-gray-300 px-12 lg:px-36 py-24 rounded-lg bg-background mx-24 mt-24 border focus:outline-none"
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
    >
      <div className="text-white text-3xl">
        You have {credits} {credits === 1 ? "credit" : "credits"} remaining
      </div>
      <div className="mt-6">Use credits to generate images.</div>
      <div>{"100 credits = 100 generations = $1"}</div>
      <div className="mt-6 shadow-sm w-1/2 mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-500 text-left">
            Number of credits
          </label>
        </div>
        <div className="flex">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="prompt"
              value={desiredNumCredits}
              type="number"
              onChange={(e) => setDesiredNumCredits(parseInt(e.target.value))}
              data-lpignore="true"
              className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-black/[0.3] border-none"
              placeholder="Abstract 3D octane render, trending on artstation..."
            />
          </div>
          <button
            onClick={buyCredits}
            // onClick={testChargeEvent}
            type="button"
            className="relative -ml-px inline-flex items-center space-x-2 border border-none px-6 py-2 text-sm font-medium  hover:bg-primary-darker focus:outline-none bg-primary text-white"
          >
            {/* keep text here when loading to maintain same width */}
            <span className={loading ? "text-transparent" : ""}>Buy</span>
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
    </ReactModal>
  );
}
