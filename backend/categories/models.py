from django.conf import settings
from django.db import models


class Category(models.Model):
    TYPE_CHOICES = (
        ("expense", "Expense"),
        ("income", "Income"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
        null=True,
        blank=True,
        help_text="NULL represents a shared default category available to every user.",
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.type})"
