// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("checking status", req.body);

    const headers = { "Content-Type": "application/json" };
    const apiBaseUrl = process.env.API_BASE_URL;

    const url = `${apiBaseUrl}/generate/status`;
    const paramUrl = new URL(url);
    const reqBody = JSON.parse(req.body);
    for (const key in reqBody) {
      paramUrl.searchParams.append(key, reqBody[key]);
    }
    const response = await fetch(paramUrl, {
      method: "GET",
      headers: headers,
    });
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: headers,
    //   body: req.body,
    // });
    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      console.log("status response not ok");
      const data = await response.json();
      console.log(data);
      throw new Error("status response not ok");
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
