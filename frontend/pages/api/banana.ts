// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const banana = require("@banana-dev/banana-dev");

const apiKey = "df57e0ae-ef46-4483-94a1-3e8b2bdd843e";
// const modelKeySD2 = "9416352f-ce72-455f-871f-1ccaf0273e14";
const modelKeySD15 = "b4770acc-f283-4de7-abff-44aba71aad9f";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("running banana dev", req.body);

    var out = await banana.run(apiKey, modelKeySD15, JSON.parse(req.body));

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

    res.status(200).json({
      jobId: out.modelOutputs[0].job_uuid,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error });
  }
}
