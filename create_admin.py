import os
import sys
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

email = "maxanmax@gmail.com"
password = "maxanmax"
username = email

print("-" * 30)
print(f"Setting up admin user: {email}")

try:
    if User.objects.filter(username=username).exists():
        print("User exists. Updating password...")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()
        print("User credentials updated successfully!")
    else:
        print("User not found. Creating new superuser...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("New superuser created successfully!")

    # Verify authentication works
    user_check = authenticate(username=username, password=password)
    if user_check:
        print(f"VERIFICATION SUCCESS: User '{user_check.username}' can log in.")
    else:
        print("VERIFICATION FAILED: Authentication rejected credentials.")

    print("-" * 30)

except Exception as e:
    print(f"\nERROR: Could not setup user. Reason: {e}")
