import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { User } from "../lib/hooks";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = {
  user: User;
  feedbackModalTrigger: boolean;
  setFeedbackModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Feedback({
  user,
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
      user: user?.uid || "anon",
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
                <Dialog.Panel className="text-gray-300 rounded-lg bg-background border focus:outline-none px-4 py-12 sm:px-12 w-full sm:w-2/3">
                  <div className="w-full">
                    <div className="text-white text-3xl">Submit Feedback</div>
                    <div className="mt-4">
                      <textarea
                        id="feedback"
                        className="w-full h-50 sm:h-40 p-2 rounded-lg bg-background border border-gray-500 outline-none"
                        placeholder="Enter your feedback or suggestions..."
                      />

                      <div className="mt-4 text-center sm:text-left">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                          onClick={submit}
                        >
                          Submit
                        </button>
                      </div>
                      {
                        // if the status is success, show a success message
                        status === "success" ? (
                          <div className="mt-4 text-green-500">
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
