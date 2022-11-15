import { User } from "./hooks";

export type PageProps = {
  user: User;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};
