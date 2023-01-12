const { execSync } = require("child_process");

export function getCurrentGitBranch() {
  // NB this only works running on the server (e.g. an API route)
  // does not work in the browser!
  const branch = execSync("git branch --show-current").toString().trim();
  return branch;
}

export async function checkJobStatus(jobId: string) {
  // check the status of a job
  const res = await fetch("/api/checkJobStatus", {
    method: "POST",
    body: JSON.stringify({
      job_uuid: jobId,
    }),
  });
  // parse the json
  const data = await res.json();
  console.log("job status:", data);
  if (res.status === 200 && data.job_status) {
    return data.job_status;
    // if (data.job_status === "done") {
    //   // make call to firebase storage to get all images under job
    //   console.log("getting images for jobId", jobId);
    //   const response = await fetch("/api/getJobResult", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       jobId,
    //       uid: userContext.uid,
    //       workflow: "txt2img",
    //     }),
    //   });
    //   const { urls } = await response.json();
    //   setImages(urls);
    // }
  } else {
    // log the error and set job status to error
    // to clear the interval
    return "error";
  }
}
