import httpx

def main():
    with httpx.Client() as client:
        # Register
        client.post("http://127.0.0.1:8000/api/v1/auth/register", json={"email": "test404@example.com", "password": "password", "name": "Test"})
        
        # Login
        res = client.post("http://127.0.0.1:8000/api/v1/auth/login", data={"username": "test404@example.com", "password": "password"})
        token = res.json().get("access_token")
        print("TOKEN:", token[:10] if token else None)
        
        if not token:
            print(res.text)
            return

        headers = {"Authorization": f"Bearer {token}"}
        
        # Get profile
        res_get = client.get("http://127.0.0.1:8000/api/v1/profile/", headers=headers)
        print("GET PROFILE:", res_get.status_code, res_get.text)

        # PUT profile
        payload = {
            "full_name": "Test User",
            "phone": "1234567890",
            "skills": "react, python, cpp"
        }
        res_put = client.put("http://127.0.0.1:8000/api/v1/profile/", json=payload, headers=headers)
        print("PUT PROFILE /:", res_put.status_code, res_put.text)
        
        res_put2 = client.put("http://127.0.0.1:8000/api/v1/profile", json=payload, headers=headers)
        print("PUT PROFILE NO SLASH:", res_put2.status_code, res_put2.text)

if __name__ == "__main__":
    main()
