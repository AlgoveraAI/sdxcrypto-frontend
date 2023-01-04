// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const config = require("../../config.json");
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { db, auth, firebaseApp } from "../../lib/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("checking status", req.body);

    const headers = { "Content-Type": "application/json" };
    // check git branch
    const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH;

    // get the backend for this env
    let apiBaseUrl;
    if (branch === "main") {
      console.log("using prod backend");
      apiBaseUrl = config.api_base_url;
    } else {
      console.log("using dev backend");
      apiBaseUrl = config.api_base_url_dev;
    }
    const { workflow, jobId, uid } = JSON.parse(req.body);

    const storage = getStorage(firebaseApp);

    if (workflow === "txt2img") {
      // get and return image url from firebase storage
      const jobDir = `${uid}/images/${jobId}`;
      // list urls in jobDir
      const listResult = await listAll(ref(storage, jobDir));
      const urls = listResult.items.map((item) => getDownloadURL(item));
      Promise.all(urls).then((values) => {
        console.log("urls", values);
        res.status(200).json({ urls: values });
      });
    } else {
      throw new Error("unknown workflow", workflow);
    }
  } catch (error: any) {
    console.log("unexpected error", error);
    try {
      res.status(500).json({ error: error.message });
    } catch {
      res.status(500).json({ unknown_error: error });
    }
  }
}
