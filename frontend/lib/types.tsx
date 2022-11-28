import { User } from "./hooks";
import { Contract } from "@ethersproject/contracts";

export type PageProps = {
  user: User;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  creatorContract: Contract | null;
  creditCost: number | null;
  creatorPassCost: number | null;
  creatorCreditsPerMonth: number | null;
  creatorSubscriptionLength: number | null;
};
