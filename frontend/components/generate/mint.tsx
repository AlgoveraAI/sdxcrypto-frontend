import { useState, useEffect } from "react";
import Image from "next/image";
import Spinner from "../spinner";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
const { ethers } = require("ethers");
import { Contract } from "@ethersproject/contracts";
import { User } from "../../lib/hooks";

type Props = {
  selectedModal: string | null;
  jobId: string | null;
  prompt: string;
  user: User;
  images: string[];
};

export default function Mint({
  selectedModal,
  jobId,
  prompt,
  user,
  images,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [networkName, setNetworkName] = useState(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [mintPrice, setMintPrice] = useState(null);
  const [etherscanTxnUrl, setEtherscanTxnUrl] = useState(null);
  const [openseaAssetUrl, setOpenseaAssetUrl] = useState(null);

  const getContract = async () => {
    // get contract address from firebase
    if (networkName) {
      const docRef = doc(db, "contracts", networkName);
      if (docRef) {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            let { address, abi } = data.deployment;
            console.log("Connecting to contract:", address);
            abi = JSON.parse(abi).abi;
            console.log("ABI:", abi);
            const contract = new ethers.Contract(address, abi, user.provider);
            setContract(contract);
            const mintPrice = await contract.MINT_PRICE();
            console.log("Mint price:", mintPrice.toString());
            setMintPrice(mintPrice.toString());
          }
        }
      } else {
        alert(
          "No contract address found for the connected network: " + networkName
        );
      }
    } else {
      console.error("Not connected to metamask");
    }
  };

  const mint = async () => {
    const { signer, provider, account } = user;

    setLoading(true);
    // check we have everything needed to mint
    if (!selectedModal) {
      alert("Please select a model and generate an image first");
      setLoading(false);
      return;
    }
    if (!images.length) {
      alert("Please generate an image first");
      setLoading(false);
      return;
    }
    if (
      networkName === null ||
      provider === null ||
      signer === null ||
      account === null
    ) {
      alert("Please connect your wallet");
      setLoading(false);
      return;
    }
    if (contract === null || mintPrice === null) {
      alert(
        "Could not get contract details for the connected network: " +
          networkName
      );
      setLoading(false);
      return;
    }
    // check the desired name of the NFT
    const name = document.getElementById("name") as HTMLInputElement;
    if (name.value === "") {
      alert("Please enter a name");
      setLoading(false);
      return;
    }
    // check the desired description of the NFT
    const description = document.getElementById(
      "description"
    ) as HTMLInputElement;
    if (description.value === "") {
      alert("Please enter a description");
      setLoading(false);
      return;
    }

    // estimate gas
    const methodSignature = await contract.interface.encodeFunctionData(
      "mint",
      [1]
    );
    const txnParams = {
      to: contract.address,
      value: mintPrice,
      data: methodSignature,
      from: account,
    };
    const gasEstimate = await signer.estimateGas(txnParams);
    console.log("Gas estimate:", gasEstimate.toString());

    // send transaction
    try {
      const txn = await signer.sendTransaction({
        to: contract.address,
        value: mintPrice,
        data: methodSignature,
        gasLimit: gasEstimate,
      });
      console.log("Transaction:", txn);
      // wait for transaction to be mined
      const receipt = await txn.wait();
      console.log("Receipt:", receipt);
      // get the token id
      const tokenId = receipt.events[0].args[2].toString();
      console.log("Token ID:", tokenId);

      // upload the img url (which points at firebase storage)
      // to the nft_images firestore, so that the api can serve it
      // for tokenuri requests
      await setDoc(doc(db, "nft_images", `contract_${tokenId}`), {
        url: images[selectedIdx],
      });

      await setLoading(false);
    } catch (error: any) {
      if (error.message?.includes("user rejected transaction")) {
        console.error("User rejected transaction");
      } else {
        console.error(error);
      }
      setLoading(false);
    }
  };

  // get current network from moralis
  useEffect(() => {
    if (user.provider) {
      getContract();
    }
  }, [user?.provider]);

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-center">Mint Your NFT</h2>
      <div className="mx-auto">
        <label className="block text-sm font-medium text-gray-500">Name</label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="name"
              defaultValue=""
              data-lpignore="true"
              className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-black/[0.3] border-none text-sm"
              placeholder="AI Art #1"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 mx-auto">
        <label className="block text-sm font-medium text-gray-500">
          Description
        </label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="description"
              defaultValue=""
              data-lpignore="true"
              className="block p-2 w-full shadow-sm outline-none sm:text-sm bg-black/[0.3] border-none text-sm"
              placeholder="An AI generated artwork"
            />
          </div>
        </div>
      </div>
      {jobId && images.length ? (
        <Image
          className="mt-6 max-w-full h-auto mx-auto"
          src={images[selectedIdx]}
          alt="Generated Image"
          width={512}
          height={512}
        />
      ) : null}
      <div className="w-full text-center mt-6">
        <button
          onClick={mint}
          type="button"
          className="relative -ml-px mt-6 w-full md:w-auto md:mt-0 md:inline-flex items-center space-x-2 border border-none px-6 py-2 text-sm font-medium  hover:bg-primary-darker focus:outline-none bg-primary text-white"
        >
          <span className={loading ? "text-transparent" : ""}>Mint</span>
          <span className={loading ? "" : "hidden"}>
            <Spinner />
          </span>
        </button>
      </div>
    </div>
  );
}
