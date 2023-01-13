from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv
import os
import requests

load_dotenv()

creds = credentials.Certificate("firebase-credentials.json")
app = initialize_app(creds, name="sdxcrypto-algovera")
db = firestore.client(app=app)

workflow_id = "image-to-image"
workflow_config = {
    "author": "Algovera",
    "available": False,
    "blocks": [
        "image_upload",
        "text_input",
        "image_generation_stable_diffusion",
        "mint_image",
    ],
    "name": "Image to Image",
    "short_desc": "Generate an image from another image and a prompt",
    "long_desc": "Generate an image from another image and a prompt using Stable Diffusion.",
    "env": "dev",
}

doc_ref = db.collection("workflow_configs").document(workflow_id)
doc_ref.set(workflow_config)
