// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const base_url = "http://3.250.11.166:8501/job/status";
    const headers = { "Content-Type": "application/json" };
    const url = new URL(base_url);
    const reqBody = JSON.parse(req.body);
    for (const key in reqBody) {
      url.searchParams.append(key, reqBody[key]);
    }
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    res.status(200).json({
      jobId: data.job_uuid,
      jobStatus: data.job_status,
    });
  } catch (error: any) {
    try {
      res.status(500).json({ error: error.message });
    } catch {
      res.status(500).json({ unknown_error: error });
    }
  }
}
