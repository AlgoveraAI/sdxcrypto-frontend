// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const config = require("../../config.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("got txt2img request", req.body);
    const baseUrl = `${config.api_base_url}/generate/txt2img`;
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: req.body,
    });
    // const data = await response.json();
    if (response.ok) {
      const job_uuid = response.headers.get("job_uuid");
      console.log("got txt2img response", job_uuid);
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
