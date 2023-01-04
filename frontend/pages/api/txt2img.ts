// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const config = require("../../config.json");

// TODO protect API route:
// https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#protect-an-api-route

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("got txt2img request", req.body);

    // check git branch
    const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH;

    // get the backend for this env
    let apiBaseUrl;
    if (branch === "main") {
      console.log("using prod backend");
      apiBaseUrl = config.api_base_url;
    } else {
      console.log("using dev backend", branch);
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
        console.log("Invalid job_uuid", job_uuid);
      }
      res.status(200).json({
        jobId: job_uuid,
      });
    } else {
      console.log("txt2img response not ok");
      console.log(response.status);
      console.log(response.statusText);
      try {
        const data = await response.json();
        console.log(data);
        res.status(500).json({ error: data });
      } catch {
        console.log("no json response");
        res
          .status(500)
          .json({ error: `${response.status} (${response.statusText})` });
      }
    }
  } catch (error) {
    console.log("unexpected error", error);
    res.status(500).json({ error: error });
  }
}
