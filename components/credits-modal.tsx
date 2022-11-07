import ReactModal from "react-modal";
import { useState } from "react";

export default function CreditsModal() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [nCredits, setNCredits] = useState(0);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <ReactModal
      className="text-center text-black px-12 py-24 rounded-lg bg-white mx-24 mt-24 border border-primary focus:outline-none"
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
    >
      <div className="text-primary text-3xl">{nCredits} Credits Remaining</div>
      <br />
      <div className="font-bold">How does the credit system work?</div>
      <div>
        You can use credits to create a new project. Each project costs 1
        credit. You can also use credits to create a new project. Each project
        costs 1 credit.
      </div>
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
