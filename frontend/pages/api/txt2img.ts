// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const baseUrl = "http://3.250.11.166:8501/job/create/txt2img";
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
