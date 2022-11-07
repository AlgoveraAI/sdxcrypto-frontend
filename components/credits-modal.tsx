import ReactModal from "react-modal";
import { useState, useEffect } from "react";

type Props = {
  nCredits: number;
  trigger: boolean;
};

ReactModal.setAppElement("#__next");

export default function CreditsModal({ nCredits, trigger }: Props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [prevTrigger, setPrevTrigger] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // if the trigger prop changes, open the modal
  useEffect(() => {
    if (prevTrigger !== trigger) {
      console.log("triggering credits modal");
      openModal();
    }
    setPrevTrigger(trigger);
  }, [trigger]);

  return (
    <ReactModal
      className="text-center text-gray-300 px-12 lg:px-36 py-24 rounded-lg bg-background mx-24 mt-24 border focus:outline-none"
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
    >
      <div className="text-white text-3xl">{nCredits} Credits Remaining</div>
      <br />
      <div className="font-bold">How does the credit system work?</div>
      <div>
        Use credits to generate and mint your own NFTs. Credits can be purchased
        via CoinBase Pay.
      </div>
      <div>1 credit = 1 generation.</div>
      <div className="w-full text-center mt-12">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-darker md:py-3 md:px-8 md:text-lg"
        >
          Buy Credits
        </button>
      </div>
    </ReactModal>
  );
}
