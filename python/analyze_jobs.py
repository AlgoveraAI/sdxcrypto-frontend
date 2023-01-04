import os
import requests
from tqdm import tqdm
from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv
from matplotlib import pyplot as plt
import datetime as dt

load_dotenv(os.getcwd() + "/python/.env")

def analyze():
    # get all the jobs with outputs on firebase
    # return info on how many times each job was run

    creds = credentials.Certificate(os.getenv("FIREBASE_CREDS"))
    app = initialize_app(creds, name="sdxcrypto-algovera")
    db = firestore.client(app=app)

    jobs_ref = db.collection("jobs")
    jobs = jobs_ref.stream()
    jobs = [job.to_dict() for job in jobs]

    print(f"Total number of jobs: {len(jobs)}")

    unique_base_models = set(
        [job["base_model"] for job in jobs if job["base_model"] != "None"]
    )

    print(f"Number of unique base models: {len(unique_base_models)}")

    # print the number of each times each base model was used
    print("Number of times each base model was used:")
    for base_model in unique_base_models:
        count = len([job for job in jobs if job["base_model"] == base_model])
        print(f"{base_model}: {count}")

    # plot the use of each model over time
    uses = []
    for job in jobs:
        if "time_created" in job:
            # convert timestampt in format 'xxxx.xxxxx' to datetime string
            timestamp = job["time_created"].split(".")[0]
            timestamp = dt.datetime.fromtimestamp(int(timestamp))
            uses.append(
                {
                    "base_model": job["base_model"],
                    "time_created": timestamp,
                }
            )

    # plot the number of uses of each model over time
    for base_model in unique_base_models:
        model_uses = [use for use in uses if use["base_model"] == base_model]
        model_uses = sorted(model_uses, key=lambda x: x["time_created"])
        x = [use["time_created"] for use in model_uses]
        y = [i for i in range(len(model_uses))]

        # make it cumulative
        y = [sum(y[:i]) for i in range(len(y))]

        plt.plot(x, y, label=base_model)

    # add label to legend outside the plot area
    plt.legend(bbox_to_anchor=(1.05, 1), loc="upper left", borderaxespad=0.0)

    # rotate xticks to make them readable
    plt.xticks(rotation=45)
