from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv
import os
import requests

load_dotenv()

creds = credentials.Certificate("firebase-credentials.json")
app = initialize_app(creds, name="sdxcrypto-algovera")
db = firestore.client(app=app)

block_id = "image_upload"
block_config = {
    "name": "Image Upload",
    "dark_icon": "https://cdn-icons-png.flaticon.com/512/4056/4056922.png",
    "light_icon": "https://cdn-icons-png.flaticon.com/512/4056/4056922.png",
    "desc": "Upload an image",
    "endpoint": "",
    "pricing": 0,
    "params": [
        {"id": "img", "name": "Image", "type": "file", "default": ""},
    ],
}

doc_ref = db.collection("block_configs").document(block_id)
doc_ref.set(block_config)
