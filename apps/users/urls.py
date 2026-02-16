from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"wishlists", WishlistViewSet, basename="wishlist")

urlpatterns = [
    path("", include(router.urls)),
]
