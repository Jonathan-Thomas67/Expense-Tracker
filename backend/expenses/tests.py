from rest_framework.test import APITestCase
from rest_framework import status

from categories.models import Category
from users.models import User


class ExpenseTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="u1", email="u1@example.com", name="U1", password="pass123")
        self.other = User.objects.create_user(username="u2", email="u2@example.com", name="U2", password="pass123")
        self.category = Category.objects.create(name="Food", type="expense")
        login = self.client.post("/api/auth/login/", {"email": "u1@example.com", "password": "pass123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

    def test_create_expense(self):
        resp = self.client.post("/api/expenses/", {
            "category_id": self.category.id, "amount": "500", "expense_date": "2026-08-18",
            "payment_method": "UPI", "description": "Lunch",
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_negative_amount_rejected(self):
        resp = self.client.post("/api/expenses/", {
            "category_id": self.category.id, "amount": "-5", "expense_date": "2026-08-18",
            "payment_method": "UPI", "description": "Bad",
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_see_others_expenses(self):
        self.client.post("/api/expenses/", {
            "category_id": self.category.id, "amount": "100", "expense_date": "2026-08-18",
            "payment_method": "Cash", "description": "Mine",
        })
        login2 = self.client.post("/api/auth/login/", {"email": "u2@example.com", "password": "pass123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login2.data['access']}")
        resp = self.client.get("/api/expenses/")
        self.assertEqual(resp.data["count"], 0)

    def test_unauthenticated_blocked(self):
        self.client.credentials()
        resp = self.client.get("/api/expenses/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
