from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv
import os
import requests

load_dotenv()

creds = credentials.Certificate("firebase-credentials.json")
app = initialize_app(creds, name="sdxcrypto-algovera")
db = firestore.client(app=app)

workflow_id = "text-summarization"
workflow_config = {
    "author": "Algovera",
    "available": True,
    "blocks": [
        "text_input",
        "text_summarization",
    ],
    "name": "Text Summarization",
    "short_desc": "Summarize text into a few sentences",
    "long_desc": "Summarize text into a few sentences using GPT-3. You can provide URLs, raw text, or upload a file (e.g. from Google Docs or Notion).",
    "env": "dev",
}

doc_ref = db.collection("workflow_configs").document(workflow_id)
doc_ref.set(workflow_config)
