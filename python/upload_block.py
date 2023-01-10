from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv
import os
import requests

load_dotenv()

creds = credentials.Certificate("firebase-credentials.json")
app = initialize_app(creds, name="sdxcrypto-algovera")
db = firestore.client(app=app)

block_id = "image_generation_stable_diffusion"
block_config = {
    "name": "Stable Diffusion Image Generation",
    "dark_icon": "https://firebasestorage.googleapis.com/v0/b/sdxcrypto-algovera.appspot.com/o/frontend%2Fassets%2Ficons%2Fstabilityai.jpg?alt=media&token=771ac1a5-591d-47c2-9edd-64bd3c8fc132",
    "light_icon": "https://firebasestorage.googleapis.com/v0/b/sdxcrypto-algovera.appspot.com/o/frontend%2Fassets%2Ficons%2Fstabilityai.jpg?alt=media&token=771ac1a5-591d-47c2-9edd-64bd3c8fc132",
    "desc": "Generate an image with stable diffusion",
    "endpoint": "openaitxt2img",
    "model_name": "stable",
    "pricing": 2,
    "params": [
        {
            "id": "width",
            "name": "Width",
            "type": "range",
            "params": {
                "min": 128,
                "max": 1024,
                "step": 8,
            },
            "default": 512,
        },
        {
            "id": "height",
            "name": "Height",
            "type": "range",
            "params": {
                "min": 128,
                "max": 1024,
                "step": 8,
            },
            "default": 512,
        },
        {
            "id": "inferenceSteps",
            "name": "Inference Steps",
            "type": "range",
            "params": {
                "min": 0,
                "max": 50,
                "step": 1,
            },
            "default": 25,
            "info": "How many steps to spend generating your image",
        },
        {
            "id": "guidanceScale",
            "name": "Guidance Scale",
            "type": "range",
            "params": {
                "min": 0,
                "max": 50,
                "step": 0.5,
            },
            "default": 7.5,
            "info": "How much the image will be like your prompt",
        },
    ],
}

doc_ref = db.collection("block_configs").document(block_id)
doc_ref.set(block_config)
