from rest_framework.test import APITestCase
from rest_framework import status

from categories.models import Category
from users.models import User


class BudgetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="u1", email="u1@example.com", name="U1", password="pass123")
        self.category = Category.objects.create(name="Food", type="expense")
        login = self.client.post("/api/auth/login/", {"email": "u1@example.com", "password": "pass123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

    def test_create_budget(self):
        resp = self.client.post("/api/budgets/", {
            "category_id": self.category.id, "month": 8, "year": 2026, "amount": "10000",
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_duplicate_budget_rejected(self):
        payload = {"category_id": self.category.id, "month": 8, "year": 2026, "amount": "10000"}
        self.client.post("/api/budgets/", payload)
        resp = self.client.post("/api/budgets/", payload)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_month_rejected(self):
        resp = self.client.post("/api/budgets/", {
            "category_id": self.category.id, "month": 13, "year": 2026, "amount": "10000",
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_budget_usage_percentage(self):
        self.client.post("/api/budgets/", {
            "category_id": self.category.id, "month": 8, "year": 2026, "amount": "1000",
        })
        self.client.post("/api/expenses/", {
            "category_id": self.category.id, "amount": "250", "expense_date": "2026-08-10",
            "payment_method": "Cash", "description": "test",
        })
        resp = self.client.get("/api/budgets/")
        self.assertEqual(resp.data["results"][0]["usage_percentage"], 25.0)
