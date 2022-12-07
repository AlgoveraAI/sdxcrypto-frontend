// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const config = require("../../config.json");
import { getCurrentGitBranch } from "../../lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("got txt2img request", req.body);

    // check git branch
    const branch = getCurrentGitBranch();

    // get the backend for this env
    let apiBaseUrl;
    if (branch === "main") {
      console.log("using prod backend");
      apiBaseUrl = config.api_base_url;
    } else {
      console.log("using dev backend");
      apiBaseUrl = config.api_base_url_dev;
    }

    const url = `${apiBaseUrl}/generate/txt2img`;
    console.log("calling", url);
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: req.body,
    });
    // throw new Error("test error");
    if (response.ok) {
      // const job_uuid = response.headers.get("job_uuid");
      const data = await response.json();
      const job_uuid = data.job_uuid;
      console.log("got txt2img response", job_uuid);
      if (!job_uuid) {
        console.log();
      }
      res.status(200).json({
        jobId: job_uuid,
      });
    } else {
      console.log("txt2img response not ok");
      const data = await response.json();
      console.log(data);
      throw new Error("txt2img response not ok");
    }
  } catch (error) {
    console.log("unexpected error", error);
    res.status(500).json({ error: error });
  }
}
