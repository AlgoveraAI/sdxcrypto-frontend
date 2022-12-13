import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = {
  feedbackModalTrigger: boolean;
  setFeedbackModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string | null;
};

export default function Feedback({
  uid,
  feedbackModalTrigger,
  setFeedbackModalTrigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
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
    setStatus(null);
  }

  async function submit() {
    // get input
    const feedback = document.getElementById("feedback") as HTMLTextAreaElement;
    const feedbackText = feedback.value;
    // get a random docId for the feedback
    const timestamp = new Date();
    const docId =
      timestamp.toString() + (Math.random() + 1).toString(36).substring(7);
    // upload
    const docRef = doc(db, "feedback", docId);
    const docSnap = await getDoc(docRef);
    await setDoc(docRef, {
      feedback: feedbackText,
      user: uid || "anon",
      timestamp: timestamp.toUTCString(),
    });
    setStatus("success");
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

          <div className="fixed inset-0 z-10 overflow-y-auto pt-48">
            <div className="flex justify-center p-4 text-center items-center sm:p-0 max-w-[1200px] mx-auto">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="text-gray-300 rounded-lg bg-background border focus:outline-none px-4 py-12 sm:px-12 w-full sm:w-2/3">
                  <div className="w-full">
                    <div className="text-white text-3xl">Submit Feedback</div>
                    <div className="mt-4">
                      <textarea
                        id="feedback"
                        className="w-full h-50 sm:h-40 p-2 rounded-lg bg-black/[0.3] outline-none"
                        placeholder="Enter your feedback or suggestions..."
                      />

                      <div className="mt-4 text-center sm:text-left">
                        <button
                          className="bg-gradient-to-r from-primary to-primary-lighter text-white font-bold py-2 px-4 rounded hover:brightness-90"
                          onClick={submit}
                        >
                          Submit
                        </button>
                      </div>
                      {
                        // if the status is success, show a success message
                        status === "success" ? (
                          <div className="mt-4 text-primary-lighter">
                            Thanks for your input!
                          </div>
                        ) : null
                      }
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
