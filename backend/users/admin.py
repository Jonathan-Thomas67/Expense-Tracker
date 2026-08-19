from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = ("email", "name", "mobile", "role", "is_staff")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Extra info", {"fields": ("name", "mobile", "role")}),
    )


admin.site.register(User, UserAdmin)
