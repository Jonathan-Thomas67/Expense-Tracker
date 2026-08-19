from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from decimal import Decimal


class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="budgets")
    category = models.ForeignKey("categories.Category", on_delete=models.PROTECT, related_name="budgets")
    month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    year = models.IntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "-month"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "category", "month", "year"],
                name="one_budget_per_user_category_month_year",
            )
        ]

    def __str__(self):
        return f"{self.category} budget {self.month}/{self.year}"
