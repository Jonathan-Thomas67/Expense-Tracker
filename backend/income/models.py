from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from decimal import Decimal


class Income(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ("Cash", "Cash"),
        ("Card", "Card"),
        ("UPI", "UPI"),
        ("Bank", "Bank"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="incomes")
    category = models.ForeignKey("categories.Category", on_delete=models.PROTECT, related_name="incomes")
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    income_date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-income_date", "-created_at"]

    def __str__(self):
        return f"{self.user_id} - {self.amount} on {self.income_date}"
