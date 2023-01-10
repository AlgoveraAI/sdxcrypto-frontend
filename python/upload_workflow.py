from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv
import os
import requests

load_dotenv()

creds = credentials.Certificate("firebase-credentials.json")
app = initialize_app(creds, name="sdxcrypto-algovera")
db = firestore.client(app=app)

workflow_id = "stable-diffusion-image-gen"
workflow_config = {
    "author": "Algovera",
    "available": True,
    "blocks": [
        "ui_prompt",
        "image_generation_stable_diffusion",
        "mint_image",
    ],
    "name": "Mint Stable Diffusion Images",
    "short_desc": "Generate images and optionally mint them as NFTs",
    "long_desc": "Generate images using the latest version of Stable Diffusion. Once you've generated an image you're happy with, you can mint it as an NFT on Ethereum.",
}

doc_ref = db.collection("workflow_configs").document(workflow_id)
doc_ref.set(workflow_config)