import Cors from "cors";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import type { NextApiRequest, NextApiResponse } from "next";

// example local call:
// http://localhost:3000/api/nft?address=0xbcc440970714a82192a7d3b37b080c4d8dcadf7f&tokenId=0

// setup cors as per https://github.com/vercel/next.js/blob/canary/examples/api-routes-cors/pages/api/cors.ts
const cors = Cors({
  methods: ["GET"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

interface Request extends NextApiRequest {
  query: {
    address: string;
    tokenId: string;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, cors);
  console.log("got nft request", req.query);
  // get url params
  const { address, tokenId } = req.query;
  if (address !== null && tokenId !== null) {
    // look-up metadata in db
    // this call will raise a firebase error if rules not passed
    const docRef = doc(db, "nft_metadata", address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("got nft metadata", data);
      // check if tokenId exists in metadata
      if (data[tokenId]) {
        // return metadata
        res.status(200).json(data[tokenId]);
      } else {
        // return 404
        res.status(404).json({ error: "Metadata not found" });
      }
    } else {
      console.log("No such document!");
      res.status(404).json({ error: "Document not found" });
    }
  } else {
    res
      .status(404)
      .json({ error: "Invalid request. Send address and tokenId." });
  }
}
