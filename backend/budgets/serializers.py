from django.db.models import Sum
from rest_framework import serializers

from categories.models import Category
from expenses.models import Expense
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all()
    )
    category_name = serializers.CharField(source="category.name", read_only=True)
    spent = serializers.SerializerMethodField()
    usage_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            "id", "category_id", "category_name", "month", "year", "amount",
            "spent", "usage_percentage", "created_at",
        ]

    def get_spent(self, obj):
        total = Expense.objects.filter(
            user=obj.user, category=obj.category,
            expense_date__month=obj.month, expense_date__year=obj.year,
        ).aggregate(total=Sum("amount"))["total"]
        return total or 0

    def get_usage_percentage(self, obj):
        spent = self.get_spent(obj)
        if obj.amount == 0:
            return 0
        return round(float(spent) / float(obj.amount) * 100, 2)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Budget amount must be greater than zero.")
        return value

    def validate(self, attrs):
        request = self.context["request"]
        category = attrs.get("category") or getattr(self.instance, "category", None)
        month = attrs.get("month") or getattr(self.instance, "month", None)
        year = attrs.get("year") or getattr(self.instance, "year", None)

        if category is not None and not (category.user_id is None or category.user_id == request.user.id):
            raise serializers.ValidationError({"category_id": "Invalid category."})

        qs = Budget.objects.filter(user=request.user, category=category, month=month, year=year)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "A budget already exists for this category, month and year."
            )
        return attrs
