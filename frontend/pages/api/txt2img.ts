// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const config = require("../../config.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const baseUrl = `${config.api_base_url}/job/create/txt2img`;
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: req.body,
    });
    const data = await response.json();
    res.status(200).json({
      jobId: data.job_uuid,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
