from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class AuthTests(APITestCase):
    def test_register_login_profile(self):
        reg = self.client.post("/api/auth/register/", {
            "name": "John", "email": "john@example.com", "mobile": "9876543210", "password": "pass123",
        })
        self.assertEqual(reg.status_code, status.HTTP_201_CREATED)

        login = self.client.post("/api/auth/login/", {"email": "john@example.com", "password": "pass123"})
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        access = login.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        profile = self.client.get("/api/profile/")
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.data["email"], "john@example.com")

    def test_duplicate_email_rejected(self):
        payload = {"name": "A", "email": "dup@example.com", "mobile": "1", "password": "pass123"}
        self.client.post("/api/auth/register/", payload)
        resp = self.client.post("/api/auth/register/", payload)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_wrong_password(self):
        self.client.post("/api/auth/register/", {
            "name": "A", "email": "a@example.com", "mobile": "1", "password": "pass123",
        })
        resp = self.client.post("/api/auth/login/", {"email": "a@example.com", "password": "wrong"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
