from rest_framework.test import APITestCase
from rest_framework import status

from users.models import User
from .models import Category


class CategoryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="u1", email="u1@example.com", name="U1", password="pass123")
        Category.objects.create(name="Food", type="expense", user=None)
        login = self.client.post("/api/auth/login/", {"email": "u1@example.com", "password": "pass123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

    def test_list_includes_defaults(self):
        resp = self.client.get("/api/categories/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 1)

    def test_create_custom_category(self):
        resp = self.client.post("/api/categories/", {"name": "Gym", "type": "expense"})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_cannot_delete_default_category(self):
        default = Category.objects.get(name="Food")
        resp = self.client.delete(f"/api/categories/{default.id}/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
