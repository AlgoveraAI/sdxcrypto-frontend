// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const config = require("../../config.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const baseUrl = `${config.api_base_url}/job/status`;
    const headers = { "Content-Type": "application/json" };
    const paramUrl = new URL(baseUrl);
    const reqBody = JSON.parse(req.body);
    for (const key in reqBody) {
      paramUrl.searchParams.append(key, reqBody[key]);
    }
    const response = await fetch(paramUrl, {
      method: "GET",
      headers: headers,
      // body: req.body,
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    try {
      res.status(500).json({ error: error.message });
    } catch {
      res.status(500).json({ unknown_error: error });
    }
  }
}
