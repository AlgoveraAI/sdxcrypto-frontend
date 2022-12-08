import { User } from "./hooks";
import { Contract } from "@ethersproject/contracts";

export type PageProps = {
  user: User;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  creditCost: number | null;
  accessContract: Contract | null;
  accessPassCost: number | null;
  accessCreditsPerMonth: number | null;
  accessSubscriptionLength: number | null;
};
