from django_filters import rest_framework as django_filters
from rest_framework import viewsets, permissions

from .models import Income
from .serializers import IncomeSerializer


class IncomeFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name="category_id")
    from_date = django_filters.DateFilter(field_name="income_date", lookup_expr="gte")
    to_date = django_filters.DateFilter(field_name="income_date", lookup_expr="lte")

    class Meta:
        model = Income
        fields = ["category", "from_date", "to_date", "payment_method"]


class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = IncomeFilter
    search_fields = ["description"]
    ordering_fields = ["income_date", "amount", "created_at"]

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user).select_related("category")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
