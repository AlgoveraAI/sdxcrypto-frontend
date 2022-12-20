import { Contract } from "@ethersproject/contracts";
import { BaseProvider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";

export type PageProps = {
  uid: string | null;
  credits: number | null;
  hasAccess: boolean | null;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<
    React.SetStateAction<boolean | string>
  >;
  setFeedbackModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  creditCost: number | null;
  accessContract: Contract | null;
  accessPassCost: number | null;
  accessCreditsPerMonth: number | null;
  accessSubscriptionLength: number | null;
  provider: BaseProvider | null;
  signer: Signer | null;
  networkName: string | null;
  walletAddress: string | null;
};
