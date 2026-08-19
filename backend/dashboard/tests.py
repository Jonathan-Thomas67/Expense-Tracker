from rest_framework.test import APITestCase
from rest_framework import status

from categories.models import Category
from users.models import User


class DashboardTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="u1", email="u1@example.com", name="U1", password="pass123")
        self.exp_cat = Category.objects.create(name="Food", type="expense")
        self.inc_cat = Category.objects.create(name="Salary", type="income")
        login = self.client.post("/api/auth/login/", {"email": "u1@example.com", "password": "pass123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        self.client.post("/api/income/", {
            "category_id": self.inc_cat.id, "amount": "50000", "income_date": "2026-08-01",
            "payment_method": "Bank", "description": "Salary",
        })
        self.client.post("/api/expenses/", {
            "category_id": self.exp_cat.id, "amount": "18000", "expense_date": "2026-08-05",
            "payment_method": "UPI", "description": "Groceries",
        })

    def test_dashboard_totals(self):
        resp = self.client.get("/api/dashboard/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(float(resp.data["total_income"]), 50000)
        self.assertEqual(float(resp.data["total_expense"]), 18000)
        self.assertEqual(float(resp.data["balance"]), 32000)

    def test_reports_filter_by_type(self):
        resp = self.client.get("/api/reports/?type=expense")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(all(r["type"] == "expense" for r in resp.data["results"]))

    def test_csv_export(self):
        resp = self.client.get("/api/reports/export/csv/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp["Content-Type"], "text/csv")

    def test_excel_export(self):
        resp = self.client.get("/api/reports/export/excel/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
