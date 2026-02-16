from rest_framework import views, permissions, response
from django.contrib.auth.models import User
from apps.products.models import Product
from apps.orders.models import Order


class AdminDashboardStats(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        revenue = sum(order.total_price for order in Order.objects.all())

        return response.Response(
            {
                "total_users": total_users,
                "total_products": total_products,
                "total_orders": total_orders,
                "revenue": revenue,
            }
        )
