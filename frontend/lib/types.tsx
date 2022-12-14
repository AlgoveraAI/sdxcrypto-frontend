import { Contract } from "@ethersproject/contracts";

export type PageProps = {
  uid: string | null;
  credits: number | null;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<
    React.SetStateAction<boolean | string>
  >;
  creditCost: number | null;
  accessContract: Contract | null;
  accessPassCost: number | null;
  accessCreditsPerMonth: number | null;
  accessSubscriptionLength: number | null;
};
