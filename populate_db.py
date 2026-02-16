import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from apps.products.models import Category, Product

Category.objects.get_or_create(
    name="Fish", slug="fish", description="Fresh fish from the ocean"
)
Category.objects.get_or_create(
    name="Squid", slug="squid", description="High quality squid"
)
Category.objects.get_or_create(name="Crab", slug="crab", description="Tasty crabs")
Category.objects.get_or_create(
    name="Prawns", slug="prawns", description="Delicious prawns"
)

print("Categories created!")
