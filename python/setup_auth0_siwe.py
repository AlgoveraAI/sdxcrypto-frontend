# get client id
import requests

base_url = "https://oidc.login.xyz/register"
body = {"redirect_uris": ["https://dev-g8ax5qcuufebtp03.us.auth0.com/login/callback"]}
headers = {"content-type": "application/json"}

response = requests.post(base_url, json=body)

print(response.json())
