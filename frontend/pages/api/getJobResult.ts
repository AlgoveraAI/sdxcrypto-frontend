// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { db, auth, firebaseApp } from "../../lib/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("checking status", req.body);

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
