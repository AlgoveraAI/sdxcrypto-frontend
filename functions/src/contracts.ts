const { ethers } = require("ethers");
const { defaultAbiCoder } = ethers.utils;

const signerPrivateKey = process.env.COMMUNITY_SIGNER_PRIVATE_KEY;

exports.genCommunitySignature = async function (req, res) {
  // to mint community art we need a securely generated signature (to prevent bot abuse)
  // to instantiate the signer we need a private key, which is stored on google's secret manager
  // this can only be securely accesses server-side, so it needs to run in a firebase function
  console.log("generating signature", req.body);
  try {
    const { contractAddress, allowlistAddress, balance } = JSON.parse(req.body);
    if (!contractAddress || !allowlistAddress) {
      throw new Error("Missing contractAddress or allowlistAddress");
    }
    // get the signer (this address should be added to the contract as a signer)
    const signer = new ethers.Wallet(signerPrivateKey);
    console.log("signer", signer.address);
    const payload = defaultAbiCoder.encode(
      ["address", "address", "uint256"],
      [contractAddress, allowlistAddress, balance]
    );
    console.log("signing");
    const signature = await signer.signMessage(ethers.utils.arrayify(payload));
    console.log("signature", signature);
    return signature;
  } catch (error) {
    console.log("error", error);
  }
};
