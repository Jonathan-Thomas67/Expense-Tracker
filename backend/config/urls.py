from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls_auth")),
    path("api/", include("users.urls_profile")),
    path("api/", include("categories.urls")),
    path("api/", include("expenses.urls")),
    path("api/", include("income.urls")),
    path("api/", include("budgets.urls")),
    path("api/", include("dashboard.urls")),
]
