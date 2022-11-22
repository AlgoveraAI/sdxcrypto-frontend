import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Spinner from "./spinner";
import { User } from "../lib/hooks";

type Props = {
  user: User;
  feedbackModalTrigger: boolean;
  setFeedbackModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Feedback({
  feedbackModalTrigger,
  setFeedbackModalTrigger,
  user,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desiredNumCredits, setDesiredNumCredits] = useState(100);

  // if the trigger prop changes, open the modal
  useEffect(() => {
    if (feedbackModalTrigger) {
      openModal();
    }
  }, [feedbackModalTrigger]);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setFeedbackModalTrigger(false);
  }

  async function submit() {
    // store feedback in firestore
    
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
            <div className="flex min-h-full justify-center p-0 text-center items-center sm:p-0 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="text-gray-300 rounded-lg bg-background border focus:outline-none p-0 sm:p-24">
                  <div className="flex flex-col items-center">
                    <Dialog.Title className="text-2xl font-bold">
                      Submit Feedback
                    </Dialog.Title>
                    <div className="mt-4">
                      <textarea
                        className="w-full h-40 p-2 rounded-lg bg-background border border-gray-500"
                        placeholder="Enter your feedback or suggestions..."
                      />

                      <div className="flex flex-row justify-between mt-4">
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                          onClick={submit}
                        >
                          Submit
                        </button>

                          </div>
                          </div>
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
