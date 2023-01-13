import { createContext } from "react";
import { Contract } from "@ethersproject/contracts";
import { BaseProvider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
import { WorkflowConfigsType, BlockConfigsType } from "./types";

export interface AppContextType {
  creditsModalTrigger: string | boolean;
  setCreditsModalTrigger: React.Dispatch<
    React.SetStateAction<boolean | string>
  >;
  setFeedbackModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  creditCost: number | null;
  accessPassCost: number | null;
  accessCreditsPerMonth: number | null;
  accessSubscriptionLength: number | null;
  stripeCreditsPerMonth: number | null;
  setHasAccess: React.Dispatch<React.SetStateAction<boolean | null>>;
  workflowConfigs: WorkflowConfigsType;
  blockConfigs: BlockConfigsType;
}

export interface UserContextType {
  uid: string | null;
  credits: number | null;
  hasAccess: boolean | null;
  walletAddress: string | null;
}

export interface Web3ContextType {
  accessContract: Contract | null;
  provider: BaseProvider | null;
  signer: Signer | null;
  networkName: string | null;
}

// each variable in the job context may need to be updated
// by child components, so they are all defined as state
export interface JobContextType {
  id: string | null;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
  status: string | null;
  setStatus: React.Dispatch<React.SetStateAction<string | null>>;
  output: any | null; // could be list, string, etc.
  setOutput: React.Dispatch<React.SetStateAction<any | null>>;
  data: any | null; // for any misc block or workflow specific data
  setData: React.Dispatch<React.SetStateAction<any | null>>;
}

// contexts will be defined in the App component
export const AppContext = createContext<AppContextType | null>(null);
export const UserContext = createContext<UserContextType | null>(null);
export const Web3Context = createContext<Web3ContextType | null>(null);
export const JobContext = createContext<JobContextType | null>(null);
