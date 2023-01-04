// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const config = require("../../config.json");
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { db, auth, firebaseApp } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("getting prior generations", req.body);

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
    const { uid, modality } = JSON.parse(req.body);

    const storage = getStorage(firebaseApp);
    const userDir = `${uid}/${modality}`;
    const jobIds = (await listAll(ref(storage, userDir))).prefixes;
    // console.log("job ids", jobIds);

    let results: object[] = [];

    if (modality === "images") {
      // get all images under all job ids
      for (const jobId of jobIds) {
        const jobDir = `${userDir}/${jobId.name}`;
        const jobImages = await listAll(ref(storage, jobDir));
        const urls = jobImages.items
          .filter((item) => item.name.endsWith(".jpg"))
          .map((item) => getDownloadURL(item));
        const imgUrls = await Promise.all(urls);
        // get settings of the job (from firestore)
        const docRef = doc(db, "jobs", jobId.name);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          results.push({
            jobId: jobId.name,
            settings: data,
            urls: imgUrls,
          });
        }
      }
    } else {
      throw new Error("Unexpected modality " + modality);
    }
    // return the results
    res.status(200).json({ results: results });
  } catch (error: any) {
    console.log("unexpected error", error);
    try {
      res.status(500).json({ error: error.message });
    } catch {
      res.status(500).json({ unknown_error: error });
    }
  }
}
