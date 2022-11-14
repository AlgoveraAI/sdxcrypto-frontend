import { MoralisAuth } from "@moralisweb3/client-firebase-auth-utils";

export type PageProps = {
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
  credits: number | null;
  moralisAuth: MoralisAuth;
  creditsModalTrigger: boolean;
  setCreditsModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};
