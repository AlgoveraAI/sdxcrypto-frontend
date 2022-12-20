type Props = {
  setFeedbackModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FeedbackButton({ setFeedbackModalTrigger }: Props) {
  return (
    <div className="flex justify-end w-full py-6">
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-blue-500 hover:brightness-90 rounded-md"
        onClick={() => setFeedbackModalTrigger(true)}
      >
        Feedback
      </button>
    </div>
  );
}
