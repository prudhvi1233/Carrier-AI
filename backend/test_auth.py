import requests
import json

base_url = "http://127.0.0.1:8000/api/v1/auth"

print("1. Registering user...")
res = requests.post(f"{base_url}/register", json={
    "full_name": "John Doe",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123"
})
print(res.status_code, res.text)

print("\n2. Logging in...")
res = requests.post(f"{base_url}/login", json={
    "email": "test@example.com",
    "password": "password123"
})
print(res.status_code, res.text)
if res.status_code == 200:
    token = res.json()["access_token"]
    print("\n3. Fetching /me...")
    res = requests.get(f"{base_url}/me", headers={"Authorization": f"Bearer {token}"})
    print(res.status_code, res.text)
