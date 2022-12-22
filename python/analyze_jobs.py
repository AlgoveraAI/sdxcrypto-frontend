import os
import requests
from tqdm import tqdm
from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv

load_dotenv(os.getcwd() + "/python/.env")

creds = credentials.Certificate(os.getenv("FIREBASE_CREDS"))
app = initialize_app(creds, name="sdxcrypto-algovera")
db = firestore.client(app=app)


def analyze():
    # get all the jobs with outputs on firebase
    # return info on how many times each job was run

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
    # TODO jobs need timestamps
    uses = []
    for job in jobs:
        uses.append(
            {
                "base_model": job["base_model"],
                "timestamp": job["timestamp"],
            }
        )