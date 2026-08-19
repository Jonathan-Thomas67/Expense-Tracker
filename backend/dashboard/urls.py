from django.urls import path

from .views import DashboardView, ReportsView, ExportCSVView, ExportExcelView

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("reports/", ReportsView.as_view(), name="reports"),
    path("reports/export/csv/", ExportCSVView.as_view(), name="export-csv"),
    path("reports/export/excel/", ExportExcelView.as_view(), name="export-excel"),
]
