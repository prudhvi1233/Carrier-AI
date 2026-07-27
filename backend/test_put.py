import httpx
import sys

def main():
    # 1. Login to get token
    res = httpx.post("http://127.0.0.1:8000/api/v1/auth/login", data={"username": "test@example.com", "password": "password"})
    if res.status_code != 200:
        # maybe we need to create the user first
        httpx.post("http://127.0.0.1:8000/api/v1/auth/register", json={"email": "test404@example.com", "password": "password", "name": "Test"})
        res = httpx.post("http://127.0.0.1:8000/api/v1/auth/login", data={"username": "test404@example.com", "password": "password"})
        
    token = res.json()["access_token"]
    
    # 2. PUT to profile
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "full_name": "Test User",
        "phone": "1234567890",
    }
    res2 = httpx.put("http://127.0.0.1:8000/api/v1/profile/", json=payload, headers=headers)
    print("STATUS:", res2.status_code)
    print("BODY:", res2.text)

if __name__ == "__main__":
    main()
