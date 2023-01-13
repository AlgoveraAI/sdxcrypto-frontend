import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/spinner";
import { JobContextType } from "../lib/contexts";
// create a hook that monitors a jobId and returns the status
// and raises warnings if it takes too long using toast

export const useJobStatus = (jobContext: JobContextType) => {
  const toastId = useRef<any>(null);

  const [checkTimeTakenInterval, setCheckTimeTakenInterval] =
    useState<any>(null);

  let warningToastId: any | null = null;
  let startTime: number;
  const maxTime = 30 * 1000; // 30 seconds

  const checkTimeTaken = (startTime: any) => {
    // once the time passes the threshold
    // show a warning toast
    // once it's been shown, stop checking and dont show again
    console.log("checking time taken");
    if (!warningToastId) {
      const timeTaken = Date.now() - startTime;
      console.log("timeTaken:", timeTaken);
      if (timeTaken > maxTime) {
        warningToastId = toast.warning(
          "Sorry, your render is taking longer than expected. Our servers are busy!",
          {
            position: "bottom-left",
            theme: "dark",
            autoClose: false,
          }
        );
        // now that it's over the threshold, stop checking
        clearInterval(checkTimeTakenInterval);
      }
    }
  };

  useEffect(() => {
    if (jobContext.status === "started") {
      // create a toast notification
      toastId.current = toast("Starting job", {
        position: "bottom-left",
        autoClose: false,
        closeOnClick: true,
        theme: "dark",
        hideProgressBar: false,
        icon: <Spinner />,
      });

      // start an interval to monitor how long the job takes
      // if it reaches maxTime, raise a warning toast
      startTime = Date.now();
      const interval = setInterval(() => {
        checkTimeTaken(startTime);
      }, 5000); // check every 5 seconds
      setCheckTimeTakenInterval(interval);
    }
  }, [jobContext.status]);

  useEffect(() => {
    if (jobContext.id && jobContext.status === "started") {
      // once a job id is available, clear the starting toast
      // and create a new one to indicate the job is running
      toast.dismiss(toastId.current);
      toastId.current = toast(`Running job`, {
        position: "bottom-left",
        autoClose: false,
        closeOnClick: true,
        theme: "dark",
        hideProgressBar: false,
        icon: <Spinner />,
      });

      const monitorJobInterval = setInterval(async () => {
        const res = await fetch("/api/checkJobStatus", {
          method: "POST",
          body: JSON.stringify({
            job_uuid: jobContext.id,
          }),
        });
        const data = await res.json();
        if (res.status === 200 && data.job_status) {
          jobContext.setStatus(data.job_status);
          if (data.job_status === "done") {
            // stop the intervals
            clearInterval(checkTimeTakenInterval);
            clearInterval(monitorJobInterval);
            // clear toasts
            toast.dismiss();
          }
        } else {
          // log the error and set job status to error
          // to clear the interval
          jobContext.setStatus("error");
        }
      }, 1000);
    }
  }, [jobContext.id]);

  return;
};
