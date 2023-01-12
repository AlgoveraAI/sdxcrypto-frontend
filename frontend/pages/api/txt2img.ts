// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// TODO protect API route:
// https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#protect-an-api-route

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("got txt2img request", req.body);

    const apiBaseUrl = process.env.API_BASE_URL;

    const body = JSON.parse(req.body);

    // custom logic to prep body for endpoint
    const { endpointBody } = body;
    if (endpointBody.model === "dalle") {
      endpointBody.resolution = `${endpointBody.resolution}x${endpointBody.resolution}`;
    }

    console.log("endpointBody", endpointBody);

    const url = `${apiBaseUrl}/generate/${body.endpoint}`;
    console.log("calling", url);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body.endpointBody),
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
