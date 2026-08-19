from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model based on docs/DATABASE_DESIGN.md `users` table.
    Extends Django's AbstractUser so we keep built-in password hashing,
    permissions and JWT compatibility for free.
    """

    ROLE_CHOICES = (
        ("user", "User"),
        ("admin", "Admin"),
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    mobile = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    created_at = models.DateTimeField(auto_now_add=True)

    # Login with email instead of username
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "name"]

    def __str__(self):
        return self.email
