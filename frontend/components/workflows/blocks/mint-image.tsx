import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Spinner from "../../spinner";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
const { ethers } = require("ethers");
import { Contract } from "@ethersproject/contracts";
import { toast } from "react-toastify";
import {
  AppContext,
  AppContextType,
  UserContext,
  UserContextType,
  Web3Context,
  Web3ContextType,
  JobContext,
  JobContextType,
} from "../../../lib/contexts";
import { BlockConfigType } from "../../../lib/types";

export default function Mint({ config }: { config: BlockConfigType }) {
  const appContext = useContext(AppContext) as AppContextType;
  const userContext = useContext(UserContext) as UserContextType;
  const jobContext = useContext(JobContext) as JobContextType;
  const web3Context = useContext(Web3Context) as Web3ContextType;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [contract, setContract] = useState<Contract | null>(null);
  const [openseaAssetUrl, setOpenseaAssetUrl] = useState<string | null>(null);
  const [etherscanTxnUrl, setEtherscanTxnUrl] = useState<string | null>(null);

  const getContract = async () => {
    // get contract address from firebase
    if (web3Context.provider && web3Context.networkName) {
      const docRef = doc(db, "contracts", web3Context.networkName);
      if (docRef) {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.community) {
            // get the latest Community.sol deployment
            // on the conencted network
            let { address, abi } = JSON.parse(data.community);
            console.log("Connecting to contract:", address);
            console.log("ABI:", abi);
            const contract = new ethers.Contract(
              address,
              abi,
              web3Context.provider
            );
            setContract(contract);
          } else {
            console.error(
              "No Community contract on the connected network: " +
                web3Context.networkName
            );
          }
        }
      } else {
        console.error(
          "No Community contract on the connected network: " +
            web3Context.networkName
        );
      }
    } else {
      console.error("Not connected to metamask");
    }
  };

  const errorToast = (msg: string) => {
    toast(msg, {
      position: "bottom-left",
      type: "error",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: ".9rem",
      },
    });
    setLoading(false);
    setStatus(null);
  };

  useEffect(() => {
    getContract();
  }, [web3Context.provider, web3Context.networkName]);

  const mint = async () => {
    try {
      if (status === "Mint successful!") {
        errorToast("You already minted this image!");
        return;
      }
      setLoading(true);
      setStatus("Preparing transaction");
      // check we have everything needed to mint
      if (!jobContext.output.length) {
        errorToast("No image to mint");
        return;
      }
      if (
        web3Context.networkName === null ||
        web3Context.provider === null ||
        web3Context.signer === null ||
        userContext.walletAddress === null
      ) {
        errorToast("Connect to Metamask to mint");
        return;
      }
      if (contract === null) {
        errorToast("No contract found");
        return;
      }
      // check the desired name of the NFT
      const name = document.getElementById("name") as HTMLInputElement;
      if (name.value === "") {
        errorToast("Enter a name for your NFT!");
        return;
      }
      // check the desired description of the NFT
      const description = document.getElementById(
        "description"
      ) as HTMLInputElement;
      if (description.value === "") {
        errorToast("Enter a description for your NFT!");
        return;
      }
      // generate a signature
      console.log("Generating signature");
      const balance = await contract.balanceOf(userContext.walletAddress);
      const resp = await fetch(
        // "http://127.0.0.1:5001/sdxcrypto-algovera/us-central1/genCommunitySignature",
        "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/genCommunitySignature",
        {
          method: "POST",
          body: JSON.stringify({
            allowlistAddress: userContext.walletAddress,
            contractAddress: contract.address,
            balance: balance,
          }),
        }
      );
      // check the response is ok
      if (!resp.ok) {
        errorToast("Error generating signature");
        console.error(await resp.text());
        return;
      }
      const signature = await resp.text();
      console.log("signature:", signature);
      // estimate gas
      const methodSignature = await contract.interface.encodeFunctionData(
        "mint",
        [signature]
      );
      const txnParams = {
        to: contract.address,
        value: 0, // all Community art mints are free
        data: methodSignature,
        from: userContext.walletAddress,
      };
      const gasEstimate = await web3Context.signer.estimateGas(txnParams);
      console.log("Gas estimate:", gasEstimate.toString());
      // send transaction
      try {
        setStatus("Awaiting signature");
        const txn = await web3Context.signer.sendTransaction({
          to: contract.address,
          value: 0, // all Community art mints are free
          data: methodSignature,
          gasLimit: gasEstimate,
        });
        console.log("Transaction:", txn);
        // wait for transaction to be mined
        setStatus("Transaction executing");
        const receipt = await txn.wait();
        console.log("Receipt:", receipt);
        setStatus("Mint successful!");
        // get the token id from the emitted event
        const tokenId = parseInt(receipt.logs[0].topics[3], 16);
        const metadata = {
          name: name.value,
          description: description.value,
          image: jobContext.output[selectedIdx],
          attributes: {
            model: config.modalName,
          },
        };
        // upload metadata to firebase
        // add field to nft_metadata/address document
        const docRef = doc(db, "nft_metadata", contract.address);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          // create doc if it doesn't exist
          await setDoc(docRef, {
            [tokenId]: metadata,
          });
        } else {
          // update doc if it does exist
          await updateDoc(docRef, {
            [tokenId]: metadata,
          });
        }
        // get opensea url
        let openseaUrl = "";
        if (
          web3Context.networkName === "mainnet" ||
          web3Context.networkName === "homestead"
        ) {
          openseaUrl = "https://opensea.io/assets/";
        } else {
          openseaUrl = "https://testnets.opensea.io/assets/";
        }
        setOpenseaAssetUrl(
          openseaUrl + contract.address + "/" + tokenId.toString()
        );
        await setLoading(false);
      } catch (error: any) {
        if (error.message?.includes("user rejected transaction")) {
          console.error("User rejected transaction");
          setStatus(null);
        } else {
          console.error(error);
        }
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setStatus(null);
      setLoading(false);
    }
  };

  return (
    <div className="mb-12">
      {/* <h2 className="mb-6 text-3xl font-bold text-center">Mint Your NFT</h2> */}
      <div className="mx-auto">
        <label className="block text-sm font-medium text-gray-500">Name</label>
        <div className="mt-1 flex shadow-sm ">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              id="name"
              defaultValue=""
              data-lpignore="true"
              className="block p-2 w-full shadow-sm sm:text-sm outline-none bg-background-darker border-none text-sm"
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
              defaultValue={jobContext.data.prompt}
              data-lpignore="true"
              className="block p-2 w-full shadow-sm outline-none sm:text-sm bg-background-darker border-none text-sm"
              placeholder="An AI generated artwork"
            />
          </div>
        </div>
      </div>
      {jobContext.id && jobContext.output.length ? (
        <Image
          className="mt-6 max-w-full h-auto mx-auto"
          src={jobContext.output[selectedIdx]}
          alt="Generated Image"
          width={512}
          height={512}
        />
      ) : null}
      {contract ? (
        <div className="w-full text-center mt-6">
          <button
            onClick={mint}
            type="button"
            className="relative primary-button -ml-px mt-6 w-full md:w-auto md:mt-0 md:inline-flex items-center space-x-2 px-6 py-2 text-sm font-medium rounded-md"
          >
            <span className={loading ? "text-transparent" : ""}>Mint</span>
            <span className={loading ? "" : "hidden"}>
              <Spinner />
            </span>
          </button>
          {status ? (
            <div>
              <p className="mt-2 text-sm text-gray-500">{status}</p>
              <p className="mt-0 text-sm text-gray-500">
                {openseaAssetUrl ? (
                  <a
                    className="underline"
                    href={openseaAssetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on OpenSea
                  </a>
                ) : (
                  <span>{"Please keep the page open"}</span>
                )}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
