import { User } from "./hooks";
import { Contract } from "@ethersproject/contracts";

export type PageProps = {
  user: User;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  creatorContract: typeof Contract | null;
};
