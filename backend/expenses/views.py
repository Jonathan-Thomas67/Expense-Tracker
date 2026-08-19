from django_filters import rest_framework as django_filters
from rest_framework import viewsets, permissions

from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name="category_id")
    from_date = django_filters.DateFilter(field_name="expense_date", lookup_expr="gte")
    to_date = django_filters.DateFilter(field_name="expense_date", lookup_expr="lte")

    class Meta:
        model = Expense
        fields = ["category", "from_date", "to_date", "payment_method"]


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = ExpenseFilter
    search_fields = ["description"]
    ordering_fields = ["expense_date", "amount", "created_at"]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).select_related("category")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
