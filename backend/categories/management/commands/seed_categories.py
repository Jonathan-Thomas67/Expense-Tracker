from django.core.management.base import BaseCommand

from categories.models import Category

EXPENSE_CATEGORIES = ["Food", "Travel", "Shopping", "Rent", "Education", "Utilities", "Others"]
INCOME_CATEGORIES = ["Salary", "Business", "Freelancing", "Investment", "Other Income"]


class Command(BaseCommand):
    help = "Creates the default shared expense/income categories (docs/SRS.md FR-05)."

    def handle(self, *args, **options):
        created = 0
        for name in EXPENSE_CATEGORIES:
            _, was_created = Category.objects.get_or_create(name=name, type="expense", user=None)
            created += was_created
        for name in INCOME_CATEGORIES:
            _, was_created = Category.objects.get_or_create(name=name, type="income", user=None)
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Seeded default categories ({created} created)."))
