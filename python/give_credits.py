import os
import requests
from firebase_admin import db
from firebase_admin import firestore
from dotenv import load_dotenv

load_dotenv()

# define the NFT whose holders will get credits
contract = "0x68085453b798adf9c09ad8861e0f0da96b908d81"
network = "polygon-mainnet"

# define the amount of credits to give
credits = 1

# get holders
alchemy_key = os.getenv("ALCHEMY_KEY")
base_url = f"https://{network}.g.alchemy.com/v2/{alchemy_key}"
url = f"{base_url}/getOwnersForCollection?contractAddress={contract}"
response = requests.get(url, headers={"Accept": "application/json"})
holders = response.json()

# get the database
db = firestore.client()

# update the database with credits for each holder
for holder in holders:
    doc_ref = db.collection("users_wallets").document(holder)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update({"credits": firestore.Increment(credits)})
    else:
        doc_ref.set({"credits": credits})
