import requests

base_url = "http://3.250.11.166:8501/job/create/txt2img"
headers = {"Content-Type": "application/json"}
body = {
    "uid": "0xfdad2c16a5c3551856337ca415455562683e78f6c487c8046c89e350e4435828",
    "prompt": "cat"
}

response = requests.post(base_url, headers=headers, json=body)

print(response.text)
job_uuid = response.json()["job_uuid"]
job_uuid = "56c7fbff7d0d49f68d91d765f23f6ed7"

base_url = "http://3.250.11.166:8501/job/status?job_uuid=" + job_uuid
response = requests.get(base_url, headers=headers)

print(response.text)