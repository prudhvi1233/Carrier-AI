import requests
import json

base_url = "http://127.0.0.1:8000/api/v1"

# 1. Login to get token
res = requests.post(f"{base_url}/auth/login", json={
    "email": "test@example.com",
    "password": "password123"
})
if res.status_code != 200:
    print("Login failed, trying to register...")
    requests.post(f"{base_url}/auth/register", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "password": "password123"
    })
    res = requests.post(f"{base_url}/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })

token = res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("\n1. Fetching Profile...")
res = requests.get(f"{base_url}/profile", headers=headers)
print(res.status_code, res.text)

print("\n2. Creating/Updating Profile...")
res = requests.post(f"{base_url}/profile", headers=headers, json={
    "full_name": "John Tester",
    "college": "MIT",
    "degree": "B.S. Computer Science",
    "linkedin_url": "https://linkedin.com/in/test"
})
if res.status_code == 409:
    print("Profile exists, updating instead...")
    res = requests.put(f"{base_url}/profile", headers=headers, json={
        "full_name": "John Tester Updated",
        "college": "MIT",
        "degree": "B.S. Computer Science",
        "linkedin_url": "https://linkedin.com/in/test_updated"
    })
print(res.status_code, res.text)

print("\n3. Uploading dummy resume...")
with open("test.pdf", "wb") as f:
    f.write(b"dummy pdf content")
with open("test.pdf", "rb") as f:
    res = requests.post(f"{base_url}/resume/upload", headers=headers, files={"file": ("test.pdf", f, "application/pdf")})
print(res.status_code, res.text)

print("\n4. Getting Resumes...")
res = requests.get(f"{base_url}/resume", headers=headers)
print(res.status_code, res.text)

print("\n5. Testing invalid file type...")
with open("test.txt", "wb") as f:
    f.write(b"dummy txt content")
with open("test.txt", "rb") as f:
    res = requests.post(f"{base_url}/resume/upload", headers=headers, files={"file": ("test.txt", f, "text/plain")})
print(res.status_code, res.text)
