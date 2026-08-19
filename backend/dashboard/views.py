import calendar
from datetime import date

from django.db.models import Sum
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from budgets.models import Budget
from expenses.models import Expense
from income.models import Income


class DashboardView(APIView):
    """GET /api/dashboard/  -- see docs/API_SPEC.md section 6."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        total_income = Income.objects.filter(user=user).aggregate(total=Sum("amount"))["total"] or 0
        total_expense = Expense.objects.filter(user=user).aggregate(total=Sum("amount"))["total"] or 0
        balance = total_income - total_expense

        monthly_expense = Expense.objects.filter(
            user=user, expense_date__month=today.month, expense_date__year=today.year,
        ).aggregate(total=Sum("amount"))["total"] or 0

        recent_expenses = list(
            Expense.objects.filter(user=user).select_related("category").order_by("-expense_date", "-created_at")[:5]
        )
        recent_incomes = list(
            Income.objects.filter(user=user).select_related("category").order_by("-income_date", "-created_at")[:5]
        )
        recent_transactions = sorted(
            [
                {
                    "type": "expense", "id": e.id, "category": e.category.name,
                    "amount": str(e.amount), "date": str(e.expense_date), "description": e.description,
                }
                for e in recent_expenses
            ] + [
                {
                    "type": "income", "id": i.id, "category": i.category.name,
                    "amount": str(i.amount), "date": str(i.income_date), "description": i.description,
                }
                for i in recent_incomes
            ],
            key=lambda t: t["date"], reverse=True,
        )[:5]

        category_expenses = list(
            Expense.objects.filter(user=user)
            .values("category__name")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )
        category_expenses = [{"category": c["category__name"], "total": str(c["total"])} for c in category_expenses]

        monthly_summary = []
        for i in range(5, -1, -1):
            month = today.month - i
            year = today.year
            while month <= 0:
                month += 12
                year -= 1
            inc = Income.objects.filter(user=user, income_date__month=month, income_date__year=year).aggregate(
                total=Sum("amount"))["total"] or 0
            exp = Expense.objects.filter(user=user, expense_date__month=month, expense_date__year=year).aggregate(
                total=Sum("amount"))["total"] or 0
            monthly_summary.append({
                "month": calendar.month_abbr[month], "year": year,
                "income": str(inc), "expense": str(exp),
            })

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": balance,
            "monthly_expense": monthly_expense,
            "recent_transactions": recent_transactions,
            "category_expenses": category_expenses,
            "monthly_summary": monthly_summary,
        })


class ReportsView(APIView):
    """GET /api/reports/?month=&year=&category=&type="""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(_build_report(request))


def _build_report(request):
    user = request.user
    month = request.query_params.get("month")
    year = request.query_params.get("year")
    category = request.query_params.get("category")
    tx_type = request.query_params.get("type")

    def apply_filters(qs, date_field):
        if month:
            qs = qs.filter(**{f"{date_field}__month": month})
        if year:
            qs = qs.filter(**{f"{date_field}__year": year})
        if category:
            qs = qs.filter(category_id=category)
        return qs

    expenses_qs = apply_filters(Expense.objects.filter(user=user).select_related("category"), "expense_date")
    incomes_qs = apply_filters(Income.objects.filter(user=user).select_related("category"), "income_date")

    rows = []
    if tx_type != "income":
        for e in expenses_qs.order_by("-expense_date"):
            rows.append({
                "type": "expense", "id": e.id, "category": e.category.name,
                "amount": str(e.amount), "date": str(e.expense_date),
                "payment_method": e.payment_method, "description": e.description,
            })
    if tx_type != "expense":
        for i in incomes_qs.order_by("-income_date"):
            rows.append({
                "type": "income", "id": i.id, "category": i.category.name,
                "amount": str(i.amount), "date": str(i.income_date),
                "payment_method": i.payment_method, "description": i.description,
            })
    rows.sort(key=lambda r: r["date"], reverse=True)

    total_income = incomes_qs.aggregate(total=Sum("amount"))["total"] or 0
    total_expense = expenses_qs.aggregate(total=Sum("amount"))["total"] or 0

    return {
        "results": rows,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
    }


class ExportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        import csv

        data = _build_report(request)
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="report.csv"'
        writer = csv.writer(response)
        writer.writerow(["Type", "Date", "Category", "Amount", "Payment Method", "Description"])
        for row in data["results"]:
            writer.writerow([
                row["type"], row["date"], row["category"], row["amount"],
                row.get("payment_method", ""), row.get("description", ""),
            ])
        return response


class ExportExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from openpyxl import Workbook

        data = _build_report(request)
        wb = Workbook()
        ws = wb.active
        ws.title = "Report"
        ws.append(["Type", "Date", "Category", "Amount", "Payment Method", "Description"])
        for row in data["results"]:
            ws.append([
                row["type"], row["date"], row["category"], float(row["amount"]),
                row.get("payment_method", ""), row.get("description", ""),
            ])

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="report.xlsx"'
        wb.save(response)
        return response
