// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const banana = require("@banana-dev/banana-dev");
const config = require("../../config.json");

const apiKey = "df57e0ae-ef46-4483-94a1-3e8b2bdd843e";
// const modelKey = "8bf84735-70bf-4889-ad76-7cca41cdcf40";
const modelKey = "4b74e6d5-eded-44aa-b86a-e79ede353e0e";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("got banana txt2img request", req.body);

    var out = await banana.run(apiKey, modelKey, JSON.parse(req.body));

    // console.log(out);
    // console.log("output[0]", out.modelOutputs[0]);
    console.log(Object.keys(out.modelOutputs[0]));
    // if (response.ok) {
    //   console.log("got txt2img response", data);
    //   res.status(200).json({
    //     jobId: data.job_uuid,
    //   });
    // } else {
    //   console.log("txt2img response not ok");
    //   console.log(data);
    //   throw new Error("txt2img response not ok");
    // }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error });
  }
}
