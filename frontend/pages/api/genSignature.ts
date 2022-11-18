const { ethers } = require("ethers");
import type { NextApiRequest, NextApiResponse } from "next";
const { defaultAbiCoder } = ethers.utils;

async function getSignatureCommunity(
  signer: any,
  contractAddress: string,
  allowlistAddress: string,
  sigId: string
) {
  console.log("creating signature");
  const payload = defaultAbiCoder.encode(
    ["address", "address", "string"],
    [contractAddress, allowlistAddress, sigId]
  );
  console.log("signing");
  const signature = await signer.signMessage(ethers.utils.arrayify(payload));
  return signature;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { contractAddress, allowlistAddress } = JSON.parse(req.body);
    if (!contractAddress || !allowlistAddress) {
      throw new Error("Missing contractAddress or allowlistAddress");
    }
    // get a random string to create a unique signature
    // (to allow the same address to mint multiple times)
    const sigId = Math.random().toString(36).substring(7);
    console.log("sigId", sigId);
    // get the signer (this address should be added to the contract as a signer)
    // (should be stored in frontend/.env.local)
    const sk = process.env.COMMUNITY_SIGNER_PRIVATE_KEY;
    if (!sk) {
      throw new Error("Community signer private key not found");
    }
    const signer = new ethers.Wallet(sk);
    console.log("signer", signer.address);
    const signature = await getSignatureCommunity(
      signer,
      contractAddress,
      allowlistAddress,
      sigId
    );
    console.log("signature", signature);
    res.status(200).json({ signature, sigId });
  } catch (error: any) {
    try {
      res.status(500).json({ error: error.message });
    } catch {
      res.status(500).json({ unknown_error: error });
    }
  }
}
