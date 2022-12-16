import { useRef, useState } from "react";
import type { NextPage } from "next";
import { PageProps } from "../lib/types";
import Link from "next/link";
import { toast } from "react-toastify";

const Account: NextPage<PageProps> = ({ uid }) => {
  const toastId = useRef<any>(null);

  const errorToast = (msg: string) => {
    toast.error(msg, {
      position: "bottom-left",
      type: "error",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: ".9rem",
      },
    });
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
  };

  const createApiKey = async () => {
    const res = await fetch(
      "http://localhost:5001/sdxcrypto-algovera/us-central1/createApiKey",
      // "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createApiKey",
      {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
        }),
      }
    );
    const data = await res.json();
    console.log("got api key", data);
  };

  const deleteApiKey = async (apiKey: string) => {
    const res = await fetch(
      "http://localhost:5001/sdxcrypto-algovera/us-central1/deleteApiKey",
      // "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/createApiKey",
      {
        method: "POST",
        body: JSON.stringify({
          uid,
          apiKey,
        }),
      }
    );
    if (res.status === 200) {
      console.log("deleted api key");
    } else {
      console.error("error deleting api key", res);
      errorToast("Error deleting api key");
    }
  };

  return (
    <div className="bg-background">
      <button onClick={createApiKey}>Create key</button>
    </div>
  );
};

export default Account;
