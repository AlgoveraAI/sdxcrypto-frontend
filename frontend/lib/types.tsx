export type PageProps = {
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};
