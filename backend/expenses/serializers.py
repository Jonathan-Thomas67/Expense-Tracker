from rest_framework import serializers

from categories.models import Category
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all()
    )
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Expense
        fields = [
            "id", "category_id", "category_name", "amount", "expense_date",
            "payment_method", "description", "created_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate_category_id(self, value):
        request = self.context["request"]
        if not (value.user_id is None or value.user_id == request.user.id):
            raise serializers.ValidationError("Invalid category.")
        if value.type != "expense":
            raise serializers.ValidationError("Category must be an expense category.")
        return value
