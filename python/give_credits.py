import os
import requests
from tqdm import tqdm
from firebase_admin import db, initialize_app, firestore, credentials
from dotenv import load_dotenv

# get the wallets that hold a particular token
# and store a number of credits for them in our firebase db
# the frontend can look these up
# alongside the credits associated with their UID (created by moralis)
# TODO combine these databases?

# NOTE
# this require firebase credentials
# download from project settings / service accounts
# and store in firebase-credentials.json
# it also requires an alchemy api key
# store this in a .env file

load_dotenv()

# define the NFT whose holders will get credits
print("Giving credits to holders")
contract = "0x68085453b798adf9c09ad8861e0f0da96b908d81"
network = "polygon-mainnet"
print("Contract: ", contract)
print("Network: ", network)

# define the amount of credits to give
credits = 20
print("Credits: ", credits)

# optionally override existing credits (rather than incrementing)
override = True

# get holders
alchemy_key = os.getenv("ALCHEMY_KEY")
base_url = f"https://{network}.g.alchemy.com/v2/{alchemy_key}"
url = f"{base_url}/getOwnersForCollection?contractAddress={contract}"
response = requests.get(url, headers={"Accept": "application/json"})

if response.status_code == 200:

    holders = response.json()['ownerAddresses']
    print(f"Found {len(holders)} holders")

    # get the database
    creds = credentials.Certificate("firebase-credentials.json")
    app = initialize_app(creds, name="sdxcrypto-algovera")
    db = firestore.client(app=app)

    # update the database with credits for each holder
    for holder in tqdm(holders, "Updating wallet_credits firestore db"):
        doc_ref = db.collection("wallet_credits").document(holder)
        doc = doc_ref.get()
        if doc.exists:
            if override:
                # replace existing credits with new amount
                doc_ref.update({"credits": credits})
            else:
                # increment existing credits
                doc_ref.update({"credits": firestore.Increment(credits)})
        else:
            doc_ref.set({"credits": credits})

else:
    print("Error getting holders")
    print(response.text)