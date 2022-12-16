# get client id
import requests

base_url = "https://oidc.login.xyz/register"
body = {"redirect_uris": ["https://auth.algovera.ai/login/callback"]}
headers = {"content-type": "application/json"}

response = requests.post(base_url, json=body)

print(response.json())
