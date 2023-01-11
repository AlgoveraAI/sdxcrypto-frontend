from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv
import os
import requests

load_dotenv()

creds = credentials.Certificate("firebase-credentials.json")
app = initialize_app(creds, name="sdxcrypto-algovera")
db = firestore.client(app=app)

block_id = "text_input"
block_config = {
    "name": "Text Input",
    "dark_icon": "https://cdn-icons-png.flaticon.com/512/4056/4056922.png",
    "light_icon": "https://cdn-icons-png.flaticon.com/512/4056/4056922.png",
    "desc": "Text input",
    "endpoint": "",
    "pricing": 0,
    "params": [
        {"id": "text", "name": "Text", "type": "text", "default": ""},
    ],
}

doc_ref = db.collection("block_configs").document(block_id)
doc_ref.set(block_config)
